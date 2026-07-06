from rest_framework import viewsets

from .models import FavoriteCity
from .serializers import FavoriteCitySerializer


class FavoriteCityViewSet(viewsets.ModelViewSet):
    queryset = FavoriteCity.objects.all().order_by("-created_at")
    serializer_class = FavoriteCitySerializer
