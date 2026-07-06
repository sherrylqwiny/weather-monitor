from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import WeatherRecordViewSet

router = DefaultRouter()
router.register(r"records", WeatherRecordViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
