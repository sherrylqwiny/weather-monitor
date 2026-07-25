from rest_framework import serializers

from .models import FavoriteCity


class FavoriteCitySerializer(serializers.ModelSerializer):
    user = serializers.CharField(read_only=True)

    class Meta:
        model = FavoriteCity
        fields = ["id", "user", "city", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def validate_city(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("City must be at least 2 characters.")
        return value
