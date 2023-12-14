import json

import channels.layers
from asgiref.sync import async_to_sync
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.authtoken.models import Token

from accounts.models import Profile

channel_layer = channels.layers.get_channel_layer()


@csrf_exempt
@require_POST
def new_message(request):
    """
    When a POST request is received, have that message be received by the
    websocket consumer to broadcast to all listening clients.
    """
    token_str = request.headers.get("Authorization").split(" ")[1]
    token = Token.objects.get(key=token_str)
    data = json.loads(request.body)
    async_to_sync(channel_layer.group_send)(
        f"chat_{data['room']}",
        {
            "type": "chat.message",
            "message": data["message"],
            "sender": Profile.objects.get(user=token.user).display_name
            or token.user.username,
        },
    )
    return HttpResponse("Ok", status=200)
