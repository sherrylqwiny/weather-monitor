# Online Weather Forecast and Monitoring System

## Project Overview

This project is a Bachelor of Science in Information Technology (BScIT) final-year project for Zetech University. The goal is to develop a software-based online weather forecast and monitoring system that allows users to access real-time weather information and short-term forecasts through a modern Progressive Web Application (PWA).

This implementation does not include IoT hardware, firmware, or physical weather sensors. Instead, the application retrieves weather information from a trusted third-party weather API and presents it through a responsive, user-friendly interface while storing selected records in a local database for historical analysis.

The system is intended to be designed as a clean, maintainable, production-style academic project that follows good software engineering practices.

---

## Objectives

### General Objective

Develop an automated, real-time, reliable, and user-friendly weather forecast and monitoring platform.

### Specific Objectives

- Study existing weather forecasting systems.
- Address challenges in accessing accurate weather information.
- Develop an appropriate web-based weather monitoring model.
- Build a working prototype demonstrating the proposed solution.

---

## Technology Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL (SQLite may be used during development)
- JWT Authentication

### Frontend

- Angular
- Angular Material
- Angular PWA
- TypeScript
- Chart.js

### External Services

- OpenWeatherMap API or another reliable weather API

---

## Application Type

The system will be implemented as a Progressive Web Application (PWA) with the following characteristics:

- Installable on desktop and mobile devices
- Responsive user interface
- Offline fallback page
- Web App Manifest support
- Service Worker support
- Fast loading experience

---

## User Roles

### Regular User

A regular user can:

- Register an account
- Log in and log out
- View their profile
- Search for cities
- View current weather details
- View weather forecasts
- View historical weather records
- Save favorite locations
- Receive weather alerts

### Administrator

An administrator can:

- Manage users
- View system statistics
- View weather records
- Manage alert thresholds
- Monitor API usage
- Access analytics dashboards

---

## Core Features

### Authentication

- User registration
- User login
- JWT authentication
- Password hashing
- Profile management

### Weather Search

Users can search for any city, such as:

- Nairobi
- Mombasa
- Kisumu
- Eldoret

The system retrieves weather information from the external weather API.

### Current Weather

The application displays:

- Temperature
- Humidity
- Atmospheric pressure
- Wind speed
- Weather description
- Weather icon
- Visibility
- Sunrise time
- Sunset time

### Weather Forecast

The application displays:

- Today’s forecast
- Hourly forecast when supported
- 5-day forecast

Forecast cards include:

- Minimum temperature
- Maximum temperature
- Humidity
- Wind speed
- Weather condition

### Historical Weather

Retrieved weather data is stored in the local database so users can:

- View previous weather records
- Filter by date
- Filter by city
- View charts showing historical trends

### Weather Alerts

The system generates simple rule-based alerts such as:

- High temperature
- Heavy rain
- Strong wind

Alerts appear inside the application. Email notifications may be added later if time permits.

### Favorite Locations

Users can:

- Save favorite cities
- Remove favorite cities
- Quickly access saved locations

### Dashboard

The main dashboard displays:

- Current weather
- Forecast summary
- Favorite cities
- Recent alerts
- Weather trend charts

### Charts

Chart.js is used to visualize weather history, including trends for:

- Temperature
- Humidity
- Atmospheric pressure
- Wind speed

### Admin Dashboard

The admin dashboard displays:

- Number of registered users
- Number of weather searches
- Most searched cities
- Recent weather requests
- System activity

---

## Suggested Database Models

### User

- id
- first_name
- last_name
- email
- password
- role
- created_at

### City

- id
- name
- country
- latitude
- longitude

### WeatherRecord

- id
- city
- temperature
- humidity
- pressure
- wind_speed
- visibility
- weather_condition
- weather_icon
- recorded_at

### FavoriteCity

- id
- user
- city

### WeatherAlert

- id
- city
- alert_type
- message
- severity
- created_at

---

## REST API

### Authentication

- POST /api/auth/register/
- POST /api/auth/login/
- POST /api/auth/logout/
- GET /api/profile/

### Weather

- GET /api/weather/current/
- GET /api/weather/forecast/
- GET /api/weather/history/

### Favorites

- GET /api/favorites/
- POST /api/favorites/
- DELETE /api/favorites/{id}/

### Alerts

- GET /api/alerts/

### Admin

- GET /api/admin/dashboard/
- GET /api/admin/users/

---

## UI Pages

### Public Pages

- Landing page
- Login
- Register

### Authenticated Pages

- Dashboard
- Weather search
- Forecast
- Weather history
- Favorites
- Alerts
- Profile

### Administrator Pages

- Admin dashboard
- User management
- Analytics

---

## UI Design Goals

The user interface should be:

- Modern
- Responsive
- Clean
- Minimal
- Mobile-first
- Easy to navigate

Angular Material components should be used where appropriate.

---

## Development Guidelines

- Follow Django best practices.
- Keep backend logic modular.
- Separate business logic into services where appropriate.
- Use RESTful API design.
- Write reusable Angular components.
- Keep code clean and well documented.
- Use environment variables for API keys.
- Handle API failures gracefully.
- Validate all user input.
- Display friendly error messages.

---

## Project Scope

This project is intentionally limited to software development.

The following are out of scope:

- ESP32
- Arduino
- NodeMCU
- DHT11 or DHT22 sensors
- BMP280 sensor
- MQTT
- LoRa
- Hardware firmware
- Embedded C/C++
- IoT communication
- Machine learning forecasting
- Custom weather prediction algorithms

Weather information must be obtained from an external weather API.

---

## Expected Outcome

The final product should demonstrate a complete weather monitoring solution that allows users to:

- Access current weather conditions
- View short-term weather forecasts
- Monitor historical weather information
- Receive weather alerts
- Save favorite locations
- Install the application as a Progressive Web App
- Access the platform from both desktop and mobile devices

The application should be suitable as a university final-year project, emphasizing clean architecture, maintainable code, usability, and achievement of the project objectives.

---

## Repository Status

This repository currently serves as the foundation for the proposed system. The README documents the project scope, requirements, architecture direction, and planned features for implementation.
