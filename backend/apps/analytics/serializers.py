from rest_framework import serializers


class WeatherReportSerializer(serializers.Serializer):
    city = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    records = serializers.ListField()
    temperature_trends = serializers.ListField()
    rainfall_trends = serializers.ListField()
    statistics = serializers.DictField()