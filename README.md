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

---

## Frontend — Setup & Run (Development)

Follow these steps to get the Angular frontend running locally. This guide assumes you only want to run the frontend for now (the backend can be set up later).

Prerequisites
- Git (to clone the repository)
- Node.js (LTS recommended, e.g. 18.x or newer) and npm (bundled with Node)
- Optional: Angular CLI installed globally (recommended for convenience)

Check your environment (PowerShell / CMD):

```powershell
node -v
npm -v
ng version  # optional, fails if CLI not installed globally
```

If Node.js is missing, download and install it from https://nodejs.org/ (select LTS). If you do not want to install the Angular CLI globally, you can use the local CLI via `npx`.

Clone the repository

```powershell
git clone https://github.com/sherrylqwiny/weather-monitor online-weather-monitoring-system
cd online-weather-monitoring-system
```

Front-end workspace

The frontend application lives in the `frontend` folder. Change into that directory and install dependencies:

```powershell
cd frontend
npm install
# If you get peer dependency errors or conflicts, try:
# npm install --legacy-peer-deps
```

If you don't have the Angular CLI globally and prefer to install it:

```powershell
npm install -g @angular/cli
```

Install UI and chart dependencies (if missing)

The project already contains the required packages in `package.json`, but if you need to add them manually use the following (matched to the generated Angular version):

```powershell
# Compatible with Angular 21 scaffold used in this repository
npm install @angular/material@21 @angular/cdk@21 @angular/animations@21
npm install chart.js ng2-charts@8
npm install @angular/service-worker
```

Environment configuration

Frontend environment files are in `src/environments`. Edit `src/environments/environment.ts` for development values (API base URL, feature toggles):

- [frontend/src/environments/environment.ts](frontend/src/environments/environment.ts)
- [frontend/src/environments/environment.prod.ts](frontend/src/environments/environment.prod.ts)

Running the development server

Start the dev server (default port 4200):

```powershell
ng serve
# or if Angular CLI is not global
npx ng serve
```

Open your browser to:

```
http://localhost:4200
```

Custom host / port (network access):

```powershell
ng serve --host 0.0.0.0 --port 4200
```

Building for production and testing the PWA service worker

To build a production bundle and enable the service worker (PWA):

```powershell
ng build --configuration production
```

To test the production build (service worker) locally, serve the contents of `dist/frontend` with a static server (this requires the production service worker files to be present):

```powershell
npm install -g http-server
http-server ./dist/frontend -p 8080
# then open http://localhost:8080
```

Troubleshooting

- If `npm install` fails with peer dependency errors, try `npm install --legacy-peer-deps`.
- If `ng` is not found, either install Angular CLI globally (`npm install -g @angular/cli`) or use `npx ng`.
- If ports are in use, change `--port` in `ng serve`.
- If you see style or build errors after edits, run a clean install:

```powershell
rm -r node_modules package-lock.json
npm install
```

Next steps (recommended)

- Verify the app loads at `http://localhost:4200` and the layout (sidebar/topbar/footer) renders.
- Wire the frontend to a running backend API by updating `environment.apiBaseUrl`.

---

## Backend — Setup & Run (Development)

Follow these steps to get the Django REST API running locally.

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git (to clone the repository, if not done already)

Check your environment:

```powershell
python --version
pip --version
```

If Python is missing, download and install it from https://www.python.org/ (select the latest 3.x version and **check "Add Python to PATH"** during installation).

### Backend workspace

Change into the backend directory:

```powershell
cd backend
```

### Create virtual environment

A virtual environment isolates project dependencies from your system Python:

```powershell
python -m venv venv
```

### Activate virtual environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

After activation, your terminal prompt should show `(venv)` at the beginning.

### Install dependencies

```powershell
pip install -r requirements.txt
```

If installation takes a long time or fails, you may be installing dependencies for PostgreSQL support which requires compilation. For development, SQLite is sufficient (already configured).

### Configure environment variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with your preferred editor. Key values:

```
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,127.0.0.1:4200
```

