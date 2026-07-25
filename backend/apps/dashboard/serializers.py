from rest_framework import serializers


class DashboardSummarySerializer(serializers.Serializer):
    summary = serializers.DictField()
    current_weather = serializers.DictField(allow_null=True)
    favorite_cities = serializers.ListField()
    todays_highlights = serializers.ListField()
    weekly_trends = serializers.ListField()
    weather_statistics = serializers.DictField()
    recent_alerts = serializers.ListField()