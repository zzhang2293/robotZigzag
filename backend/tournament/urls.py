from django.urls import path, include
from rest_framework import routers

from tournament import views

router = routers.DefaultRouter()
router.register(r"tournaments", views.TournamentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
