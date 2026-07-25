# Phase 2 Reference Guide

## 📚 Documentation Index

### Quick Reference
- **Setup Guide**: [QUICK_START.md](QUICK_START.md) - 5-minute setup and basic testing
- **API Reference**: [PHASE_2_AUTH.md](PHASE_2_AUTH.md) - Complete endpoint documentation
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - System design and flows
- **Testing**: [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Comprehensive test cases
- **Completion**: [PHASE_2_COMPLETION.md](PHASE_2_COMPLETION.md) - What was built
- **Summary**: [PHASE_2_SUMMARY.md](PHASE_2_SUMMARY.md) - Phase overview

---

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Access**:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

### Frontend
```bash
cd frontend
npm install
ng serve
```

**Access**:
- App: http://localhost:4200

---

## 📋 API Endpoints

### Authentication Routes (`/api/accounts/`)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|--------------|---------|
| POST | `/register/register/` | No | Register new user |
| POST | `/login/login/` | No | Authenticate user |
| POST | `/logout/logout/` | Yes | Logout user |
| GET | `/profile/me/` | Yes | Get current user |
| PATCH | `/profile/update_profile/` | Yes | Update profile |
| POST | `/password-change/change_password/` | Yes | Change password |
| POST | `/password-reset/request_reset/` | No | Request password reset |
| POST | `/password-reset/confirm_reset/` | No | Confirm password reset |

---

## 🔐 Security

### Tokens
- **Access Token**: 15-minute lifetime
- **Refresh Token**: 7-day lifetime
- **Storage**: localStorage (development), httpOnly cookies (production)
- **Format**: JWT (3 parts: header.payload.signature)

### Passwords
- **Validation**: Django built-in validators
- **Hashing**: PBKDF2 by default
- **Requirements**: Min 8 chars, not common words

### CORS
- **Allowed Origin**: http://localhost:4200
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

### Role-Based Access
- **Admin**: Full access to all endpoints
- **User**: Read-only on public data, write on own data
- **Roles Assigned**: Via Django admin or registration

---

## 📁 Key Files

### Backend Authentication
| File | Purpose |
|------|---------|
| `models.py` | User model with roles |
| `serializers.py` | Request/response validation |
| `views.py` | API endpoint handlers |
| `urls.py` | URL routing |
| `permissions.py` | Custom access control |
| `admin.py` | Django admin setup |
| `settings/base.py` | JWT configuration |

### Frontend Authentication
| File | Purpose |
|------|---------|
| `auth.service.ts` | Auth logic & state management |
| `auth.interceptor.ts` | Automatic token injection |
| `auth.guard.ts` | Route protection |
| `login.component.ts` | Login UI |
| `register.component.ts` | Registration UI |
| `navbar.component.ts` | User menu |
| `app-module.ts` | App configuration |
| `app-routing-module.ts` | Routes with guards |

---

## 🧪 Testing Quick Guide

### Backend API Test (curl)
```bash
# Register
curl -X POST http://localhost:8000/api/accounts/register/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@weather.local",
    "username": "testuser",
    "password": "pass123",
    "password_confirm": "pass123",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login
curl -X POST http://localhost:8000/api/accounts/login/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@weather.local", "password": "pass123"}'

# Get Profile (requires token)
curl -X GET http://localhost:8000/api/accounts/profile/me/ \
  -H "Authorization: Bearer <access_token>"
```

### Frontend UI Test
1. Go to http://localhost:4200
2. Click "Sign up"
3. Fill registration form
4. Click "Sign up" button
5. Should redirect to dashboard
6. Click user icon (top-right)
7. Click "Logout"
8. Should redirect to login

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Reset database
rm db.sqlite3
python manage.py migrate
```

### Frontend Won't Compile
```bash
# Clear dependencies
rm -rf node_modules
npm cache clean --force

# Reinstall
npm install --legacy-peer-deps

# Clear build cache
npm run clean
```

### CORS Error in Browser
- Verify backend CORS settings in `config/settings/base.py`
- Verify frontend URL in CORS_ALLOWED_ORIGINS
- Restart backend server
- Restart frontend server

### "Cannot find module" Error
- Check import paths are relative to current file
- Verify files exist in correct locations
- Run `npm install` or `pip install -r requirements.txt`

### Tokens Not Storing
- Check browser localStorage (DevTools > Storage > localStorage)
- Verify browser allows localStorage
- Check browser console for errors
- Try clearing cookies and localStorage

---

## 🔄 Authentication Flow

```
User Registration:
  Register Form → Backend API → Create User → Generate Tokens → Store in localStorage

User Login:
  Login Form → Backend API → Verify Credentials → Generate Tokens → Store in localStorage

Protected API Call:
  Frontend Service → HTTP Interceptor → Add JWT Token → Backend API → Verify Token → Return Data

User Logout:
  Click Logout → Clear localStorage → Redirect to Login → API Blacklist Token

401 Unauthorized:
  API Returns 401 → Interceptor Logs Out → Redirect to Login → User Logs In Again
```

---

## 📊 User Model Fields

```
User
├── id (Primary Key)
├── username (unique, required)
├── email (unique, required)
├── first_name
├── last_name
├── password (hashed)
├── role (admin/user, default: user)
├── profile_picture (optional)
├── bio (optional)
├── phone (optional)
├── location (optional)
├── is_active (default: true)
├── is_staff (default: false)
├── is_superuser (default: false)
├── date_joined (auto)
├── last_login (auto)
└── groups / user_permissions (inherited)
```

---

## 🛠️ Common Tasks

### Create Admin User
```bash
python manage.py createsuperuser
# Enter: username, email, password
```

### Create Standard User (Django Shell)
```bash
python manage.py shell
from apps.accounts.models import User
User.objects.create_user(
    email='user@weather.local',
    username='username',
    password='password',
    first_name='John',
    last_name='Doe'
)
exit()
```

### Reset Database
```bash
# Delete database file
rm db.sqlite3

# Create new database
python manage.py migrate

# Create admin user
python manage.py createsuperuser
```

### Update Frontend Environment
Edit `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
  appName: 'Online Weather Monitoring System',
};
```

### Add New Route Protection
Edit `frontend/src/app/app-routing-module.ts`:
```typescript
{
  path: 'protected-page',
  component: ProtectedComponent,
  canActivate: [AuthGuard]  // Add this
}
```

---

## 📞 Support Resources

### Django REST Framework
- Docs: https://www.django-rest-framework.org/
- JWT: https://django-rest-framework-simplejwt.readthedocs.io/

### Angular
- Docs: https://angular.io/docs
- HttpClient: https://angular.io/guide/http
- Guards: https://angular.io/guide/router#preventing-unauthorized-access

### JWT
- Info: https://jwt.io/
- Learn: https://jwt.io/introduction

### Python
- Virtual Env: https://docs.python.org/3/tutorial/venv.html
- pip: https://pip.pypa.io/

### Node/npm
- npm: https://www.npmjs.com/
- Node: https://nodejs.org/

---

## ✅ Verification Checklist

Before considering Phase 2 complete:

- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] Both servers start successfully
- [ ] Can register new user
- [ ] Can login with registered credentials
- [ ] Tokens stored in localStorage
- [ ] User visible in Django admin
- [ ] All protected routes work
- [ ] All public routes work
- [ ] Logout clears tokens
- [ ] Unauthorized redirects to login
- [ ] No console errors
- [ ] Navbar shows username
- [ ] No CORS errors

---

## 🎯 Next Steps

1. **Run Both Servers**: Follow [QUICK_START.md](QUICK_START.md)
2. **Test Authentication**: Follow [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
3. **Review Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Refer to API Docs**: See [PHASE_2_AUTH.md](PHASE_2_AUTH.md)
5. **Plan Phase 3**: Weather API implementation

---

## 📌 Important Notes

### Development vs Production
- Current setup is **development-only**
- Use DEBUG=True in development
- Switch to DEBUG=False for production
- Use PostgreSQL in production (currently SQLite)
- Use environment variables for secrets

### Security Notes
- Never commit `.env` file with real secrets
- Always use HTTPS in production
- Use secure cookies (httpOnly) in production
- Implement email verification
- Add rate limiting on endpoints
- Implement refresh token rotation

### Database Notes
- SQLite used for development (single file: `db.sqlite3`)
- PostgreSQL recommended for production
- Migrations tracked in version control
- Always backup database before migrations

---

## 📝 File Locations Quick Reference

```
Backend Auth:
  models: backend/apps/accounts/models.py
  serializers: backend/apps/accounts/serializers.py
  views: backend/apps/accounts/views.py
  urls: backend/apps/accounts/urls.py
  permissions: backend/apps/accounts/permissions.py

Frontend Auth:
  service: frontend/src/core/services/auth.service.ts
  interceptor: frontend/src/core/interceptors/auth.interceptor.ts
  guards: frontend/src/core/guards/auth.guard.ts
  login: frontend/src/features/auth/login/
  register: frontend/src/features/auth/register/

Configuration:
  Django: backend/config/settings/base.py
  Angular: frontend/src/app/app-module.ts
  Routes: frontend/src/app/app-routing-module.ts
  Environment: frontend/src/environments/environment.ts

Documentation:
  Setup: QUICK_START.md
  API: PHASE_2_AUTH.md
  Testing: TESTING_CHECKLIST.md
  Architecture: ARCHITECTURE.md
  Complete: PHASE_2_COMPLETION.md
```

---

**Phase 2: User Authentication** ✅ COMPLETE
**Ready for**: Testing, Integration Testing, Production Deployment
**Next Phase**: Phase 3 - Weather API Implementation

---

*For detailed information, refer to the individual documentation files linked above.*
