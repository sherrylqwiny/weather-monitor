from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Max
from django.utils import timezone
from datetime import timedelta
import requests

from .models import (
    WeatherStation,
    CurrentWeather,
    HourlyForecast,
    DailyForecast,
    WeatherHistory,
    WeatherRecord,
)
from .serializers import (
    WeatherStationSerializer,
    CurrentWeatherSerializer,
    HourlyForecastSerializer,
    DailyForecastSerializer,
    WeatherHistorySerializer,
    WeatherRecordSerializer,
)
from .weather_api import WeatherAPIClient


def sync_live_city(city):
    """Refresh a city from OpenWeather before reading persisted records."""
    try:
        return WeatherAPIClient().sync_city(city)
    except ValueError as exc:
        return Response({'error': str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except requests.HTTPError as exc:
        response = exc.response
        provider_status = response.status_code if response is not None else 502
        if provider_status == 401:
            message = 'OpenWeather API key is invalid or not active'
        elif provider_status == 404:
            message = 'City was not found by OpenWeather'
        elif provider_status == 429:
            message = 'OpenWeather rate limit reached; try again later'
        else:
            message = 'OpenWeather rejected the request'
        return Response({'error': message}, status=status.HTTP_502_BAD_GATEWAY)
    except requests.RequestException:
        return Response(
            {'error': 'OpenWeather is temporarily unavailable'},
            status=status.HTTP_502_BAD_GATEWAY,
        )


class WeatherStationViewSet(viewsets.ModelViewSet):
    """ViewSet for Weather Stations"""
    queryset = WeatherStation.objects.filter(is_active=True)
    serializer_class = WeatherStationSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'city', 'country']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search weather stations by city or name"""
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response(
                {'error': 'Query must be at least 2 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        stations = WeatherStation.objects.filter(
            Q(name__icontains=query) |
            Q(city__icontains=query) |
            Q(country__icontains=query),
            is_active=True
        )[:10]
        
        serializer = self.get_serializer(stations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get weather station by city name"""
        city = request.query_params.get('city', '')
        if not city:
            return Response(
                {'error': 'City parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            station = WeatherStation.objects.get(
                city__iexact=city,
                is_active=True
            )
            serializer = self.get_serializer(station)
            return Response(serializer.data)
        except WeatherStation.DoesNotExist:
            return Response(
                {'error': 'Station not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CurrentWeatherViewSet(viewsets.ModelViewSet):
    """ViewSet for Current Weather"""
    queryset = CurrentWeather.objects.select_related('station')
    serializer_class = CurrentWeatherSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated_at']
    ordering = ['-updated_at']

    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get current weather by city name"""
        city = request.query_params.get('city', '')
        if not city:
            return Response(
                {'error': 'City parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        live_error = sync_live_city(city)
        if isinstance(live_error, Response):
            try:
                weather = CurrentWeather.objects.select_related('station').get(
                    station__city__iexact=city,
                    station__is_active=True
                )
                serializer = self.get_serializer(weather)
                return Response(serializer.data)
            except CurrentWeather.DoesNotExist:
                return live_error
        
        try:
            weather = CurrentWeather.objects.select_related('station').get(
                station__city__iexact=city,
                station__is_active=True
            )
            serializer = self.get_serializer(weather)
            return Response(serializer.data)
        except CurrentWeather.DoesNotExist:
            return Response(
                {'error': 'Weather data not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def by_station(self, request):
        """Get current weather by station ID"""
        station_id = request.query_params.get('station_id', '')
        if not station_id:
            return Response(
                {'error': 'Station ID parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            weather = CurrentWeather.objects.get(station_id=station_id)
            serializer = self.get_serializer(weather)
            return Response(serializer.data)
        except CurrentWeather.DoesNotExist:
            return Response(
                {'error': 'Weather data not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class HourlyForecastViewSet(viewsets.ModelViewSet):
    """ViewSet for Hourly Forecasts"""
    queryset = HourlyForecast.objects.select_related('station')
    serializer_class = HourlyForecastSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['forecast_time']
    ordering = ['forecast_time']

    def get_queryset(self):
        """Filter by station and time range"""
        queryset = super().get_queryset()
        station_id = self.request.query_params.get('station_id')
        city = self.request.query_params.get('city')
        hours = self.request.query_params.get('hours', '24')
        
        if station_id:
            queryset = queryset.filter(station_id=station_id)
        elif city:
            queryset = queryset.filter(station__city__iexact=city)
        
        # Default to next 24 hours
        try:
            hours = int(hours)
        except ValueError:
            hours = 24
        
        now = timezone.now()
        future = now + timedelta(hours=hours)
        queryset = queryset.filter(forecast_time__gte=now, forecast_time__lte=future)
        
        return queryset

    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get hourly forecast by city"""
        city = request.query_params.get('city', '')
        hours = request.query_params.get('hours', '24')
        
        if not city:
            return Response(
                {'error': 'City parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        live_error = sync_live_city(city)
        if isinstance(live_error, Response):
            forecasts = HourlyForecast.objects.filter(
                station__city__iexact=city,
                station__is_active=True,
                forecast_time__gte=timezone.now(),
                forecast_time__lte=timezone.now() + timedelta(hours=int(hours) if hours.isdigit() else 24)
            ).select_related('station').order_by('forecast_time')[:48]
            if forecasts.exists():
                serializer = self.get_serializer(forecasts, many=True)
                return Response(serializer.data)
            return live_error
        
        try:
            hours = int(hours)
        except ValueError:
            hours = 24
        
        now = timezone.now()
        future = now + timedelta(hours=hours)
        
        forecasts = HourlyForecast.objects.filter(
            station__city__iexact=city,
            station__is_active=True,
            forecast_time__gte=now,
            forecast_time__lte=future
        ).select_related('station').order_by('forecast_time')[:48]
        
        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)


class DailyForecastViewSet(viewsets.ModelViewSet):
    """ViewSet for Daily Forecasts"""
    queryset = DailyForecast.objects.select_related('station')
    serializer_class = DailyForecastSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['forecast_date']
    ordering = ['forecast_date']

    def get_queryset(self):
        """Filter by station and time range"""
        queryset = super().get_queryset()
        station_id = self.request.query_params.get('station_id')
        city = self.request.query_params.get('city')
        days = self.request.query_params.get('days', '7')
        
        if station_id:
            queryset = queryset.filter(station_id=station_id)
        elif city:
            queryset = queryset.filter(station__city__iexact=city)
        
        # Default to next 7 days
        try:
            days = int(days)
        except ValueError:
            days = 7
        
        today = timezone.localdate()
        future = today + timedelta(days=days)
        queryset = queryset.filter(forecast_date__gte=today, forecast_date__lte=future)
        
        return queryset

    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get daily forecast by city"""
        city = request.query_params.get('city', '')
        days = request.query_params.get('days', '7')
        
        if not city:
            return Response(
                {'error': 'City parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        live_error = sync_live_city(city)
        if isinstance(live_error, Response):
            try:
                days = int(days)
            except ValueError:
                days = 7
            
            today = timezone.localdate()
            future = today + timedelta(days=days)
            
            forecasts = DailyForecast.objects.filter(
                station__city__iexact=city,
                station__is_active=True,
                forecast_date__gte=today,
                forecast_date__lte=future
            ).select_related('station').order_by('forecast_date')
            if forecasts.exists():
                serializer = self.get_serializer(forecasts, many=True)
                return Response(serializer.data)
            return live_error
        
        try:
            days = int(days)
        except ValueError:
            days = 7
        
        today = timezone.localdate()
        future = today + timedelta(days=days)
        
        forecasts = DailyForecast.objects.filter(
            station__city__iexact=city,
            station__is_active=True,
            forecast_date__gte=today,
            forecast_date__lte=future
        ).select_related('station').order_by('forecast_date')
        
        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Get weekly forecast"""
        city = request.query_params.get('city')
        station_id = request.query_params.get('station_id')
        
        if not city and not station_id:
            return Response(
                {'error': 'City or station_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = timezone.localdate()
        future = today + timedelta(days=7)
        
        query = DailyForecast.objects.filter(
            forecast_date__gte=today,
            forecast_date__lte=future
        ).select_related('station')
        
        if city:
            query = query.filter(station__city__iexact=city)
        elif station_id:
            query = query.filter(station_id=station_id)
        
        forecasts = query.order_by('forecast_date')
        serializer = self.get_serializer(forecasts, many=True)
        return Response(serializer.data)


class WeatherHistoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Weather History"""
    queryset = WeatherHistory.objects.select_related('station')
    serializer_class = WeatherHistorySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['recorded_date']
    ordering = ['-recorded_date']

    def get_queryset(self):
        """Filter by station and date range"""
        queryset = super().get_queryset()
        station_id = self.request.query_params.get('station_id')
        city = self.request.query_params.get('city')
        
        if station_id:
            queryset = queryset.filter(station_id=station_id)
        elif city:
            queryset = queryset.filter(station__city__iexact=city)
        
        return queryset

    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get weather history by city"""
        city = request.query_params.get('city', '')
        days = request.query_params.get('days', '30')
        
        if not city:
            return Response(
                {'error': 'City parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            days = int(days)
        except ValueError:
            days = 30
        
        start_date = timezone.localdate() - timedelta(days=days)
        end_date = timezone.localdate()
        
        history = WeatherHistory.objects.filter(
            station__city__iexact=city,
            station__is_active=True,
            recorded_date__gte=start_date,
            recorded_date__lte=end_date
        ).select_related('station').order_by('-recorded_date')[:30]
        
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest weather history for all active stations"""
        latest_dates = WeatherHistory.objects.filter(
            station__is_active=True
        ).values('station').annotate(
            latest=Max('recorded_date')
        )
        
        history = WeatherHistory.objects.filter(
            station__is_active=True,
            recorded_date__in=[item['latest'] for item in latest_dates]
        ).select_related('station')
        
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)


class WeatherRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for WeatherRecord (legacy)"""
    queryset = WeatherRecord.objects.all().order_by("-recorded_at")
    serializer_class = WeatherRecordSerializer
    permission_classes = [AllowAny]
