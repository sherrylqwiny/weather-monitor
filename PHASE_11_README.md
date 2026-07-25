# Phase 11: PWA Backend Support

### Overview

This phase adds backend endpoints to support Angular Progressive Web App (PWA) offline-first capabilities. The backend now provides:

- **Health & Version Endpoints** — Monitor backend status and manage app versions
- **Offline Synchronization** — Track and sync offline-generated actions when back online
- **Cached Weather Data** — Pre-fetch weather data for offline consumption

---

## Features

✅ **Health Check Endpoint** — Real-time monitoring of backend health  
✅ **Version Management API** — Track app versions and force critical updates  
✅ **Offline Sync Queue** — Log and replay offline user actions  
✅ **Cached Weather Endpoint** — Pre-fetch all weather data for offline mode  
✅ **Admin Interface** — Manage versions and sync logs in Django admin  

---

## Architecture

### New Models

#### `AppVersion`
Tracks application versions for PWA update management.

```python
class AppVersion(models.Model):
    version: str              # e.g., "1.0.0"
    build_number: int         # Numeric build identifier
    release_date: datetime    # Auto-generated
    changelog: str            # Release notes
    is_critical: bool         # Force update if True
    features: list            # New features/changes
    min_version: str          # Minimum required version
```

#### `OfflineSyncLog`
Logs actions performed offline to be synced when back online.

```python
class OfflineSyncLog(models.Model):
    user: str                 # User identifier
    action_type: str          # favorite_add, favorite_remove, alert_read, etc.
    entity_type: str          # Type of entity (favorite, alert)
    entity_id: str            # ID of the entity
    payload: dict             # Full action data to replay
    synced: bool              # Whether action was synced
    synced_at: datetime       # When synced
    created_at: datetime      # When action was created
    error_message: str        # Error details if sync failed
```

### New Endpoints

#### 1. **Health Check**
```http
GET /api/system/health/
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-07-24T09:30:00Z",
  "database": "healthy",
  "cache": "healthy",
  "uptime_seconds": 123456
}
```

Used by PWA and monitoring tools to verify backend availability.

---

#### 2. **App Version Management**

**Get Latest Version:**
```http
GET /api/system/versions/latest/
```

**Response:**
```json
{
  "id": 1,
  "version": "1.0.0",
  "build_number": 10000,
  "release_date": "2026-07-24T09:00:00Z",
  "changelog": "Initial release",
  "is_critical": false,
  "features": ["Weather monitoring", "PWA support"],
  "min_version": ""
}
```

**Check Update Required:**
```http
GET /api/system/versions/update_required/?current_version=0.9.5
```

**Response (Update Required):**
```json
{
  "update_required": true,
  "reason": "minimum_version_required",
  "latest_version": "1.0.0",
  "is_critical": true
}
```

**Response (No Update):**
```json
{
  "update_required": false,
  "latest_version": "1.0.0"
}
```

---

#### 3. **Offline Sync Endpoints**

**Get Pending Actions for User:**
```http
GET /api/system/sync-log/pending/?user=john_doe
```

**Response:**
```json
[
  {
    "id": 1,
    "user": "john_doe",
    "action_type": "favorite_add",
    "entity_type": "favorite",
    "entity_id": "london",
    "payload": {
      "city": "London",
      "is_active": true
    },
    "synced": false,
    "synced_at": null,
    "created_at": "2026-07-24T08:30:00Z",
    "error_message": ""
  }
]
```

**Log Offline Action:**
```http
POST /api/system/sync-log/log_action/
```

**Request Body:**
```json
{
  "user": "john_doe",
  "action_type": "favorite_add",
  "entity_type": "favorite",
  "entity_id": "london",
  "payload": {
    "city": "London",
    "is_active": true
  }
}
```

**Response:**
```json
{
  "id": 1,
  "user": "john_doe",
  "action_type": "favorite_add",
  "entity_type": "favorite",
  "entity_id": "london",
  "payload": {...},
  "synced": false,
  "synced_at": null,
  "created_at": "2026-07-24T08:30:00Z",
  "error_message": ""
}
```

**Sync Batch of Actions:**
```http
POST /api/system/sync-log/sync_batch/
```

**Request Body:**
```json
{
  "user": "john_doe",
  "actions": [
    {
      "id": 1,
      "action_type": "favorite_add",
      "entity_type": "favorite",
      "entity_id": "london",
      "payload": {...}
    }
  ]
}
```

**Response:**
```json
{
  "synced_count": 1,
  "failed_count": 0,
  "synced_ids": [1],
  "failed_ids": []
}
```

---

#### 4. **Cached Weather Endpoint**

**Get All Cached Weather:**
```http
GET /api/system/weather/cached/
```

**Response:**
```json
{
  "count": 3,
  "cached_at": "2026-07-24T09:30:00Z",
  "records": [
    {
      "id": 1,
      "city": "London",
      "country": "UK",
      "temperature": 18.5,
      "feels_like": 17.2,
      "humidity": 65,
      "wind_speed": 8.5,
      "weather_condition": "Cloudy",
      "weather_description": "overcast clouds",
      "weather_icon": "04d",
      "air_quality_index": 2,
      "updated_at": "2026-07-24T09:15:00Z"
    }
  ]
}
```

Used by PWA to pre-fetch and cache weather data for offline access.

---

## Setup & Configuration

### 1. Run Migrations

Create and apply migrations for new models:

```bash
cd backend
python manage.py makemigrations common
python manage.py migrate common
```

### 2. Seed Initial Version

```bash
python manage.py seed_app_version --version 1.0.0
python manage.py seed_app_version --version 2.0.0 --critical
```

### 3. Register in Admin

