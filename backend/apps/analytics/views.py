import csv
from datetime import datetime, timedelta
from io import BytesIO

from django.db.models import Avg, Max, Min, Sum
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.weather.models import WeatherHistory

from .serializers import WeatherReportSerializer


def report_filters(request):
    today = timezone.localdate()
    city = request.query_params.get("city", "").strip()
    try:
        end_date = datetime.strptime(request.query_params.get("end_date", today.isoformat()), "%Y-%m-%d").date()
    except ValueError:
        end_date = today
    try:
        start_date = datetime.strptime(
            request.query_params.get("start_date", (end_date - timedelta(days=30)).isoformat()),
            "%Y-%m-%d",
        ).date()
    except ValueError:
        start_date = end_date - timedelta(days=30)
    if start_date > end_date:
        start_date, end_date = end_date, start_date
    return city, start_date, end_date


def build_report(request):
    city, start_date, end_date = report_filters(request)
    records = WeatherHistory.objects.select_related("station").filter(
        recorded_date__gte=start_date,
        recorded_date__lte=end_date,
        station__is_active=True,
    ).order_by("recorded_date")
    if city:
        records = records.filter(station__city__iexact=city)

    statistics = records.aggregate(
        average_temperature=Avg("temperature_avg"),
        highest_temperature=Max("temperature_max"),
        lowest_temperature=Min("temperature_min"),
        average_humidity=Avg("humidity_avg"),
        average_wind_speed=Avg("wind_speed_avg"),
        total_rainfall=Sum("precipitation_total"),
    )
    statistics = {
        key: round(value, 2) if value is not None else None
        for key, value in statistics.items()
    }
    rows = [
        {
            "date": record.recorded_date,
            "city": record.station.city,
            "temperature_max": record.temperature_max,
            "temperature_min": record.temperature_min,
            "temperature_avg": record.temperature_avg,
            "rainfall": record.precipitation_total,
            "humidity": record.humidity_avg,
            "wind_speed": record.wind_speed_avg,
            "condition": record.weather_condition,
        }
        for record in records
    ]
    return {
        "city": city or "All cities",
        "start_date": start_date,
        "end_date": end_date,
        "records": rows,
        "temperature_trends": [
            {"date": row["date"], "average": row["temperature_avg"], "max": row["temperature_max"], "min": row["temperature_min"]}
            for row in rows
        ],
        "rainfall_trends": [
            {"date": row["date"], "rainfall": row["rainfall"]}
            for row in rows
        ],
        "statistics": statistics,
    }


class WeatherReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(WeatherReportSerializer(build_report(request)).data)


class WeatherReportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        report = build_report(request)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="weather-report-{report["start_date"]}-{report["end_date"]}.csv"'
        writer = csv.writer(response)
        writer.writerow(["Date", "City", "Max temperature", "Min temperature", "Average temperature", "Rainfall", "Humidity", "Wind speed", "Condition"])
        for row in report["records"]:
            writer.writerow([
                row["date"], row["city"], row["temperature_max"], row["temperature_min"],
                row["temperature_avg"], row["rainfall"], row["humidity"], row["wind_speed"], row["condition"],
            ])
        return response


class WeatherReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        report = build_report(request)
        buffer = BytesIO()
        document = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        y = height - 50
        document.setFont("Helvetica-Bold", 16)
        document.drawString(50, y, "Historical Weather Report")
        y -= 24
        document.setFont("Helvetica", 10)
        document.drawString(50, y, f"Location: {report['city']} | {report['start_date']} to {report['end_date']}")
        y -= 28
        document.setFont("Helvetica-Bold", 11)
        document.drawString(50, y, "Statistics")
        y -= 18
        document.setFont("Helvetica", 10)
        for key, value in report["statistics"].items():
            document.drawString(60, y, f"{key.replace('_', ' ').title()}: {value if value is not None else 'No data'}")
            y -= 15
        y -= 10
        document.setFont("Helvetica-Bold", 11)
        document.drawString(50, y, "Daily Records")
        y -= 18
        document.setFont("Helvetica", 8)
        for row in report["records"]:
            line = f"{row['date']} | {row['city']} | {row['temperature_avg']}C | rain {row['rainfall']} mm | {row['condition']}"
            document.drawString(55, y, line[:115])
            y -= 12
            if y < 50:
                document.showPage()
                y = height - 50
                document.setFont("Helvetica", 8)
        document.save()
        response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="weather-report-{report["start_date"]}-{report["end_date"]}.pdf"'
        return response