from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class WeatherStation(models.Model):
    """Weather station/city location"""
    name = models.CharField(max_length=255, unique=True)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timezone = models.CharField(max_length=100, default='UTC')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['city', 'country']),
        ]

    def __str__(self):
        return f"{self.city}, {self.country}"


class CurrentWeather(models.Model):
    """Current weather conditions for a location"""
    station = models.OneToOneField(WeatherStation, on_delete=models.CASCADE, related_name='current_weather')
    temperature = models.FloatField(help_text='Temperature in Celsius')
    feels_like = models.FloatField(help_text='Feels like temperature in Celsius')
    humidity = models.IntegerField(help_text='Humidity percentage (0-100)')
    pressure = models.IntegerField(help_text='Atmospheric pressure in hPa')
    wind_speed = models.FloatField(help_text='Wind speed in m/s')
    wind_direction = models.IntegerField(help_text='Wind direction in degrees (0-360)')
    visibility = models.IntegerField(help_text='Visibility in meters')
    uv_index = models.FloatField(default=0)
    air_quality_index = models.IntegerField(null=True, blank=True, help_text='OpenWeather AQI from 1 to 5')
    cloud_coverage = models.IntegerField(help_text='Cloud coverage percentage (0-100)')
    weather_condition = models.CharField(max_length=255, help_text='Weather condition (e.g., Clear, Rainy)')
    weather_description = models.CharField(max_length=255, blank=True)
    weather_icon = models.CharField(max_length=100, help_text='Icon code for frontend')
    sunrise = models.TimeField()
    sunset = models.TimeField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.station.name} - {self.temperature}°C"


class HourlyForecast(models.Model):
    """Hourly weather forecast"""
    station = models.ForeignKey(WeatherStation, on_delete=models.CASCADE, related_name='hourly_forecasts')
    forecast_time = models.DateTimeField()
    temperature = models.FloatField()
    feels_like = models.FloatField()
    humidity = models.IntegerField()
    pressure = models.IntegerField()
    wind_speed = models.FloatField()
    wind_direction = models.IntegerField()
    cloud_coverage = models.IntegerField()
    precipitation_chance = models.IntegerField(default=0, help_text='Probability of precipitation (0-100)')
    precipitation_amount = models.FloatField(default=0, help_text='Expected precipitation in mm')
    weather_condition = models.CharField(max_length=255)
    weather_description = models.CharField(max_length=255, blank=True)
    weather_icon = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['forecast_time']
        indexes = [
            models.Index(fields=['station', 'forecast_time']),
        ]
        unique_together = ('station', 'forecast_time')

    def __str__(self):
        return f"{self.station.name} - {self.forecast_time}"


class DailyForecast(models.Model):
    """Daily weather forecast"""
    station = models.ForeignKey(WeatherStation, on_delete=models.CASCADE, related_name='daily_forecasts')
    forecast_date = models.DateField()
    temp_max = models.FloatField()
    temp_min = models.FloatField()
    humidity_avg = models.IntegerField()
    wind_speed_avg = models.FloatField()
    precipitation_chance = models.IntegerField(default=0)
    precipitation_amount = models.FloatField(default=0, help_text='Expected precipitation in mm')
    weather_condition = models.CharField(max_length=255)
    weather_description = models.CharField(max_length=255, blank=True)
    weather_icon = models.CharField(max_length=100)
    sunrise = models.TimeField()
    sunset = models.TimeField()
    uv_index = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['forecast_date']
        indexes = [
            models.Index(fields=['station', 'forecast_date']),
        ]
        unique_together = ('station', 'forecast_date')

    def __str__(self):
        return f"{self.station.name} - {self.forecast_date}"


class WeatherHistory(models.Model):
    """Historical weather records"""
    station = models.ForeignKey(WeatherStation, on_delete=models.CASCADE, related_name='history')
    recorded_date = models.DateField()
    temperature_max = models.FloatField()
    temperature_min = models.FloatField()
    temperature_avg = models.FloatField()
    humidity_avg = models.IntegerField()
    pressure_avg = models.IntegerField()
    wind_speed_avg = models.FloatField()
    precipitation_total = models.FloatField(default=0)
    weather_condition = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_date']
        indexes = [
            models.Index(fields=['station', 'recorded_date']),
        ]
        unique_together = ('station', 'recorded_date')

    def __str__(self):
        return f"{self.station.name} - {self.recorded_date}"


class WeatherRecord(models.Model):
    """Legacy weather record (kept for backward compatibility)"""
    city = models.CharField(max_length=255)
    temperature = models.FloatField(default=0)
    humidity = models.FloatField(default=0)
    pressure = models.FloatField(default=0)
    wind_speed = models.FloatField(default=0)
    visibility = models.FloatField(default=0)
    weather_condition = models.CharField(max_length=255, blank=True)
    weather_icon = models.CharField(max_length=255, blank=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']

    def __str__(self):
        return f"{self.city} - {self.recorded_at}"
