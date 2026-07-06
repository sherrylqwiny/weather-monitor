from rest_framework import serializers

from .models import WeatherRecord


class WeatherRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherRecord
        fields = [
            "id",
            "city",
            "temperature",
            "humidity",
            "pressure",
            "wind_speed",
            "visibility",
            "weather_condition",
            "weather_icon",
            "recorded_at",
        ]
