# Backend Setup Guide - Phase 1

## Project Status

✅ **Phase 1 Configuration Complete**

The Django backend has been configured with:
- ✅ CORS enabled for Angular frontend (localhost:4200)
- ✅ Timezone set to Africa/Nairobi
- ✅ Static and media files configured
- ✅ SQLite database configured (development)
- ✅ REST API endpoints configured
- ✅ Backend .gitignore created
- ✅ Environment variables template (.env.example)

---

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

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

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Create Environment File

Copy the example and customize:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,127.0.0.1:4200
```

### 5. Run Migrations

```bash
python manage.py migrate
```

### 6. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The server will be available at: `http://localhost:8000`

---

## API Endpoints

The REST API is available at `http://localhost:8000/api/`

### Available Endpoints

- **Accounts**: `/api/accounts/profiles/` - User profiles
- **Weather**: `/api/weather/records/` - Weather records
- **Forecasts**: `/api/forecasts/forecasts/` - Weather forecasts
- **Alerts**: `/api/alerts/alerts/` - Weather alerts
- **Favorites**: `/api/favorites/favorites/` - Favorite cities
- **Admin**: `http://localhost:8000/admin/` - Django admin panel

---

## Database

### Development Database
- **Type**: SQLite
- **Location**: `backend/db.sqlite3`
- **Features**: No setup required, automatic initialization

### Production Database (PostgreSQL)

To switch to PostgreSQL:

1. Update `requirements.txt` to ensure `psycopg2-binary` is installed
2. In `.env`, set:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/weather_db
   ```
3. Update `config/settings/base.py` to use `dj_database_url`

---

## CORS Configuration

Frontend (`http://localhost:4200`) is allowed to access the API.

For production, update in `.env`:
```
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Static & Media Files

- **Static files**: `/backend/static/` - CSS, JS, images
- **Media files**: `/backend/media/` - User uploads

In development, these are served automatically. For production, use WhiteNoise (already configured).

---

## Common Commands

```bash
# Create migrations for model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Collect static files (production)
python manage.py collectstatic

# Open Python shell
python manage.py shell

# Run tests
python manage.py test
```

---

## Frontend Integration

The Angular frontend (at `http://localhost:4200`) can now access the backend API at `http://localhost:8000/api/`.

Example API call from frontend:
```typescript
GET http://localhost:8000/api/weather/records/
```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'django'"
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

### "Port 8000 already in use"
```bash
python manage.py runserver 8001
```

### Database errors
```bash
rm backend/db.sqlite3
python manage.py migrate
```

---

## Next Steps

- Phase 2: Implement API endpoints and models
- Phase 3: Add authentication and permissions
- Phase 4: Connect frontend to backend
