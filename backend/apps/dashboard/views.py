from datetime import timedelta

from django.db.models import Avg, Max, Min, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.alerts.models import WeatherAlert
from apps.favorites.models import FavoriteCity
from apps.weather.models import CurrentWeather, DailyForecast, WeatherHistory

from .serializers import DashboardSummarySerializer


def weather_payload(weather):
    if weather is None:
        return None
    station = weather.station
    return {
        "id": weather.id,
        "city": station.city,
        "country": station.country,
        "temperature": weather.temperature,
        "feels_like": weather.feels_like,
        "humidity": weather.humidity,
        "wind_speed": weather.wind_speed,
        "weather_condition": weather.weather_condition,
        "weather_description": weather.weather_description,
        "weather_icon": weather.weather_icon,
        "updated_at": weather.updated_at,
    }


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        week_start = today - timedelta(days=6)
        user_keys = {str(request.user.pk), request.user.username, request.user.email}

        favorites = FavoriteCity.objects.filter(user__in=user_keys).order_by("created_at")
        favorite_weather = []
        for favorite in favorites:
            weather = CurrentWeather.objects.select_related("station").filter(
                station__city__iexact=favorite.city,
                station__is_active=True,
            ).first()
            favorite_weather.append({
                "city": favorite.city,
                "favorite_id": favorite.id,
                "weather": weather_payload(weather),
            })

        current_weather = CurrentWeather.objects.select_related("station").filter(
            station__is_active=True,
        ).order_by("-updated_at").first()

        forecasts = DailyForecast.objects.select_related("station").filter(
            station__is_active=True,
            forecast_date__gte=today,
            forecast_date__lte=today + timedelta(days=6),
        ).order_by("forecast_date")
        weekly_trends = [
            {
                "date": forecast.forecast_date,
                "city": forecast.station.city,
                "temperature_max": forecast.temp_max,
                "temperature_min": forecast.temp_min,
                "precipitation_chance": forecast.precipitation_chance,
                "weather_condition": forecast.weather_condition,
            }
            for forecast in forecasts
        ]

        history = WeatherHistory.objects.filter(
            station__is_active=True,
            recorded_date__gte=week_start,
            recorded_date__lte=today,
        )
        aggregates = history.aggregate(
            average_temperature=Avg("temperature_avg"),
            highest_temperature=Max("temperature_max"),
            lowest_temperature=Min("temperature_min"),
            total_precipitation=Sum("precipitation_total"),
            average_humidity=Avg("humidity_avg"),
        )
        weather_statistics = {
            key: round(value, 1) if value is not None else None
            for key, value in aggregates.items()
        }

        highlights = []
        if current_weather:
            highlights = [
                {"label": "Current temperature", "value": f"{current_weather.temperature:.1f}°C"},
                {"label": "Humidity", "value": f"{current_weather.humidity}%"},
                {"label": "Wind", "value": f"{current_weather.wind_speed:.1f} m/s"},
                {"label": "Condition", "value": current_weather.weather_condition},
            ]

        alerts = WeatherAlert.objects.filter(
            city__in=[item.city for item in favorites] if favorites else None,
        ).order_by("-created_at")[:5] if favorites else WeatherAlert.objects.order_by("-created_at")[:5]
        recent_alerts = [
            {
                "id": alert.id,
                "city": alert.city,
                "alert_type": alert.alert_type,
                "message": alert.message,
                "severity": alert.severity,
                "created_at": alert.created_at,
            }
            for alert in alerts
        ]

        payload = {
            "summary": {
                "favorite_count": favorites.count(),
                "alert_count": len(recent_alerts),
                "forecast_days": len(weekly_trends),
                "last_updated": current_weather.updated_at if current_weather else None,
            },
            "current_weather": weather_payload(current_weather),
            "favorite_cities": favorite_weather,
            "todays_highlights": highlights,
            "weekly_trends": weekly_trends,
            "weather_statistics": weather_statistics,
            "recent_alerts": recent_alerts,
        }
        serializer = DashboardSummarySerializer(payload)
        return Response(serializer.data)