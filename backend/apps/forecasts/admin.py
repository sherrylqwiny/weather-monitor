from django.contrib import admin
from .models import Forecast


@admin.register(Forecast)
class ForecastAdmin(admin.ModelAdmin):
	list_display = (
		"city",
		"date",
		"min_temp",
		"max_temp",
		"humidity",
		"wind_speed",
		"condition",
	)
	list_filter = ("condition", "date")
	search_fields = ("city", "condition")
	date_hierarchy = "date"
	ordering = ("-date", "city")
	list_per_page = 50
