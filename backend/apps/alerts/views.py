from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from .models import WeatherAlert
from .serializers import WeatherAlertSerializer
from .services import generate_alerts_for_user


class WeatherAlertViewSet(viewsets.ModelViewSet):
    queryset = WeatherAlert.objects.all()
    serializer_class = WeatherAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_keys = [str(self.request.user.pk), self.request.user.username, self.request.user.email, ""]
        queryset = WeatherAlert.objects.filter(user__in=user_keys).order_by("-created_at")
        unread = self.request.query_params.get("unread")
        if unread == "true":
            queryset = queryset.filter(is_read=False)
        return queryset

    def list(self, request, *args, **kwargs):
        generate_alerts_for_user(request.user)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["get"])
    def history(self, request):
        """Return all active and historical notifications for the user."""
        return self.list(request)

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        generate_alerts_for_user(request.user)
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"count": count})

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        alert = self.get_object()
        alert.is_read = True
        alert.save(update_fields=["is_read"])
        return Response(self.get_serializer(alert).data)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"updated": updated}, status=status.HTTP_200_OK)
