from rest_framework import viewsets

from .models import Forecast
from .serializers import ForecastSerializer


class ForecastViewSet(viewsets.ModelViewSet):
    queryset = Forecast.objects.all().order_by("date")
    serializer_class = ForecastSerializer
