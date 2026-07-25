import os

from celery import Celery
from config.settings.base import get_default_settings_module

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    os.getenv("DJANGO_SETTINGS_MODULE", get_default_settings_module()),
)

app = Celery("weather_project")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()

# Import tasks module to ensure they are registered
from config import tasks  # noqa
