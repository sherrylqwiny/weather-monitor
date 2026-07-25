# Quick Start Guide - Authentication Testing

## Prerequisites

- Python 3.10+
- Node.js 18+
- pip
- npm

---

## Backend Setup (5-10 minutes)

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Create Python Virtual Environment (if not already created)
```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**On Windows:**
```bash
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
```

Enter:
- Username: `admin`
- Email: `admin@weather.local`
- Password: `admin123` (or your choice)

### 7. Create Test User (Optional)
```bash
python manage.py shell
```

Then in Python shell:
```python
from apps.accounts.models import User

User.objects.create_user(
    email='test@weather.local',
    username='testuser',
    password='test123',
    first_name='Test',
    last_name='User',
    role='user'
)
exit()
```

### 8. Run Backend Server
```bash
python manage.py runserver
```

✅ Backend running at: `http://localhost:8000`

---

## Frontend Setup (3-5 minutes)

### 1. Open New Terminal/Command Prompt

### 2. Navigate to Frontend
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Angular Dev Server
```bash
ng serve
```

✅ Frontend running at: `http://localhost:4200`

---

## Test Authentication Flow

### Step 1: Register New User
1. Open browser to `http://localhost:4200`
2. Click "Register" or go to `http://localhost:4200/register`
3. Fill out form:
   - Email: `newuser@weather.local`
   - Username: `newuser`
   - Full Name: `John Doe`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Sign up"
5. ✅ Should redirect to dashboard

### Step 2: View Dashboard
- Dashboard displays weather cards (placeholder data)
- Top-right shows username
- Sidebar shows navigation menu

### Step 3: Access Profile
1. Click username in top-right navbar
2. Click "Profile"
3. View current user information
4. Edit fields if desired

### Step 4: Logout
1. Click username in top-right navbar
2. Click "Logout"
3. ✅ Should redirect to login page

### Step 5: Login with Registered User
1. At login page, enter:
   - Email: `newuser@weather.local`
   - Password: `password123`
2. Click "Sign in"
3. ✅ Should redirect to dashboard

### Step 6: Try Admin Panel
1. Logout
2. Login with admin credentials:
   - Email: `admin@weather.local`
   - Password: `admin123`
3. Navigate to `/admin` route (or check if admin link appears)
4. Admin should see admin-specific features

---

## API Testing with Postman/cURL

### Register Endpoint
```bash
curl -X POST http://localhost:8000/api/accounts/register/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@weather.local",
    "username": "testuser",
    "password": "password123",
    "password_confirm": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "test@weather.local",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login Endpoint
```bash
curl -X POST http://localhost:8000/api/accounts/login/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@weather.local",
    "password": "password123"
  }'
```

### Get Profile (Requires Token)
```bash
curl -X GET http://localhost:8000/api/accounts/profile/me/ \
  -H "Authorization: Bearer <access_token>"
```

---

## Troubleshooting

### Backend Issues

**"Port 8000 already in use"**
```bash
python manage.py runserver 8001
```
Then update frontend's `environment.ts` to use `http://localhost:8001/api`

**"Database error"**
```bash
python manage.py migrate --run-syncdb
```

**"Module not found"**
```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**"Port 4200 already in use"**
```bash
ng serve --port 4201
```

**"Module not found"**
```bash
npm install --legacy-peer-deps
```

**"CORS error in browser console"**
- Ensure backend is running on `http://localhost:8000`
- Check backend CORS settings in `config/settings/base.py`

### Authentication Issues

**"Invalid email or password"**
- Verify email/password in created user
- Check user exists in Django admin: `http://localhost:8000/admin/`

**"Tokens not storing"**
- Check browser localStorage in DevTools
- Verify auth interceptor is registered in `app-module.ts`

**"401 Unauthorized on API calls"**
- Token might be expired (15 min expiry)
- Login again to get new token
- Token refresh feature to be implemented in next phase

---

## Next Steps

After successful authentication:

1. **Test All Auth Features**
   - Change password
   - Update profile
   - Upload profile picture (backend field exists)
   - Password reset flow

2. **Move to Phase 3: Weather API**
   - Connect to external weather service
   - Implement weather endpoints
   - Display real weather data

3. **Production Readiness**
   - Add email verification
   - Implement rate limiting
   - Use HTTPS
   - Switch to PostgreSQL
   - Add password reset email flow

---

## Debugging Tips

### View Backend Logs
Backend console shows:
- HTTP requests
- SQL queries (if DEBUG=True)
- Authentication events

### View Frontend Logs
Browser DevTools Console (F12):
- API request/response logs
- Token storage verification
- Angular compilation warnings

### Django Admin
Access at: `http://localhost:8000/admin/`
- Create/manage users
- View user roles
- Manage permissions

### Browser DevTools
- **Network tab**: See API requests/responses
- **Storage tab**: View localStorage tokens
- **Console**: Check for errors

---

## Files Reference

### Backend Authentication Files
- `backend/apps/accounts/models.py` - User model
- `backend/apps/accounts/serializers.py` - API serializers
- `backend/apps/accounts/views.py` - API endpoints
- `backend/apps/accounts/urls.py` - URL routing
- `backend/apps/accounts/permissions.py` - Custom permissions
- `backend/config/settings/base.py` - JWT configuration

### Frontend Authentication Files
- `frontend/src/core/services/auth.service.ts` - Auth logic
- `frontend/src/core/interceptors/auth.interceptor.ts` - Token injection
- `frontend/src/core/guards/auth.guard.ts` - Route protection
- `frontend/src/features/auth/login/` - Login component
- `frontend/src/features/auth/register/` - Register component
- `frontend/src/app/shared/components/navbar/` - User menu

---

## Quick Commands Reference

```bash
# Backend
cd backend
venv\Scripts\activate                    # Windows
source venv/bin/activate                 # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend
cd frontend
npm install
ng serve

# Both servers should run simultaneously
```

**Backend**: `http://localhost:8000`
**Frontend**: `http://localhost:4200`
**Django Admin**: `http://localhost:8000/admin/`
