from rest_framework import serializers

from .models import WeatherAlert


class WeatherAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherAlert
        fields = ["id", "city", "alert_type", "message", "severity", "created_at"]
