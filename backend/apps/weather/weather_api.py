import os

import requests


class WeatherAPIClient:
    def __init__(self, api_key=None, base_url=None):
        self.api_key = api_key or os.getenv("WEATHER_API_KEY")
        self.base_url = base_url or os.getenv("WEATHER_API_BASE_URL")

    def get_current_weather(self, city):
        if not self.api_key or not self.base_url:
            raise ValueError("Weather API credentials are not configured")

        params = {"q": city, "appid": self.api_key, "units": "metric"}
        response = requests.get(f"{self.base_url}/weather", params=params, timeout=10)
        response.raise_for_status()
        return response.json()
