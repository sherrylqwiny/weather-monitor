from django.contrib import admin
from .models import (
    WeatherStation,
    CurrentWeather,
    HourlyForecast,
    DailyForecast,
    WeatherHistory,
    WeatherRecord,
)


@admin.register(WeatherStation)
class WeatherStationAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'country', 'is_active', 'created_at']
    list_filter = ['is_active', 'country', 'created_at']
    search_fields = ['name', 'city', 'country']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['name']


@admin.register(CurrentWeather)
class CurrentWeatherAdmin(admin.ModelAdmin):
    list_display = ['get_station_name', 'temperature', 'humidity', 'air_quality_index', 'weather_condition', 'updated_at']
    list_filter = ['weather_condition', 'air_quality_index', 'updated_at']
    search_fields = ['station__name', 'station__city']
    readonly_fields = ['updated_at']
    ordering = ['-updated_at']
    list_per_page = 50

    def get_station_name(self, obj):
        return obj.station.name
    get_station_name.short_description = 'Station'


@admin.register(HourlyForecast)
class HourlyForecastAdmin(admin.ModelAdmin):
    list_display = ['get_station_name', 'forecast_time', 'temperature', 'weather_condition', 'precipitation_chance']
    list_filter = ['weather_condition', 'forecast_time']
    search_fields = ['station__name', 'station__city']
    readonly_fields = ['created_at']
    ordering = ['-forecast_time']
    date_hierarchy = 'forecast_time'
    list_per_page = 50

    def get_station_name(self, obj):
        return obj.station.name
    get_station_name.short_description = 'Station'


@admin.register(DailyForecast)
class DailyForecastAdmin(admin.ModelAdmin):
    list_display = ['get_station_name', 'forecast_date', 'temp_max', 'temp_min', 'weather_condition']
    list_filter = ['weather_condition', 'forecast_date']
    search_fields = ['station__name', 'station__city']
    readonly_fields = ['created_at']
    ordering = ['-forecast_date']
    date_hierarchy = 'forecast_date'
    list_per_page = 50

    def get_station_name(self, obj):
        return obj.station.name
    get_station_name.short_description = 'Station'


@admin.register(WeatherHistory)
class WeatherHistoryAdmin(admin.ModelAdmin):
    list_display = ['get_station_name', 'recorded_date', 'temperature_max', 'temperature_min', 'weather_condition']
    list_filter = ['weather_condition', 'recorded_date']
    search_fields = ['station__name', 'station__city']
    readonly_fields = ['created_at']
    ordering = ['-recorded_date']
    date_hierarchy = 'recorded_date'
    list_per_page = 50

    def get_station_name(self, obj):
        return obj.station.name
    get_station_name.short_description = 'Station'


@admin.register(WeatherRecord)
class WeatherRecordAdmin(admin.ModelAdmin):
    list_display = ['city', 'temperature', 'humidity', 'weather_condition', 'recorded_at']
    list_filter = ['weather_condition', 'recorded_at']
    search_fields = ['city']
    readonly_fields = ['recorded_at']
    ordering = ['-recorded_at']
