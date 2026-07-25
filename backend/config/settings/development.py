from .base import *
from celery.schedules import crontab

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Celery configuration for background tasks
# Development: Use in-memory broker (no external dependency)
# Production: Configure Redis or RabbitMQ
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60  # 30 minutes

# Celery Beat: Periodic task schedule
CELERY_BEAT_SCHEDULE = {
    "sync-weather-hourly": {
        "task": "weather.sync_weather",
        "schedule": crontab(minute=0),  # Every hour at :00
    },
    "generate-alerts-every-30-min": {
        "task": "alerts.generate_alerts",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes
    },
    "cleanup-weather-cache-daily": {
        "task": "weather.cleanup_cache",
        "schedule": crontab(hour=0, minute=0),  # Daily at midnight
    },
}
