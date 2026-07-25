from rest_framework import serializers
from .models import AppVersion, OfflineSyncLog


class AppVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppVersion
        fields = [
            "id",
            "version",
            "build_number",
            "release_date",
            "changelog",
            "is_critical",
            "features",
            "min_version",
        ]
        read_only_fields = ["id", "release_date"]


class OfflineSyncLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfflineSyncLog
        fields = [
            "id",
            "user",
            "action_type",
            "entity_type",
            "entity_id",
            "payload",
            "synced",
            "synced_at",
            "created_at",
            "error_message",
        ]
        read_only_fields = ["id", "synced", "synced_at", "created_at"]


class HealthCheckSerializer(serializers.Serializer):
    """Serializer for health check response."""
    status = serializers.CharField()
    version = serializers.CharField()
    timestamp = serializers.DateTimeField()
    database = serializers.CharField()
    cache = serializers.CharField()
    uptime_seconds = serializers.IntegerField()