### Run migrations

Set up the database schema:

```powershell
python manage.py migrate
```

You should see output like:
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

### Create superuser (optional)

To access the Django admin panel at `/admin/`:

```powershell
python manage.py createsuperuser
```

Follow the prompts to create a username and password.

### Run development server

Start the Django API server (default port 8000):

```powershell
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

Open your browser to test the API:

```
http://localhost:8000/api/
```

You should see a browsable REST API interface.

### Common development commands

```powershell
# Create database migrations after changing models
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Open Django shell (Python REPL with Django context)
python manage.py shell

# Run tests
python manage.py test

# Collect static files (production only)
python manage.py collectstatic
```

### Available API endpoints

Once the backend is running, test these endpoints:

- **API Root**: http://localhost:8000/api/
- **Weather Records**: http://localhost:8000/api/weather/records/
- **Forecasts**: http://localhost:8000/api/forecasts/forecasts/
- **Alerts**: http://localhost:8000/api/alerts/alerts/
- **Favorites**: http://localhost:8000/api/favorites/favorites/
- **User Profiles**: http://localhost:8000/api/accounts/profiles/
- **Admin Panel**: http://localhost:8000/admin/

### Troubleshooting

**"ModuleNotFoundError: No module named 'django'"**
- Ensure the virtual environment is activated (prompt shows `(venv)`)
- Run `pip install -r requirements.txt`

**"Port 8000 already in use"**
```powershell
python manage.py runserver 8001
```

**Database errors or migration issues**
```powershell
# Reset the database (removes all data)
Remove-Item db.sqlite3
python manage.py migrate
```

**Permission denied on activate.ps1**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

### Connecting frontend to backend

Once both frontend and backend are running:

1. **Frontend** runs on: http://localhost:4200
2. **Backend** runs on: http://localhost:8000

Edit [frontend/src/environments/environment.ts](frontend/src/environments/environment.ts) to point to the backend API:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api'
};
```

The frontend will now be able to fetch data from the backend API.

### Next steps

- Verify the API responds at `http://localhost:8000/api/`
- Create a superuser and log in to the admin panel at `http://localhost:8000/admin/`
- Start implementing and testing API endpoints
- Connect the frontend to the backend API

For detailed backend setup documentation, see [backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md).
- Create a local `.env` or CI secrets for any API keys (do not commit secrets).

If you want, I can add a single-command PowerShell script to automate the frontend setup (install + serve) or create a small CONTRIBUTING section describing how to run both backend and frontend together.

---

## Phase 2 — UI/UX Design (Frontend Only)

This phase focuses on designing and implementing reusable UI components for the Angular frontend. The following shared components will be created under `src/app/shared/components` and used across the dashboard, forecast, alerts, and favorites pages.

Shared Components

- **Weather Card**: compact current-weather summary with temperature, location, and quick actions.
- **Forecast Card**: daily/hourly forecast tile used in lists and detail views.
- **Alert Card**: displays active alerts with severity and dismiss/action controls.
- **Statistics Card**: small card for KPI values (humidity, wind, UV index, precipitation chance).
- **Search Bar**: autocomplete search input for cities and locations.
- **Weather Icon Component**: renders SVG/weather icons consistently across cards.
- **Loading Spinner**: reusable loading indicator for network requests.
- **Empty State Component**: friendly UI shown when lists are empty.
- **Error Component**: shows error messages and retry actions.
- **Confirm Dialog**: generic confirmation modal for destructive actions.
- **Reusable Buttons**: standardized button variants (primary, secondary, icon-only).

Implementation notes

- Place component stubs in `frontend/src/app/shared/components/<component-name>/`.
- Each component should have its own `.ts`, `.html`, and `.scss` files and be exported by `SharedModule`.
- Start by creating minimal presentation-only components, then add inputs/outputs and services as needed.

If you'd like, I can wire these components into `SharedModule` and generate Angular CLI component declarations next. Tell me whether you prefer I create only stubs (presentation files) or full Angular CLI components (declared in module and ready to use).
