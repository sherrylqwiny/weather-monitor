from rest_framework import serializers

from .models import Forecast


class ForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forecast
        fields = ["id", "city", "date", "min_temp", "max_temp", "humidity", "wind_speed", "condition"]
