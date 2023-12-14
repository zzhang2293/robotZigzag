from django.urls import path

from livechat import consumers

websocket_urlpatterns = [
    path(r"backend/chat/ws/tournament/", consumers.ChatConsumer.as_asgi()),
]
