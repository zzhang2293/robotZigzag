from django.urls import path
from . import views

urlpatterns = [
    path("receive_file/", views.receive_file, name="receive_file"),
]
