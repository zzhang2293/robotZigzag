# flake8: noqa

from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()

from urllib.parse import parse_qs, urlparse

from channels.db import database_sync_to_async
from channels.routing import ProtocolTypeRouter, URLRouter
from django.contrib.auth.models import AnonymousUser

from django.urls import re_path
from rest_framework.authtoken.models import Token

from livechat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"backend/ws/chat/general", ChatConsumer.as_asgi(), name="ws_chat_general"),
]


@database_sync_to_async
def get_user(token):
    if token is None:
        return AnonymousUser()
    try:
        return Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    """
    Middleware that takes user IDs from the query token.
    TODO: change to use headers instead of query string
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        """Retrieve the token from the query string and save it in the scope"""
        query_string = scope["query_string"].decode()
        parsed_query = parse_qs(urlparse("?" + query_string).query)
        token = parsed_query.get("token", [None])[0]
        scope["user"] = await get_user(token)

        return await self.app(scope, receive, send)


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
