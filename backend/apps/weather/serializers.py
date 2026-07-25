from rest_framework import serializers
from .models import (
    WeatherStation,
    CurrentWeather,
    HourlyForecast,
    DailyForecast,
    WeatherHistory,
    WeatherRecord,
)


class WeatherStationSerializer(serializers.ModelSerializer):
    """Serializer for WeatherStation"""
    class Meta:
        model = WeatherStation
        fields = [
            'id',
            'name',
            'city',
            'country',
            'latitude',
            'longitude',
            'timezone',
            'is_active',
            'created_at',
            'updated_at',
        ]


class CurrentWeatherSerializer(serializers.ModelSerializer):
    """Serializer for CurrentWeather"""
    station = WeatherStationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        source='station',
        queryset=WeatherStation.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = CurrentWeather
        fields = [
            'id',
            'station',
            'station_id',
            'temperature',
            'feels_like',
            'humidity',
            'pressure',
            'wind_speed',
            'wind_direction',
            'visibility',
            'uv_index',
            'air_quality_index',
            'cloud_coverage',
            'weather_condition',
            'weather_description',
            'weather_icon',
            'sunrise',
            'sunset',
            'updated_at',
        ]

class HourlyForecastSerializer(serializers.ModelSerializer):
    """Serializer for HourlyForecast"""
    station = WeatherStationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        source='station',
        queryset=WeatherStation.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = HourlyForecast
        fields = [
            'id',
            'station',
            'station_id',
            'forecast_time',
            'temperature',
            'feels_like',
            'humidity',
            'pressure',
            'wind_speed',
            'wind_direction',
            'cloud_coverage',
            'precipitation_chance',
            'precipitation_amount',
            'weather_condition',
            'weather_description',
            'weather_icon',
            'created_at',
        ]


class DailyForecastSerializer(serializers.ModelSerializer):
    """Serializer for DailyForecast"""
    station = WeatherStationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        source='station',
        queryset=WeatherStation.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = DailyForecast
        fields = [
            'id',
            'station',
            'station_id',
            'forecast_date',
            'temp_max',
            'temp_min',
            'humidity_avg',
            'wind_speed_avg',
            'precipitation_chance',
            'precipitation_amount',
            'weather_condition',
            'weather_description',
            'weather_icon',
            'sunrise',
            'sunset',
            'uv_index',
            'created_at',
        ]


class WeatherHistorySerializer(serializers.ModelSerializer):
    """Serializer for WeatherHistory"""
    station = WeatherStationSerializer(read_only=True)
    station_id = serializers.PrimaryKeyRelatedField(
        source='station',
        queryset=WeatherStation.objects.all(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = WeatherHistory
        fields = [
            'id',
            'station',
            'station_id',
            'recorded_date',
            'temperature_max',
            'temperature_min',
            'temperature_avg',
            'humidity_avg',
            'pressure_avg',
            'wind_speed_avg',
            'precipitation_total',
            'weather_condition',
            'created_at',
        ]


class WeatherRecordSerializer(serializers.ModelSerializer):
    """Serializer for WeatherRecord (legacy)"""
    class Meta:
        model = WeatherRecord
        fields = [
            'id',
            'city',
            'temperature',
            'humidity',
            'pressure',
            'wind_speed',
            'visibility',
            'weather_condition',
            'weather_icon',
            'recorded_at',
        ]
