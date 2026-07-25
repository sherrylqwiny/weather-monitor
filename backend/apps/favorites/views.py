from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import IntegrityError

from .models import FavoriteCity
from .serializers import FavoriteCitySerializer
from apps.weather.models import CurrentWeather
from apps.weather.weather_api import WeatherAPIClient


def favorite_weather(city):
    weather = CurrentWeather.objects.select_related("station").filter(
        station__city__iexact=city,
        station__is_active=True,
    ).first()
    if weather is None:
        return None
    return {
        "city": weather.station.city,
        "country": weather.station.country,
        "temperature": weather.temperature,
        "feels_like": weather.feels_like,
        "humidity": weather.humidity,
        "wind_speed": weather.wind_speed,
        "weather_condition": weather.weather_condition,
        "weather_icon": weather.weather_icon,
        "updated_at": weather.updated_at,
    }


class FavoriteCityViewSet(viewsets.ModelViewSet):
    queryset = FavoriteCity.objects.all()
    serializer_class = FavoriteCitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_keys = [str(self.request.user.pk), self.request.user.username, self.request.user.email]
        return FavoriteCity.objects.filter(user__in=user_keys).order_by("-created_at")

    def perform_create(self, serializer):
        user = str(self.request.user.pk)
        city = serializer.validated_data["city"]
        try:
            serializer.save(user=user, city=city)
        except IntegrityError:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"city": "This city is already in your favorites."})

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        for item in response.data:
            item["weather"] = favorite_weather(item["city"])
        return response

    @action(detail=False, methods=["post"])
    def add(self, request):
        """Add a city and return its latest persisted weather."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        data = serializer.data
        data["weather"] = favorite_weather(data["city"])
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def weather(self, request, pk=None):
        favorite = self.get_object()
        weather = favorite_weather(favorite.city)
        if weather is None:
            return Response({"error": "Weather data is not available for this city."}, status=status.HTTP_404_NOT_FOUND)
        return Response(weather)

    @action(detail=True, methods=["post"])
    def refresh_weather(self, request, pk=None):
        """Refresh one favorite from OpenWeather, then return current conditions."""
        favorite = self.get_object()
        try:
            WeatherAPIClient().sync_city(favorite.city)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception:
            return Response({"error": "Weather provider is temporarily unavailable."}, status=status.HTTP_502_BAD_GATEWAY)
        return Response(favorite_weather(favorite.city))
