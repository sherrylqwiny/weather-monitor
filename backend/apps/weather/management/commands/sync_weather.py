import logging

from django.core.management.base import BaseCommand
from django.db.models import F

from apps.favorites.models import FavoriteCity
from apps.weather.models import WeatherStation
from apps.weather.weather_api import WeatherAPIClient

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Sync weather data from OpenWeather API for all favorite cities and active stations."

    def add_arguments(self, parser):
        parser.add_argument(
            "--cities",
            type=str,
            default="",
            help="Comma-separated city names to sync; if empty, syncs all favorite cities.",
        )

    def handle(self, *args, **options):
        client = WeatherAPIClient()
        cities_to_sync = set()

        # Collect cities from favorites
        favorites = FavoriteCity.objects.values_list("city", flat=True).distinct()
        cities_to_sync.update(favorites)

        # Collect active station cities
        active_stations = WeatherStation.objects.filter(is_active=True).values_list("city", flat=True).distinct()
        cities_to_sync.update(active_stations)

        # If specific cities provided, use only those
        if options["cities"]:
            cities_to_sync = set(options["cities"].split(","))
            cities_to_sync = {c.strip() for c in cities_to_sync if c.strip()}

        if not cities_to_sync:
            self.stdout.write(self.style.WARNING("No cities to sync."))
            return

        synced_count = 0
        failed_count = 0

        for city in cities_to_sync:
            try:
                station = client.sync_city(city)
                synced_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✓ Synced weather for {city} (station: {station.name})"
                    )
                )
            except Exception as e:
                failed_count += 1
                logger.error(f"Failed to sync weather for {city}: {e}")
                self.stdout.write(
                    self.style.ERROR(f"✗ Failed to sync weather for {city}: {e}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSync complete: {synced_count} succeeded, {failed_count} failed."
            )
        )
