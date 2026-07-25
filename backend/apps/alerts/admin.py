from django.contrib import admin
from .models import WeatherAlert


@admin.action(description="Mark selected alerts as read")
def mark_alerts_read(modeladmin, request, queryset):
	queryset.update(is_read=True)


@admin.action(description="Mark selected alerts as unread")
def mark_alerts_unread(modeladmin, request, queryset):
	queryset.update(is_read=False)


@admin.register(WeatherAlert)
class WeatherAlertAdmin(admin.ModelAdmin):
	list_display = (
		"city",
		"alert_type",
		"severity",
		"is_read",
		"created_at",
		"expires_at",
		"user",
	)
	list_filter = ("alert_type", "severity", "is_read", "created_at", "expires_at")
	search_fields = ("city", "alert_type", "message", "user")
	readonly_fields = ("created_at",)
	date_hierarchy = "created_at"
	ordering = ("is_read", "-created_at")
	list_per_page = 50
	actions = (mark_alerts_read, mark_alerts_unread)
