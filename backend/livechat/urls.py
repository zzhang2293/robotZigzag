from django.urls import path

from livechat import views

# These are currently not in use - see the asgi.py file
# in zigzag_backend for current routes

urlpatterns = [
    path("new_message", views.new_message, name="new_message"),
]
