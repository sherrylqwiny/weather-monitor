from rest_framework import serializers

from .models import WeatherAlert


class WeatherAlertSerializer(serializers.ModelSerializer):
    user = serializers.CharField(read_only=True)

    class Meta:
        model = WeatherAlert
        fields = [
            "id",
            "user",
            "city",
            "alert_type",
            "message",
            "severity",
            "details",
            "is_read",
            "expires_at",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]
