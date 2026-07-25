import logging

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.alerts.services import generate_alerts_for_user

logger = logging.getLogger(__name__)
User = get_user_model()


class Command(BaseCommand):
    help = "Generate weather alerts for all users based on current weather conditions and forecasts."

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-id",
            type=int,
            default=None,
            help="Generate alerts for a specific user ID; if empty, generates for all users.",
        )

    def handle(self, *args, **options):
        user_id = options.get("user_id")

        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                users = [user]
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"User with ID {user_id} not found."))
                return
        else:
            users = User.objects.all()

        total_alerts = 0

        for user in users:
            try:
                alerts = generate_alerts_for_user(user)
                total_alerts += len(alerts)
                if alerts:
                    alert_types = [a.alert_type for a in alerts]
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"✓ Generated {len(alerts)} alerts for {user.username}: {', '.join(alert_types)}"
                        )
                    )
                else:
                    self.stdout.write(f"  No new alerts for {user.username}")
            except Exception as e:
                logger.error(f"Failed to generate alerts for user {user.username}: {e}")
                self.stdout.write(
                    self.style.ERROR(
                        f"✗ Failed to generate alerts for {user.username}: {e}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(f"\nAlert generation complete: {total_alerts} alerts generated.")
        )
