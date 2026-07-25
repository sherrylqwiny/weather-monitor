from django.db import models


class FavoriteCity(models.Model):
    user = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "city"], name="unique_favorite_city_per_user"),
        ]

    def __str__(self):
        return f"{self.user} - {self.city}"
