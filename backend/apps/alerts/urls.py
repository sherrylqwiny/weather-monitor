from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import WeatherAlertViewSet

router = DefaultRouter()
router.register(r"alerts", WeatherAlertViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
