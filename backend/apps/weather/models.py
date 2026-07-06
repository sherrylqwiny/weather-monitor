from django.db import models


class WeatherRecord(models.Model):
    city = models.CharField(max_length=255)
    temperature = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    pressure = models.FloatField(default=0)
    wind_speed = models.FloatField(default=0)
    visibility = models.FloatField(default=0)
    weather_condition = models.CharField(max_length=255, blank=True)
    weather_icon = models.CharField(max_length=255, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.recorded_at}"
