from django.db import models


class WeatherAlert(models.Model):
    user = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=255)
    alert_type = models.CharField(max_length=255)
    message = models.TextField()
    severity = models.CharField(max_length=50, default="info")
    details = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read", "created_at"]),
            models.Index(fields=["city", "alert_type", "created_at"]),
        ]

    def __str__(self):
        return f"{self.city} - {self.alert_type}"
