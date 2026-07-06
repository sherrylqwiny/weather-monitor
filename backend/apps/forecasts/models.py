from django.db import models


class Forecast(models.Model):
    city = models.CharField(max_length=255)
    date = models.DateField()
    min_temp = models.FloatField(default=0)
    max_temp = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    wind_speed = models.FloatField(default=0)
    condition = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.city} - {self.date}"
