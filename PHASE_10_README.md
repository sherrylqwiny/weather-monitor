# Phase 10: Background Tasks & Automated Weather Synchronization

This phase implements scheduled background tasks to keep weather data fresh and automatically generate alerts for users.

## Features

✅ **Scheduled Weather Updates** — Fetches weather data from OpenWeather API every hour  
✅ **Automatic Alert Generation** — Generates alerts every 30 minutes based on weather conditions and user preferences  
✅ **Cache Cleanup** — Removes old forecast and history records daily at midnight  
✅ **Celery Integration** — Production-ready background task queue with retry logic  
✅ **Django Management Commands** — Run tasks manually or via cron

## Architecture

### Management Commands

Three Django management commands handle the core logic:

1. **`sync_weather`** — Synchronizes weather data from OpenWeather for all favorite cities and active weather stations
   ```bash
   python manage.py sync_weather
   python manage.py sync_weather --cities "London,New York,Tokyo"
   ```

2. **`generate_weather_alerts`** — Generates alerts for all users or a specific user
   ```bash
   python manage.py generate_weather_alerts
   python manage.py generate_weather_alerts --user-id 1
   ```

3. **`cleanup_weather_cache`** — Removes old cached weather records
   ```bash
   python manage.py cleanup_weather_cache --days-forecast 7 --days-history 30
   ```

### Celery Tasks

Three Celery tasks (`config/tasks.py`) wrap the management commands for distributed task execution:

- `weather.sync_weather` — Hourly
- `alerts.generate_alerts` — Every 30 minutes
- `weather.cleanup_cache` — Daily at midnight

## Setup & Configuration

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Includes:
- `celery` — Distributed task queue
- `redis` — Message broker & result backend

### 2. Configure Redis (for Celery)

**Development (in-memory fallback):**
```python
# config/settings/development.py
CELERY_BROKER_URL = "memory://"
CELERY_RESULT_BACKEND = "cache+memory://"
```

**Production (Redis required):**
```bash
# Install Redis
# macOS:
brew install redis
redis-server

# Ubuntu:
sudo apt-get install redis-server
sudo systemctl start redis-server
```

Then configure in settings:
```python
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/0"
```

### 3. Add OpenWeather API Key

Create or update `backend/.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
OPENWEATHER_CACHE_TTL=600
```

### 4. Run Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## Running Background Tasks

### Option A: Celery (Recommended for Production)

**Start Celery Worker:**
```bash
cd backend
celery -A config worker -l info
```

**Start Celery Beat (Scheduler):**
```bash
cd backend
celery -A config beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

Or use both in one process:
```bash
cd backend
celery -A config worker -l info -B
```

### Option B: Django Management Commands (Manual or Cron)

**Run manually:**
```bash
cd backend

# Sync weather for all favorite cities
python manage.py sync_weather

# Generate alerts for all users
python manage.py generate_weather_alerts

# Clean up old cache records
python manage.py cleanup_weather_cache
```

**Setup Cron Jobs (Linux/macOS):**
```bash
# Edit crontab
crontab -e

# Add these lines:
# Every hour at :00
0 * * * * cd /path/to/backend && python manage.py sync_weather >> /var/log/weather_sync.log 2>&1

# Every 30 minutes
*/30 * * * * cd /path/to/backend && python manage.py generate_weather_alerts >> /var/log/weather_alerts.log 2>&1

# Daily at midnight
0 0 * * * cd /path/to/backend && python manage.py cleanup_weather_cache >> /var/log/weather_cleanup.log 2>&1
```

## Task Schedule (Celery Beat)

| Task | Schedule | Purpose |
|------|----------|---------|
| `sync_weather` | Hourly (`:00`) | Fetch latest weather from OpenWeather API |
| `generate_alerts` | Every 30 min | Generate user alerts based on conditions |
| `cleanup_cache` | Daily (00:00) | Remove forecasts >7 days, history >30 days old |

Configure in `config/settings/development.py`:
```python
CELERY_BEAT_SCHEDULE = {
    "sync-weather-hourly": {
        "task": "weather.sync_weather",
        "schedule": crontab(minute=0),
    },
    "generate-alerts-every-30-min": {
        "task": "alerts.generate_alerts",
        "schedule": crontab(minute="*/30"),
    },
    "cleanup-weather-cache-daily": {
        "task": "weather.cleanup_cache",
        "schedule": crontab(hour=0, minute=0),
    },
}
```

## Alert Generation Rules

Alerts are generated for each favorite city when:

- **High Temperature** — ≥ 35°C
- **Strong Wind** — ≥ 17 m/s
- **Heavy Rain** — ≥ 20mm or ≥ 80% probability in next 6 hours
- **Poor Air Quality** — AQI ≥ 4

Alerts are throttled (one per rule/city/day) to avoid notification spam.

## Testing

### Test Management Commands

```bash
cd backend

# Test weather sync (specific cities)
python manage.py sync_weather --cities "London,Paris"

# Test alert generation (specific user)
python manage.py generate_weather_alerts --user-id 1

# Test cache cleanup with custom thresholds
python manage.py cleanup_weather_cache --days-forecast 3 --days-history 7
```

### Test Celery Tasks

```bash
# Start Celery worker in debug mode
celery -A config worker -l debug

# In another terminal, trigger tasks
python manage.py shell

from config.tasks import sync_weather_task, generate_alerts_task, cleanup_weather_cache_task

# Test sync
sync_weather_task.delay()

# Test alerts
generate_alerts_task.delay()

# Test cleanup
cleanup_weather_cache_task.delay()
```

### Check Task Results

```python
from celery.result import AsyncResult

# Get task result by ID
result = AsyncResult("task-id-here")
print(result.state)
print(result.result)
```

## Monitoring & Logging

### View Celery Worker Logs

```bash
# In development, worker logs appear in terminal
celery -A config worker -l info

# In production, pipe to file
celery -A config worker -l info > celery.log 2>&1 &
```

### Monitor Active Tasks

```bash
celery -A config inspect active
```

### Check Task Queue

```bash
celery -A config inspect reserved
```

## Error Handling & Retry Logic

All tasks are configured with:
- **Max Retries**: 2-3 (increases exponentially)
- **Retry Backoff**: 60 seconds × (2 ^ retry_count)
- **Task Timeout**: 30 minutes

If a task fails, Celery automatically retries with exponential backoff before logging the error.

## Production Considerations

1. **Use Redis/RabbitMQ** instead of memory broker for reliability
2. **Configure Persistent Task Results** (database or Redis)
3. **Monitor Worker Health** with tools like Flower:
   ```bash
   pip install flower
   celery -A config flower
   # Access at http://localhost:5555
   ```
4. **Set Up Log Aggregation** (e.g., ELK Stack, Sentry)
5. **Configure Resource Limits** (workers, concurrency)
6. **Use Supervisor/Systemd** to auto-restart workers
7. **Schedule Backups** of favorite cities and alert history

## Deliverable Summary

✅ Automatic hourly weather synchronization for all favorite cities  
✅ Automatic 30-minute alert generation based on weather conditions  
✅ Daily cache cleanup to maintain database performance  
✅ Production-ready Celery setup with retry logic and error handling  
✅ Manual Django management commands for on-demand task execution  
✅ Comprehensive logging and monitoring support

---

**Next Phase (11)**: API Documentation & Advanced Features
