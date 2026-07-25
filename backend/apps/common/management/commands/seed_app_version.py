from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.common.models import AppVersion


class Command(BaseCommand):
    help = "Seed initial app version information for PWA."

    def add_arguments(self, parser):
        parser.add_argument(
            "--version",
            type=str,
            default="1.0.0",
            help="Initial version (default: 1.0.0)",
        )
        parser.add_argument(
            "--critical",
            action="store_true",
            help="Mark version as critical (force update)",
        )

    def handle(self, *args, **options):
        version_str = options.get("version", "1.0.0")
        is_critical = options.get("critical", False)

        # Parse version (e.g., "1.0.0" -> [1, 0, 0])
        version_parts = [int(p) for p in version_str.split(".")[:3]]
        while len(version_parts) < 3:
            version_parts.append(0)
        build_number = sum(p * (100 ** (2 - i)) for i, p in enumerate(version_parts))

        version, created = AppVersion.objects.update_or_create(
            version=version_str,
            defaults={
                "build_number": build_number,
                "is_critical": is_critical,
                "changelog": "Initial release",
                "features": [
                    "Weather monitoring",
                    "Favorite cities",
                    "Weather alerts",
                    "Offline support (PWA)",
                    "Dashboard",
                    "Analytics & reports",
                ],
            },
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f"✓ Created app version v{version.version}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"  App version v{version.version} already exists")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nApp version: v{version.version}\n"
                f"Build: {version.build_number}\n"
                f"Critical: {version.is_critical}\n"
                f"Released: {version.release_date}"
            )
        )
