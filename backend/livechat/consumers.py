import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from accounts.models import Profile
from livechat.models import OnlineUser
from livechat.views import channel_layer


@database_sync_to_async
def _increment_counter(user):
    """
    Increment the counter for the OnlineUser object related to `user`
    :param user: The user model who's OnlineUser counter should be increased
    :return: A tuple who's first value is a boolean which is true when the counter
    signifies that this is the user's first connection, and who's second value is
    the number of online users
    """
    try:
        online_user = OnlineUser.objects.get(user=user)
    except OnlineUser.DoesNotExist:
        online_user = OnlineUser(user=user)
    online_user.count += 1
    online_user.save()
    return online_user.count == 1, len(OnlineUser.objects.all())


@database_sync_to_async
def _decrement_counter(user):
    """
    Increment the counter for the OnlineUser object related to `user`
    :param user: The user model who's OnlineUser counter should be decreased
    :return: A tuple who's first value is a boolean which is true when the counter
    signifies that this is the user's final connection, and who's second value is
    the number of online users
    """
    try:
        online_user = OnlineUser.objects.get(user=user)
    except OnlineUser.DoesNotExist:
        online_user = OnlineUser(user=user)
    online_user.count -= 1
    if online_user.count <= 0:
        try:
            online_user.delete()
        except ValueError:
            pass  # Already deleted due to logout signal
        return True, len(OnlineUser.objects.all())
    else:
        online_user.save()
        return False, len(OnlineUser.objects.all())


@database_sync_to_async
def _get_display_name(user):
    """Get the display name of a user"""
    return Profile.objects.get(user=user).display_name or user.username


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Defines the websocket consumer for the LiveChat system
    """

    room_name: str
    room_group_name: str

    async def connect(self):
        """
        Runs when a new connection to the websocket is being made
        """

        self.room_name = "general"
        self.room_group_name = "chat_general"

        # Check that user is authenticated
        user = self.scope.get("user")
        if not user:
            await self.close()
            return

        if not user.is_authenticated:
            await self.close()
            return

        now_online, online_users = await _increment_counter(user)

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # If the user is now online
        if now_online:
            await channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat.online",
                    "username": await _get_display_name(user),
                    "count": online_users,
                },
            )
        # If the user was already online
        else:
            await self.send(
                text_data=json.dumps({"type": "sync", "count": online_users})
            )

    async def disconnect(self, _close_code):
        """
        Runs when a user's connection to the websocket is broken/ended
        """

        user = self.scope["user"]

        if user.is_authenticated:
            now_offline, online_users = await _decrement_counter(user)
            # If the user is now offline announce that to the world
            if now_offline:
                await channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat.offline",
                        "username": await _get_display_name(user),
                        "count": online_users,
                    },
                )

        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def chat_message(self, event):
        """
        Event for when a `chat.message` is received to broadcast the message to
        all users. This lets users know that there is a new message in the chat.
        """
        message = event["message"]
        sender = event["sender"]

        # Send message to websocket
        await self.send(
            text_data=json.dumps(
                {"message": message, "sender": sender, "type": "message"}
            )
        )

    async def chat_online(self, event):
        """
        Event for when a `chat.online` is received to broadcast the message to
        all users. This lets people know a new user is online.
        """
        username = event["username"]
        count = event["count"]

        # Send message to websocket
        await self.send(
            text_data=json.dumps(
                {"username": username, "type": "online", "count": count}
            )
        )

    async def chat_offline(self, event):
        """
        Event for when a `chat.offline` is received to broadcast the message to
        all users. This lets people know that a user is now offline.
        """
        username = event["username"]
        count = event["count"]

        # Send message to websocket
        await self.send(
            text_data=json.dumps(
                {"username": username, "type": "offline", "count": count}
            )
        )