The models are automatically registered in Django admin:
- Visit `/admin/common/` to manage versions and sync logs

---

## Usage Patterns

### PWA Offline Flow

#### 1. **App Initialization**
On app startup, check for updates:

```typescript
// Angular PWA
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private swUpdate: SwUpdate) {}

  ngOnInit() {
    // Check version and trigger update if needed
    this.checkAppVersion();
  }

  checkAppVersion() {
    this.http.get<any>('/api/system/versions/update_required/', {
      params: { current_version: '1.0.0' }
    }).subscribe(response => {
      if (response.update_required) {
        console.log('Update available:', response.latest_version);
        if (this.swUpdate.isEnabled) {
          this.swUpdate.activateUpdate();
        }
      }
    });
  }
}
```

#### 2. **Log Offline Actions**
When user is offline, log actions:

```typescript
// In a service
logOfflineAction(action: any) {
  if (!navigator.onLine) {
    this.http.post('/api/system/sync-log/log_action/', {
      user: this.currentUser,
      action_type: action.type,
      entity_type: action.entity,
      entity_id: action.id,
      payload: action
    }).subscribe();
  }
}
```

#### 3. **Sync on Reconnection**
When back online, sync pending actions:

```typescript
// In a service
syncOfflineActions() {
  // Get pending actions
  this.http.get<any[]>('/api/system/sync-log/pending/', {
    params: { user: this.currentUser }
  }).subscribe(pending => {
    if (pending.length > 0) {
      // Batch sync
      this.http.post('/api/system/sync-log/sync_batch/', {
        user: this.currentUser,
        actions: pending
      }).subscribe(result => {
        console.log('Synced', result.synced_count, 'actions');
      });
    }
  });
}

// Listen for online event
window.addEventListener('online', () => {
  this.syncOfflineActions();
});
```

#### 4. **Pre-fetch Weather for Offline**
In service worker or on app init:

```typescript
// Pre-fetch weather data for offline mode
preloadWeatherData() {
  this.http.get('/api/system/weather/cached/').subscribe(data => {
    // Cache in IndexedDB or LocalStorage for offline access
    this.offlineCache.setItem('weatherData', JSON.stringify(data));
  });
}
```

---

## Testing

### Test Health Endpoint

```bash
curl http://localhost:8000/api/system/health/
```

### Test Version API

```bash
# Get latest version
curl http://localhost:8000/api/system/versions/latest/

# Check if update required
curl "http://localhost:8000/api/system/versions/update_required/?current_version=0.9.0"
```

### Test Offline Sync

```bash
# Log offline action
curl -X POST http://localhost:8000/api/system/sync-log/log_action/ \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john_doe",
    "action_type": "favorite_add",
    "entity_type": "favorite",
    "entity_id": "london",
    "payload": {"city": "London"}
  }'

# Get pending actions
curl "http://localhost:8000/api/system/sync-log/pending/?user=john_doe"

# Sync batch
curl -X POST http://localhost:8000/api/system/sync-log/sync_batch/ \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john_doe",
    "actions": [{"id": 1}]
  }'
```

### Test Cached Weather

```bash
curl http://localhost:8000/api/system/weather/cached/
```

---

## Admin Interface

### Version Management

1. Go to Django Admin: `/admin/common/appversion/`
2. Create/Edit versions:
   - Set `is_critical = True` to force all clients to update
   - Set `min_version` to enforce minimum version requirement
   - Add features and changelog

### Sync Log Monitoring

1. Go to Django Admin: `/admin/common/offlinesynclog/`
2. View pending and synced actions per user
3. Actions:
   - Mark as synced: Manually mark pending actions as synced
   - Mark as pending: Requeue synced actions

---

## Production Considerations

### 1. Database Indexes
Ensure indexes on high-query fields:
```python
# Already included in models:
indexes = [
    models.Index(fields=["user", "synced"]),
]
```

### 2. Cache Strategy
Sync logs are not cached; use direct DB queries for reliability.

### 3. Monitoring
Use the health endpoint for:
- Kubernetes liveness probes
- Load balancer health checks
- Uptime monitoring services (Sentry, NewRelic, DataDog)

### 4. Cleanup Strategy
Implement periodic cleanup of old sync logs:
```bash
# Create cleanup task (optional)
python manage.py shell
from apps.common.models import OfflineSyncLog
from datetime import timedelta
from django.utils import timezone

cutoff = timezone.now() - timedelta(days=30)
OfflineSyncLog.objects.filter(synced=True, synced_at__lt=cutoff).delete()
```

---

## File Structure

```
backend/
├── apps/common/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py           # AppVersion, OfflineSyncLog
│   ├── serializers.py      # Serializers for endpoints
│   ├── views.py            # ViewSets and API views
│   ├── urls.py             # URL routing
│   ├── admin.py            # Admin interface
│   └── management/
│       └── commands/
│           └── seed_app_version.py
```

---

## Summary

**Phase 11 Deliverables:**

✅ Health check endpoint for monitoring  
✅ Version management API with update enforcement  
✅ Offline action sync queue with batch processing  
✅ Cached weather endpoint for PWA pre-fetch  
✅ Django admin interface for management  
✅ Production-ready with error handling and logging  

**Next Phase (12)**: Docker & Deployment

---

## Quick Commands Reference

```bash
# Create and apply migrations
python manage.py makemigrations common
python manage.py migrate common

# Seed app versions
python manage.py seed_app_version
python manage.py seed_app_version --version 2.0.0 --critical

# Run server
python manage.py runserver

# Test endpoints
curl http://localhost:8000/api/system/health/
curl http://localhost:8000/api/system/versions/latest/
curl "http://localhost:8000/api/system/weather/cached/"
```
