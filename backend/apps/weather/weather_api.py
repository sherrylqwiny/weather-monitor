import os
from datetime import datetime, timezone
from urllib.parse import urlencode

import requests
from django.conf import settings
from django.core.cache import cache
from django.db import transaction

from .models import CurrentWeather, DailyForecast, HourlyForecast, WeatherStation


class WeatherAPIClient:
    def __init__(self, api_key=None, base_url=None):
        self.api_key = api_key or getattr(settings, "OPENWEATHER_API_KEY", "") or os.getenv("OPENWEATHER_API_KEY")
        self.base_url = base_url or getattr(
            settings,
            "OPENWEATHER_BASE_URL",
            "https://api.openweathermap.org/data/2.5",
        )
        self.cache_ttl = getattr(settings, "OPENWEATHER_CACHE_TTL", 600)

    def _get(self, endpoint, params):
        if not self.api_key:
            raise ValueError("OPENWEATHER_API_KEY is not configured")

        encoded_params = urlencode(sorted(params.items()))
        cache_key = f"openweather:{endpoint}:{encoded_params}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached

        response = requests.get(
            f"{self.base_url}/{endpoint}",
            params={**params, "appid": self.api_key, "units": "metric"},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        cache.set(cache_key, data, self.cache_ttl)
        return data

    def get_current_weather(self, city):
        return self._get("weather", {"q": city})

    def get_forecast(self, city):
        return self._get("forecast", {"q": city})

    def get_air_quality(self, latitude, longitude):
        return self._get("air_pollution", {"lat": latitude, "lon": longitude})

    @transaction.atomic
    def sync_city(self, city):
        """Fetch live data, normalize it, and persist the latest records."""
        current = self.get_current_weather(city)
        forecast = self.get_forecast(city)
        coordinates = current.get("coord", {})
        try:
            air_quality = self.get_air_quality(coordinates.get("lat"), coordinates.get("lon"))
        except requests.RequestException:
            air_quality = None
        station = self._upsert_station(current)
        self._upsert_current_weather(station, current, air_quality)
        self._upsert_forecasts(station, forecast)
        return station

    def _upsert_station(self, current):
        coordinates = current.get("coord", {})
        city = current.get("name", "")
        country = current.get("sys", {}).get("country", "")
        station, _ = WeatherStation.objects.update_or_create(
            name=f"{city}, {country}",
            defaults={
                "city": city,
                "country": country,
                "latitude": coordinates.get("lat", 0),
                "longitude": coordinates.get("lon", 0),
                "timezone": "UTC",
                "is_active": True,
            },
        )
        return station

    def _upsert_current_weather(self, station, current, air_quality=None):
        main = current.get("main", {})
        wind = current.get("wind", {})
        weather = current.get("weather", [{}])[0]
        CurrentWeather.objects.update_or_create(
            station=station,
            defaults={
                "temperature": main.get("temp", 0),
                "feels_like": main.get("feels_like", 0),
                "humidity": main.get("humidity", 0),
                "pressure": main.get("pressure", 0),
                "wind_speed": wind.get("speed", 0),
                "wind_direction": wind.get("deg", 0),
                "visibility": current.get("visibility", 0),
                "air_quality_index": (
                    (air_quality or {}).get("list", [{}])[0]
                    .get("main", {}).get("aqi")
                    if air_quality else None
                ),
                "cloud_coverage": current.get("clouds", {}).get("all", 0),
                "weather_condition": weather.get("main", "Unknown"),
                "weather_description": weather.get("description", ""),
                "weather_icon": weather.get("icon", ""),
                "sunrise": datetime.fromtimestamp(
                    current.get("sys", {}).get("sunrise", 0), tz=timezone.utc
                ).time(),
                "sunset": datetime.fromtimestamp(
                    current.get("sys", {}).get("sunset", 0), tz=timezone.utc
                ).time(),
            },
        )

    def _upsert_forecasts(self, station, forecast):
        hourly = forecast.get("list", [])
        for item in hourly:
            forecast_time = datetime.fromtimestamp(
                item.get("dt", 0), tz=timezone.utc
            )
            main = item.get("main", {})
            wind = item.get("wind", {})
            weather = item.get("weather", [{}])[0]
            rain = item.get("rain", {}).get("3h", 0)
            HourlyForecast.objects.update_or_create(
                station=station,
                forecast_time=forecast_time,
                defaults={
                    "temperature": main.get("temp", 0),
                    "feels_like": main.get("feels_like", 0),
                    "humidity": main.get("humidity", 0),
                    "pressure": main.get("pressure", 0),
                    "wind_speed": wind.get("speed", 0),
                    "wind_direction": wind.get("deg", 0),
                    "cloud_coverage": item.get("clouds", {}).get("all", 0),
                    "precipitation_chance": round(item.get("pop", 0) * 100),
                    "precipitation_amount": rain,
                    "weather_condition": weather.get("main", "Unknown"),
                    "weather_description": weather.get("description", ""),
                    "weather_icon": weather.get("icon", ""),
                },
            )

        # OpenWeather's free forecast endpoint provides 3-hour data. Aggregate it
        # into daily records for the application's weekly forecast screen.
        by_date = {}
        for item in hourly:
            date = datetime.fromtimestamp(item.get("dt", 0), tz=timezone.utc).date()
            by_date.setdefault(date, []).append(item)

        for date, items in by_date.items():
            temperatures = [item.get("main", {}).get("temp", 0) for item in items]
            first = items[0]
            weather = first.get("weather", [{}])[0]
            wind_speeds = [item.get("wind", {}).get("speed", 0) for item in items]
            precipitation = sum(item.get("rain", {}).get("3h", 0) for item in items)
            DailyForecast.objects.update_or_create(
                station=station,
                forecast_date=date,
                defaults={
                    "temp_max": max(temperatures),
                    "temp_min": min(temperatures),
                    "humidity_avg": round(sum(item.get("main", {}).get("humidity", 0) for item in items) / len(items)),
                    "wind_speed_avg": sum(wind_speeds) / len(wind_speeds),
                    "precipitation_chance": max(round(item.get("pop", 0) * 100) for item in items),
                    "precipitation_amount": precipitation,
                    "weather_condition": weather.get("main", "Unknown"),
                    "weather_description": weather.get("description", ""),
                    "weather_icon": weather.get("icon", ""),
                    "sunrise": datetime.now(timezone.utc).time(),
                    "sunset": datetime.now(timezone.utc).time(),
                },
            )
