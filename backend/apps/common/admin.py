from django.contrib import admin
from .models import AppVersion, OfflineSyncLog


@admin.register(AppVersion)
class AppVersionAdmin(admin.ModelAdmin):
    list_display = ["version", "build_number", "release_date", "is_critical"]
    list_filter = ["is_critical", "release_date"]
    search_fields = ["version", "changelog"]
    readonly_fields = ["release_date"]
    fieldsets = (
        ("Version Info", {
            "fields": ("version", "build_number", "release_date"),
        }),
        ("Update Control", {
            "fields": ("is_critical", "min_version"),
            "description": "Use 'is_critical' to force updates. Set 'min_version' for minimum version enforcement.",
        }),
        ("Details", {
            "fields": ("changelog", "features"),
            "classes": ("collapse",),
        }),
    )


@admin.register(OfflineSyncLog)
class OfflineSyncLogAdmin(admin.ModelAdmin):
    list_display = ["user", "action_type", "entity_type", "synced", "created_at"]
    list_filter = ["synced", "action_type", "created_at"]
    search_fields = ["user", "entity_id", "entity_type"]
    readonly_fields = ["created_at", "synced_at"]
    actions = ["mark_as_synced", "mark_as_pending"]

    def mark_as_synced(self, request, queryset):
        updated = queryset.update(synced=True, synced_at=timezone.now())
        self.message_user(request, f"Marked {updated} actions as synced.")

    def mark_as_pending(self, request, queryset):
        updated = queryset.update(synced=False, synced_at=None)
        self.message_user(request, f"Marked {updated} actions as pending.")

    mark_as_synced.short_description = "Mark selected as synced"
    mark_as_pending.short_description = "Mark selected as pending"


from django.utils import timezone
