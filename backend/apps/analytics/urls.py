from django.urls import path

from .views import WeatherReportCSVView, WeatherReportPDFView, WeatherReportView

urlpatterns = [
    path("reports/weather/", WeatherReportView.as_view(), name="weather-report"),
    path("reports/weather.csv", WeatherReportCSVView.as_view(), name="weather-report-csv"),
    path("reports/weather.pdf", WeatherReportPDFView.as_view(), name="weather-report-pdf"),
]