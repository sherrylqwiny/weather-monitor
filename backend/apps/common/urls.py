from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AppVersionViewSet,
    OfflineSyncLogViewSet,
    health_check,
    cached_weather_endpoint,
)

router = DefaultRouter()
router.register(r"versions", AppVersionViewSet, basename="app-version")
router.register(r"sync-log", OfflineSyncLogViewSet, basename="offline-sync-log")

urlpatterns = [
    path("", include(router.urls)),
    path("health/", health_check, name="health-check"),
    path("weather/cached/", cached_weather_endpoint, name="cached-weather"),
]
