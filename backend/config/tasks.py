import logging

from celery import shared_task
from django.core.management import call_command

logger = logging.getLogger(__name__)


@shared_task(name="weather.sync_weather", bind=True, max_retries=3)
def sync_weather_task(self):
    """
    Sync weather data from OpenWeather API for all favorite cities.
    Runs hourly via Celery beat.
    """
    try:
        call_command("sync_weather")
        logger.info("Weather sync task completed successfully.")
        return "Weather sync completed"
    except Exception as exc:
        logger.error(f"Weather sync task failed: {exc}")
        # Retry up to 3 times with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(name="alerts.generate_alerts", bind=True, max_retries=3)
def generate_alerts_task(self):
    """
    Generate weather alerts for all users based on current and forecast data.
    Runs every 30 minutes via Celery beat.
    """
    try:
        call_command("generate_weather_alerts")
        logger.info("Alert generation task completed successfully.")
        return "Alert generation completed"
    except Exception as exc:
        logger.error(f"Alert generation task failed: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@shared_task(name="weather.cleanup_cache", bind=True, max_retries=2)
def cleanup_weather_cache_task(self):
    """
    Remove old weather cache records (forecast older than 7 days, history older than 30 days).
    Runs daily at midnight via Celery beat.
    """
    try:
        call_command("cleanup_weather_cache", days_forecast=7, days_history=30)
        logger.info("Cache cleanup task completed successfully.")
        return "Cache cleanup completed"
    except Exception as exc:
        logger.error(f"Cache cleanup task failed: {exc}")
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
