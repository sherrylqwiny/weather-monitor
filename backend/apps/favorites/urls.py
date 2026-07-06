from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FavoriteCityViewSet

router = DefaultRouter()
router.register(r"favorites", FavoriteCityViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
