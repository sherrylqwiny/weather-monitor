from django.db import models


class WeatherAlert(models.Model):
    city = models.CharField(max_length=255)
    alert_type = models.CharField(max_length=255)
    message = models.TextField()
    severity = models.CharField(max_length=50, default="info")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city} - {self.alert_type}"
