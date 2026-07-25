from datetime import timedelta

from django.utils import timezone

from apps.favorites.models import FavoriteCity
from apps.weather.models import CurrentWeather, HourlyForecast

from .models import WeatherAlert


def _create_alert(user_id, city, alert_type, message, severity, details):
    """Create one alert per rule/city/day to avoid notification spam."""
    today = timezone.localdate()
    already_exists = WeatherAlert.objects.filter(
        user=str(user_id),
        city__iexact=city,
        alert_type=alert_type,
        created_at__date=today,
    ).exists()
    if already_exists:
        return None
    return WeatherAlert.objects.create(
        user=str(user_id),
        city=city,
        alert_type=alert_type,
        message=message,
        severity=severity,
        details=details,
        expires_at=timezone.now() + timedelta(hours=24),
    )


def generate_alerts_for_user(user):
    """Generate notifications from current and near-term forecast data."""
    user_keys = [str(user.pk), user.username, user.email]
    favorites = FavoriteCity.objects.filter(user__in=user_keys)
    generated = []

    for favorite in favorites:
        city = favorite.city
        current = CurrentWeather.objects.select_related("station").filter(
            station__city__iexact=city,
            station__is_active=True,
        ).first()
        if current is None:
            continue

        if current.temperature >= 35:
            alert = _create_alert(
                user.pk, city, "high_temperature",
                f"High temperature alert: {current.temperature:.1f}°C in {city}.",
                "high", {"temperature": current.temperature, "threshold": 35},
            )
            if alert:
                generated.append(alert)

        if current.wind_speed >= 17:
            alert = _create_alert(
                user.pk, city, "strong_wind",
                f"Strong wind alert: {current.wind_speed:.1f} m/s in {city}.",
                "high", {"wind_speed": current.wind_speed, "threshold": 17},
            )
            if alert:
                generated.append(alert)

        forecast = HourlyForecast.objects.filter(
            station=current.station,
            forecast_time__gte=timezone.now(),
            forecast_time__lte=timezone.now() + timedelta(hours=6),
        ).order_by("forecast_time").first()
        if forecast and (forecast.precipitation_amount >= 20 or forecast.precipitation_chance >= 80):
            alert = _create_alert(
                user.pk, city, "heavy_rain",
                f"Heavy rainfall expected in {city}: {forecast.precipitation_amount:.1f} mm.",
                "high", {
                    "precipitation_amount": forecast.precipitation_amount,
                    "precipitation_chance": forecast.precipitation_chance,
                },
            )
            if alert:
                generated.append(alert)

        air_quality_index = current.air_quality_index if hasattr(current, "air_quality_index") else None
        if air_quality_index is not None and air_quality_index >= 4:
            alert = _create_alert(
                user.pk, city, "air_quality",
                f"Poor air quality alert in {city}. Avoid prolonged outdoor activity.",
                "moderate" if air_quality_index == 4 else "high",
                {"air_quality_index": air_quality_index, "threshold": 4},
            )
            if alert:
                generated.append(alert)

    return generated


def get_alert_summary(user=None):
    """Return total and unread alert counts, optionally scoped to a user."""
    alerts = WeatherAlert.objects.all()
    if user is not None:
        user_keys = [str(user.pk), user.username, user.email, ""]
        alerts = alerts.filter(user__in=user_keys)

    return {
        "total": alerts.count(),
        "unread": alerts.filter(is_read=False).count(),
    }
