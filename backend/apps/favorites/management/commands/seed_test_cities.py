from django.core.management.base import BaseCommand
from apps.favorites.models import FavoriteCity


class Command(BaseCommand):
    help = "Seed test favorite cities for development and testing."

    def handle(self, *args, **options):
        test_cities = ["London", "New York", "Paris", "Tokyo", "Sydney"]
        
        for city in test_cities:
            favorite, created = FavoriteCity.objects.get_or_create(
                city=city,
                user="default-user",
                defaults={"is_active": True},
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Added favorite city: {city}")
                )
            else:
                self.stdout.write(self.style.WARNING(f"  {city} already exists"))

        self.stdout.write(
            self.style.SUCCESS(f"\nSeeded {len(test_cities)} test cities.")
        )
