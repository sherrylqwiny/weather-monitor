import logging

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.weather.models import HourlyForecast, WeatherHistory

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Remove old weather cache records (forecast older than 7 days, history older than 30 days)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--days-forecast",
            type=int,
            default=7,
            help="Remove hourly forecasts older than this many days (default: 7).",
        )
        parser.add_argument(
            "--days-history",
            type=int,
            default=30,
            help="Remove weather history records older than this many days (default: 30).",
        )

    def handle(self, *args, **options):
        days_forecast = options.get("days_forecast", 7)
        days_history = options.get("days_history", 30)

        cutoff_forecast = timezone.now() - timedelta(days=days_forecast)
        cutoff_history = timezone.now() - timedelta(days=days_history)

        # Clean up old hourly forecasts
        old_forecasts = HourlyForecast.objects.filter(forecast_time__lt=cutoff_forecast)
        forecast_count, _ = old_forecasts.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Removed {forecast_count} hourly forecast records older than {days_forecast} days."
            )
        )

        # Clean up old weather history
        old_history = WeatherHistory.objects.filter(recorded_at__lt=cutoff_history)
        history_count, _ = old_history.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Removed {history_count} weather history records older than {days_history} days."
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nCleanup complete: {forecast_count + history_count} total records removed."
            )
        )
