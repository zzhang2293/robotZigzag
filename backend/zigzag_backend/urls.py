"""
URL configuration for zigzag_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from accounts.views import ProfileViewSet
from maze.views import (
    RunResultViewSet,
    MazeConfigurationViewSet,
    RobotConfigurationViewSet,
    SnippetViewSet,
)
from tournament.views import TournamentViewSet
from zigzag_backend import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"tournaments", TournamentViewSet, basename="tournament")
router.register(r"profiles", ProfileViewSet, basename="profile")
router.register(r"run_results", RunResultViewSet)
router.register(r"snippets", SnippetViewSet, basename="snippet")
router.register(
    r"maze_configurations", MazeConfigurationViewSet, basename="maze_configurations"
)
router.register(r"robot_configurations", RobotConfigurationViewSet)

urlpatterns = [
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin.site.urls),
    path("backend/", include(router.urls)),
    path(r"backend/auth/", include("djoser.urls")),
    path(r"backend/auth/", include("djoser.urls.authtoken")),
    path(r"backend/communication/", include("communication.urls")),
    path(r"backend/chat/", include("livechat.urls")),
]
