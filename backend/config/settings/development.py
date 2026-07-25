from .base import *
from celery.schedules import crontab

# ------------------------------------------------------------------------------
# Development Settings
# ------------------------------------------------------------------------------

DEBUG = True

ALLOWED_HOSTS = [
    "*",
]

# ------------------------------------------------------------------------------
# Development Database
# Uses SQLite (configured in base.py)
# ------------------------------------------------------------------------------

# DATABASES inherited from base.py

# ------------------------------------------------------------------------------
# Development CORS
# ------------------------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

# ------------------------------------------------------------------------------
# Security
# Disable HTTPS requirements locally
# ------------------------------------------------------------------------------

SECURE_SSL_REDIRECT = False

SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SECURE = False

# ------------------------------------------------------------------------------
# Email
# Print emails to terminal instead of sending
# ------------------------------------------------------------------------------

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ------------------------------------------------------------------------------
# Celery Configuration (Development)
# ------------------------------------------------------------------------------

CELERY_BROKER_URL = "memory://"

CELERY_RESULT_BACKEND = "cache+memory://"

CELERY_ACCEPT_CONTENT = ["json"]

CELERY_TASK_SERIALIZER = "json"

CELERY_RESULT_SERIALIZER = "json"

CELERY_TIMEZONE = TIME_ZONE

CELERY_TASK_TRACK_STARTED = True

CELERY_TASK_TIME_LIMIT = 30 * 60

# ------------------------------------------------------------------------------
# Celery Beat Schedule
# ------------------------------------------------------------------------------

CELERY_BEAT_SCHEDULE = {
    "sync-weather-hourly": {
        "task": "weather.sync_weather",
        "schedule": crontab(minute=0),
    },
    "generate-alerts-every-30-min": {
        "task": "alerts.generate_alerts",
        "schedule": crontab(minute="*/30"),
    },
    "cleanup-weather-cache-daily": {
        "task": "weather.cleanup_cache",
        "schedule": crontab(hour=0, minute=0),
    },
}

# ------------------------------------------------------------------------------
# Development Logging
# ------------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
