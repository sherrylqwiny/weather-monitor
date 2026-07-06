from rest_framework import viewsets

from .models import WeatherAlert
from .serializers import WeatherAlertSerializer


class WeatherAlertViewSet(viewsets.ModelViewSet):
    queryset = WeatherAlert.objects.all().order_by("-created_at")
    serializer_class = WeatherAlertSerializer
