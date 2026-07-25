from django.db import models
from django.utils import timezone


class AppVersion(models.Model):
    """Tracks application version information for PWA updates."""
    version = models.CharField(max_length=20, unique=True)
    build_number = models.IntegerField(default=0)
    release_date = models.DateTimeField(auto_now_add=True)
    changelog = models.TextField(blank=True, default="")
    is_critical = models.BooleanField(
        default=False,
        help_text="If True, PWA will force update on next load"
    )
    features = models.JSONField(
        default=list,
        help_text="List of new features/changes in this version"
    )
    min_version = models.CharField(
        max_length=20,
        blank=True,
        default="",
        help_text="Minimum version required; if client is older, force update"
    )

    class Meta:
        ordering = ["-release_date"]
        verbose_name = "App Version"
        verbose_name_plural = "App Versions"

    def __str__(self):
        return f"v{self.version} (Build {self.build_number})"


class OfflineSyncLog(models.Model):
    """Log of pending offline actions to be synced when back online."""
    ACTION_TYPES = [
        ("favorite_add", "Add to Favorites"),
        ("favorite_remove", "Remove from Favorites"),
        ("alert_read", "Mark Alert as Read"),
        ("alert_unread", "Mark Alert as Unread"),
        ("custom", "Custom Action"),
    ]

    user = models.CharField(
        max_length=255,
        help_text="User identifier (username or ID)"
    )
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    entity_type = models.CharField(
        max_length=50,
        help_text="Type of entity (favorite, alert, etc.)"
    )
    entity_id = models.CharField(max_length=255, help_text="ID of the entity")
    payload = models.JSONField(
        default=dict,
        help_text="Full action data to replay"
    )
    synced = models.BooleanField(default=False)
    synced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    error_message = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["synced", "-created_at"]
        indexes = [
            models.Index(fields=["user", "synced"]),
        ]
        verbose_name = "Offline Sync Log"
        verbose_name_plural = "Offline Sync Logs"

    def __str__(self):
        return f"{self.action_type} ({self.entity_type}:{self.entity_id}) - {self.created_at}"
