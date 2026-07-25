import logging
from datetime import datetime

from django.core.cache import cache
from django.db import connection
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from apps.weather.models import CurrentWeather
from .models import AppVersion, OfflineSyncLog
from .serializers import AppVersionSerializer, HealthCheckSerializer, OfflineSyncLogSerializer

logger = logging.getLogger(__name__)


class AppVersionViewSet(viewsets.ModelViewSet):
    """Manage and retrieve application version information."""
    queryset = AppVersion.objects.all().order_by("-release_date")
    serializer_class = AppVersionSerializer
    permission_classes = []
    pagination_class = None

    @action(detail=False, methods=["get"])
    def latest(self, request):
        """Get the latest app version."""
        version = AppVersion.objects.first()
        if version:
            serializer = self.get_serializer(version)
            return Response(serializer.data)
        return Response(
            {"error": "No version found"},
            status=status.HTTP_404_NOT_FOUND
        )

    @action(detail=False, methods=["get"])
    def update_required(self, request):
        """Check if client needs to update based on client version."""
        client_version = request.query_params.get("current_version")
        if not client_version:
            return Response(
                {"error": "current_version query parameter required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        latest = AppVersion.objects.first()
        if not latest:
            return Response({"update_required": False})

        # Check if client version is below minimum required
        if latest.min_version and client_version < latest.min_version:
            return Response({
                "update_required": True,
                "reason": "minimum_version_required",
                "latest_version": latest.version,
                "is_critical": True,
            })

        # Check if latest is marked as critical
        if latest.is_critical and client_version < latest.version:
            return Response({
                "update_required": True,
                "reason": "critical_update",
                "latest_version": latest.version,
                "is_critical": True,
            })

        return Response({
            "update_required": False,
            "latest_version": latest.version,
        })


class OfflineSyncLogViewSet(viewsets.ModelViewSet):
    """Manage offline sync log for PWA offline-first capability."""
    queryset = OfflineSyncLog.objects.all()
    serializer_class = OfflineSyncLogSerializer
    permission_classes = []

    @action(detail=False, methods=["get"])
    def pending(self, request):
        """Get pending (unsynced) actions for a user."""
        user = request.query_params.get("user")
        if not user:
            return Response(
                {"error": "user query parameter required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pending = OfflineSyncLog.objects.filter(user=user, synced=False).order_by("created_at")
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def sync_batch(self, request):
        """
        Sync a batch of offline actions. Expects:
        {
            "user": "username",
            "actions": [
                {
                    "id": 1,
                    "action_type": "favorite_add",
                    "entity_type": "favorite",
                    "entity_id": "london",
                    "payload": {...}
                }
            ]
        }
        """
        user = request.data.get("user")
        actions = request.data.get("actions", [])

        if not user:
            return Response(
                {"error": "user field required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        synced_ids = []
        failed_ids = []

        for action in actions:
            action_id = action.get("id")
            try:
                sync_log = OfflineSyncLog.objects.get(id=action_id, user=user)
                # Mark as synced
                sync_log.synced = True
                sync_log.synced_at = timezone.now()
                sync_log.save()
                synced_ids.append(action_id)
                logger.info(f"Synced offline action {action_id}: {sync_log.action_type}")
            except OfflineSyncLog.DoesNotExist:
                failed_ids.append(action_id)
                logger.warning(f"Offline sync log {action_id} not found for user {user}")

        return Response({
            "synced_count": len(synced_ids),
            "failed_count": len(failed_ids),
            "synced_ids": synced_ids,
            "failed_ids": failed_ids,
        })

    @action(detail=False, methods=["post"])
    def log_action(self, request):
        """Log an offline action to be synced later."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def health_check(request):
    """
    Health check endpoint for monitoring backend status.
    Used by PWA and monitoring tools.
    """
    try:
        # Check database
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"error: {str(e)}"
        logger.error(f"Database health check failed: {e}")

    # Check cache
    try:
        test_key = "__health_check__"
        cache.set(test_key, "ok", 10)
        if cache.get(test_key) == "ok":
            cache_status = "healthy"
        else:
            cache_status = "error: cache get failed"
    except Exception as e:
        cache_status = f"error: {str(e)}"
        logger.error(f"Cache health check failed: {e}")

    # Get latest version
    latest_version = AppVersion.objects.first()
    version = latest_version.version if latest_version else "unknown"

    # Calculate uptime (simplified)
    uptime = int((timezone.now() - timezone.datetime(2026, 7, 24)).total_seconds())

    data = {
        "status": "healthy" if db_status == "healthy" and cache_status == "healthy" else "degraded",
        "version": version,
        "timestamp": timezone.now(),
        "database": db_status,
        "cache": cache_status,
        "uptime_seconds": uptime,
    }

    serializer = HealthCheckSerializer(data)
    return Response(serializer.data)


@api_view(["GET"])
def cached_weather_endpoint(request):
    """
    Retrieve all cached weather data for offline mode.
    Used by PWA to pre-fetch and cache locally.
    """
    try:
        weather_records = CurrentWeather.objects.select_related("station").all()
        
        data = {
            "count": weather_records.count(),
            "cached_at": timezone.now(),
            "records": [
                {
                    "id": w.id,
                    "city": w.station.city if w.station else "Unknown",
                    "country": w.station.country if w.station else "Unknown",
                    "temperature": w.temperature,
                    "feels_like": w.feels_like,
                    "humidity": w.humidity,
                    "wind_speed": w.wind_speed,
                    "weather_condition": w.weather_condition,
                    "weather_description": w.weather_description,
                    "weather_icon": w.weather_icon,
                    "air_quality_index": w.air_quality_index,
                    "updated_at": w.updated_at,
                }
                for w in weather_records
            ],
        }
        return Response(data)
    except Exception as e:
        logger.error(f"Failed to retrieve cached weather: {e}")
        return Response(
            {"error": "Failed to retrieve cached weather"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
