from typing import Optional

from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.contrib.auth.models import User
from django.test import TestCase as DjangoTestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from livechat.consumers import ChatConsumer
from livechat.models import OnlineUser
from zigzag_backend.asgi import TokenAuthMiddleware


@database_sync_to_async
def get_token_from_user(username):
    """
    Get a token related to a given username
    :param username: The username of the user whose token will be returned
    :return: A token related to the user with the username `username`
    """
    if User.objects.filter(username=username).first():
        return Token.objects.get(user=User.objects.get(username=username))
    user = User.objects.create_user(username)
    user.save()
    token = Token.objects.create(user=user)
    token.save()
    return token


async def get_auth_connection_from_user(username="test_user"):
    """
    Get an authenticated ws connection to the general chat
    :param username: The username to connect as
    :return: A tuple of the authenticated communicator, and whether the connection
    was successful
    """
    token = await get_token_from_user(username)
    communicator = WebsocketCommunicator(
        TokenAuthMiddleware(ChatConsumer.as_asgi()),
        f"backend/ws/chat/general?token={token.key}",
    )
    connected, sub_protocol = await communicator.connect()
    return communicator, connected


class ChatTests(APITestCase, DjangoTestCase):
    """
    Unit tests for the general chat
    """

    def test_new_message_url(self):
        """Verify that the URL for posting a new message is correct"""
        self.assertEqual("/backend/chat/new_message", reverse("new_message"))

    async def test_reject_no_auth(self):
        """If a user does not provide a token it should be rejected"""
        communicator = WebsocketCommunicator(
            TokenAuthMiddleware(ChatConsumer.as_asgi()),
            "backend/ws/chat/general",
        )

        connected, sub_protocol = await communicator.connect()
        self.assertFalse(connected)

    async def test_reject_wrong_auth(self):
        """If the token is invalid the connection should be rejected"""
        communicator = WebsocketCommunicator(
            TokenAuthMiddleware(ChatConsumer.as_asgi()),
            "backend/ws/chat/general?token=invalid_token",
        )

        connected, sub_protocol = await communicator.connect()
        self.assertFalse(connected)

    async def test_can_connect_authenticated(self):
        """An authenticated connection should be able to connect"""
        connection, connected = await get_auth_connection_from_user()
        self.assertTrue(connected)

    async def test_receive_connection_message_first_connection(self):
        """The first message received upon connecting for
        the first time is an `online` message"""
        connection, connected = await get_auth_connection_from_user()
        self.assertDictEqual(
            {"username": "test_user", "type": "online", "count": 1},
            await connection.receive_json_from(),
        )

    async def test_receive_sync_message_second_connection(self):
        """The first message received upon connecting a second time is a
        `sync` message"""
        _connection1, _connected1 = await get_auth_connection_from_user()
        connection2, connected2 = await get_auth_connection_from_user()

        self.assertDictEqual(
            {"type": "sync", "count": 1},
            await connection2.receive_json_from(),
        )

    async def test_other_user_join(self):
        """When a second user joins for the first time both users should be notified"""
        connection1, connected1 = await get_auth_connection_from_user()
        connection2, connected2 = await get_auth_connection_from_user("test_user_2")

        self.assertDictEqual(
            {"username": "test_user", "type": "online", "count": 1},
            await connection1.receive_json_from(),
        )

        self.assertDictEqual(
            {"username": "test_user_2", "type": "online", "count": 2},
            await connection2.receive_json_from(),
        )

        self.assertDictEqual(
            {"username": "test_user_2", "type": "online", "count": 2},
            await connection1.receive_json_from(),
        )

    async def test_other_user_leave(self):
        """When a second user leaves both users should be notified"""
        connection1, connected1 = await get_auth_connection_from_user()
        connection2, connected2 = await get_auth_connection_from_user("test_user_2")

        self.assertDictEqual(
            {"username": "test_user_2", "type": "online", "count": 2},
            await connection2.receive_json_from(),
        )

        await connection1.disconnect()

        self.assertDictEqual(
            {"username": "test_user", "type": "offline", "count": 1},
            await connection2.receive_json_from(),
        )

    async def test_connection_counter(self):
        """Check if the OnlineUser counter is created and increases
        for a user each time a user opens an additional connection.
        The counter should decrease and be deleted when the user
        disconnects sessions."""

        @database_sync_to_async
        def get_counter():
            return OnlineUser.objects.filter(user__username="test_user").first()

        self.assertIsNone(await get_counter())
        connection, _connected = await get_auth_connection_from_user("test_user")

        new_count: Optional[OnlineUser] = await get_counter()
        self.assertIsNotNone(new_count)
        self.assertEqual(1, new_count.count)

        connection2, _connected2 = await get_auth_connection_from_user("test_user")

        new_count: Optional[OnlineUser] = await get_counter()
        self.assertIsNotNone(new_count)
        self.assertEqual(2, new_count.count)

        await connection.disconnect()

        new_count: Optional[OnlineUser] = await get_counter()
        self.assertIsNotNone(new_count)
        self.assertEqual(1, new_count.count)

        await connection2.disconnect()

        self.assertIsNone(await get_counter())

    async def test_logout_deletes_counter(self):
        """Check if deleting a user's token clears their counter"""

        @database_sync_to_async
        def get_counter():
            return OnlineUser.objects.filter(user__username="test_user").first()

        @database_sync_to_async
        def set_counter(value):
            counter_ = OnlineUser.objects.filter(user__username="test_user").first()
            counter_.count = value
            counter_.save()

        @database_sync_to_async
        def delete_token(token_: Token):
            token_.delete()

        token = await get_token_from_user("test_user")
        _connection, _connected = await get_auth_connection_from_user("test_user")

        await set_counter(10)

        counter: Optional[OnlineUser] = await get_counter()
        self.assertIsNotNone(counter)
        self.assertEqual(10, counter.count)

        await delete_token(token)

        self.assertIsNone(await get_counter())

    async def test_login_deletes_counter(self):
        """Check if creating a new token for a user clears their counter"""

        @database_sync_to_async
        def get_counter():
            return OnlineUser.objects.filter(user__username="test_user").first()

        @database_sync_to_async
        def create_counter(value):
            user = User.objects.create_user("test_user")
            user.save()
            counter_ = OnlineUser(user=user, count=value)
            counter_.save()

        @database_sync_to_async
        def create_new_token():
            Token.objects.create(user=User.objects.get(username="test_user"))

        await create_counter(10)

        counter: Optional[OnlineUser] = await get_counter()
        self.assertIsNotNone(counter)
        self.assertEqual(10, counter.count)

        await create_new_token()

        self.assertIsNone(await get_counter())

    async def test_send_receive_message(self):
        """Check if messages can be sent and received"""
        connection, connected = await get_auth_connection_from_user()
        await connection.receive_json_from()

        @database_sync_to_async
        def post_message():
            self.client.credentials(
                HTTP_AUTHORIZATION="Token "
                + Token.objects.get(user=User.objects.get(username="test_user")).key
            )
            response = self.client.post(
                reverse("new_message"),
                data={"room": "general", "message": "hello world"},
                format="json",
                follow=True,
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        await post_message()

        self.assertDictEqual(
            {"sender": "test_user", "type": "message", "message": "hello world"},
            await connection.receive_json_from(),
        )
