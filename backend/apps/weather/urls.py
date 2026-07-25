from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    WeatherStationViewSet,
    CurrentWeatherViewSet,
    HourlyForecastViewSet,
    DailyForecastViewSet,
    WeatherHistoryViewSet,
    WeatherRecordViewSet,
)

router = DefaultRouter()
router.register(r'stations', WeatherStationViewSet, basename='station')
router.register(r'current', CurrentWeatherViewSet, basename='current-weather')
router.register(r'hourly', HourlyForecastViewSet, basename='hourly-forecast')
router.register(r'daily', DailyForecastViewSet, basename='daily-forecast')
router.register(r'history', WeatherHistoryViewSet, basename='weather-history')
router.register(r'records', WeatherRecordViewSet, basename='weather-record')

urlpatterns = [
    path('', include(router.urls)),
]
