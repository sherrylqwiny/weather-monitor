from django.contrib import admin
from .models import FavoriteCity


@admin.register(FavoriteCity)
class FavoriteCityAdmin(admin.ModelAdmin):
	list_display = ("city", "user", "created_at")
	list_filter = ("created_at",)
	search_fields = ("city", "user")
	readonly_fields = ("created_at",)
	date_hierarchy = "created_at"
	ordering = ("-created_at",)
