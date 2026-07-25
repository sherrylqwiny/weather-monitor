# Architecture Overview - Online Weather Monitoring System

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular 21)                         │
│  http://localhost:4200                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Components Layer                                            │   │
│  │  ├── Dashboard (shows weather data)                         │   │
│  │  ├── Weather Pages (view/search weather)                    │   │
│  │  ├── Alerts (manage alerts)                                │   │
│  │  ├── Favorites (manage favorite locations)                 │   │
│  │  ├── Admin (admin dashboard)                               │   │
│  │  └── Auth Pages (login/register/forgot-password)           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Services Layer                                              │   │
│  │  ├── AuthService (JWT tokens, user state management)        │   │
│  │  ├── WeatherService (API calls)                             │   │
│  │  ├── AlertService (alert management)                        │   │
│  │  └── FavoriteService (favorite management)                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HTTP Layer                                                  │   │
│  │  ├── AuthInterceptor (automatically adds JWT token)          │   │
│  │  └── HttpClient (makes API requests)                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Guards Layer                                                │   │
│  │  ├── AuthGuard (requires login)                              │   │
│  │  ├── AdminGuard (requires admin role)                        │   │
│  │  └── PublicGuard (prevents auth users from login/register)   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │ HTTP/REST
                                    │ API Calls
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND (Django REST)                          │
│  http://localhost:8000                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  API Endpoints                                               │   │
│  │  ├── /api/accounts/ (Authentication)                        │   │
│  │  │   ├── register/register/ (POST - register user)          │   │
│  │  │   ├── login/login/ (POST - authenticate)                 │   │
│  │  │   ├── logout/logout/ (POST - logout)                     │   │
│  │  │   ├── profile/me/ (GET - get profile)                    │   │
│  │  │   ├── profile/update_profile/ (PATCH - update)           │   │
│  │  │   ├── password-change/change_password/ (POST)            │   │
│  │  │   └── password-reset/* (password reset flow)             │   │
│  │  ├── /api/weather/ (Weather data)                           │   │
│  │  ├── /api/forecasts/ (Weather forecasts)                    │   │
│  │  ├── /api/alerts/ (Alert management)                        │   │
│  │  └── /api/favorites/ (Favorite locations)                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ViewSets Layer (APIView with Custom Actions)                │   │
│  │  ├── RegisterView (handles registration logic)               │   │
│  │  ├── LoginView (JWT token generation)                        │   │
│  │  ├── LogoutView (token blacklisting)                         │   │
│  │  ├── ProfileView (user profile management)                   │   │
│  │  ├── ChangePasswordView (password change)                    │   │
│  │  └── PasswordResetView (password reset flow)                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Serializers Layer (Request/Response Validation)             │   │
│  │  ├── UserSerializer (user data)                              │   │
│  │  ├── RegisterSerializer (validation + password confirmation) │   │
│  │  ├── LoginSerializer (email + password validation)           │   │
│  │  ├── ChangePasswordSerializer (old password verification)    │   │
│  │  └── UpdateProfileSerializer (profile field validation)      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Models Layer (Database Schema)                              │   │
│  │  ├── User (Custom AbstractUser with roles)                   │   │
│  │  └── UserProfile (legacy, kept for migrations)               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↑                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Authentication & Permissions                                │   │
│  │  ├── JWTAuthentication (token validation)                    │   │
│  │  ├── IsAdmin (admin only access)                             │   │
│  │  ├── IsAdminOrReadOnly (read all, write admin only)          │   │
│  │  └── IsOwnerOrAdmin (owner or admin access)                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │ SQL
                                    │ Queries
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE                                    │
│  SQLite (Development) / PostgreSQL (Production)                     │
├─────────────────────────────────────────────────────────────────────┤
│  Tables:                                                             │
│  ├── accounts_user (custom user table)                              │
│  ├── accounts_userprofile (legacy, kept for migration)              │
│  └── ... (other app tables for weather, alerts, etc.)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### Registration Flow

```
User                    Frontend                 Backend
  │                        │                        │
  │  Fill registration form│                        │
  ├───────────────────────>│                        │
  │                        │  POST /register/       │
  │                        │  {email, username,     │
  │                        │   password, name}      │
  │                        │──────────────────────>│
  │                        │                        │ Validate data
  │                        │                        │ Hash password
  │                        │                        │ Create user
  │                        │                        │ Generate JWT
  │                        │  200 OK                │
  │                        │  {user, tokens}        │
  │                        │<──────────────────────┤
  │  Redirect to dashboard │                        │
  │<───────────────────────┤                        │
  │                        │ Store tokens in        │
  │                        │ localStorage            │
  │                        │                        │
```

### Login Flow

```
User                    Frontend              Backend
  │                        │                      │
  │  Enter credentials      │                      │
  ├───────────────────────>│                      │
  │                        │ POST /login/          │
  │                        │ {email, password}     │
  │                        │─────────────────────>│
  │                        │                      │ Verify credentials
  │                        │                      │ Generate JWT tokens
  │                        │ 200 OK                │
  │                        │ {user, tokens}        │
  │                        │<─────────────────────┤
  │  Redirect to dashboard │                      │
  │<───────────────────────┤                      │
  │                        │ Save tokens to        │
  │                        │ localStorage           │
  │                        │                      │
```

### Protected API Call Flow

```
User/Frontend                 Interceptor        Backend
      │                            │                 │
      │ Make API call              │                 │
      │ GET /api/weather/          │                 │
      │────────────────────────────>│                 │
      │                            │ Add JWT token   │
      │                            │ Authorization: │
      │                            │ Bearer <token>  │
      │                            │────────────────>│
      │                            │                 │ Verify token
      │                            │                 │ Check user role
      │                            │                 │ Process request
      │                            │ 200 OK          │
      │                            │ {data}          │
      │                            │<────────────────┤
      │ Return data                │                 │
      │<────────────────────────────┤                 │
      │                            │                 │
```

### Logout Flow

```
User                    Frontend              Backend
  │                        │                      │
  │  Click logout           │                      │
  ├───────────────────────>│                      │
  │                        │ POST /logout/         │
  │                        │ {refresh_token}       │
  │                        │─────────────────────>│
  │                        │                      │ Blacklist token
  │                        │ 200 OK                │
  │                        │<─────────────────────┤
  │                        │ Clear localStorage    │
  │                        │ Clear userSubject     │
  │  Redirect to login      │                      │
  │<───────────────────────┤                      │
  │                        │                      │
```

---

## Data Models

### User Model

```
User (extends AbstractUser)
├── id (PK)
├── username (unique)
├── email (unique)
├── first_name
├── last_name
├── password (hashed)
├── role (choices: 'admin', 'user')
├── profile_picture (optional, ImageField)
├── bio (optional, TextField)
├── phone (optional, CharField)
├── location (optional, CharField)
├── is_active (default: True)
├── date_joined (auto)
└── ... (inherited from AbstractUser)
```

---

## Token Structure (JWT)

### Access Token
```
Header:
{
  "typ": "JWT",
  "alg": "HS256"
}

Payload:
{
  "token_type": "access",
  "exp": <timestamp 15 minutes from now>,
  "iat": <current timestamp>,
  "jti": <unique token id>,
  "user_id": <user id>
}

Signature:
HMACSHA256(secret_key)
```

### Refresh Token
```
Header:
{
  "typ": "JWT",
  "alg": "HS256"
}

Payload:
{
  "token_type": "refresh",
  "exp": <timestamp 7 days from now>,
  "iat": <current timestamp>,
  "jti": <unique token id>,
  "user_id": <user id>
}

Signature:
HMACSHA256(secret_key)
```

---

## Directory Structure

```
online-weather-monitoring-system/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   ├── models.py (User, UserProfile)
│   │   │   ├── serializers.py (8+ serializers)
│   │   │   ├── views.py (6+ ViewSets)
│   │   │   ├── urls.py (endpoint routing)
│   │   │   ├── permissions.py (custom permissions)
│   │   │   ├── admin.py (admin configuration)
│   │   │   └── ...
│   │   ├── weather/
│   │   ├── forecasts/
│   │   ├── alerts/
│   │   └── ...
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py (JWT, CORS, AUTH_USER_MODEL)
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py (main routing)
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── requirements.txt (Python dependencies)
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts (root component)
│   │   │   ├── app-module.ts (app config)
│   │   │   ├── app-routing-module.ts (routes + guards)
│   │   │   ├── core/
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts (JWT auth)
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts (token injection)
│   │   │   │   └── guards/
│   │   │   │       └── auth.guard.ts (route protection)
│   │   │   ├── shared/
│   │   │   │   └── components/
│   │   │   │       └── navbar/ (user menu)
│   │   │   └── features/
│   │   │       ├── auth/
│   │   │       │   ├── login/
│   │   │       │   └── register/
│   │   │       ├── dashboard/
│   │   │       ├── weather/
│   │   │       └── ...
│   │   ├── environments/
│   │   │   └── environment.ts (API base URL)
│   │   └── index.html
│   ├── package.json
│   └── angular.json
│
├── PHASE_2_AUTH.md (complete documentation)
├── PHASE_2_COMPLETION.md (completion summary)
├── QUICK_START.md (testing guide)
├── README.md
└── docker-compose.yml
```

---

## Configuration Summary

### Backend Settings
- **DEBUG**: True (development) / False (production)
- **ALLOWED_HOSTS**: localhost, 127.0.0.1
- **CORS_ALLOWED_ORIGINS**: http://localhost:4200
- **SECRET_KEY**: Django secret for signing
- **JWT_ALGORITHM**: HS256
- **JWT_ACCESS_TOKEN_LIFETIME**: 15 minutes
- **JWT_REFRESH_TOKEN_LIFETIME**: 7 days
- **TIMEZONE**: Africa/Nairobi
- **DATABASE**: SQLite (development) / PostgreSQL (production)

### Frontend Environment
- **apiBaseUrl**: http://localhost:8000/api
- **production**: false (development)
- **appName**: Online Weather Monitoring System

---

## Security Features

✅ JWT token-based authentication
✅ Password hashing with Django validators
✅ CORS configured for specific origin
✅ HTTP interceptor prevents token exposure
✅ 401 Unauthorized automatically logs out
✅ Role-based access control (admin/user)
✅ Custom permission classes
✅ Protected routes with guards
✅ Secure password reset flow (email stubbed)

---

## Technology Stack

### Backend
- Django 4.x
- Django REST Framework 3.x
- djangorestframework-simplejwt (JWT)
- django-cors-headers (CORS)
- Pillow (image handling)
- python-dotenv (environment variables)
- SQLite (dev) / PostgreSQL (production)

### Frontend
- Angular 21.x
- TypeScript 5.x
- RxJS 7.x (reactive programming)
- Angular Material (optional, can be added)
- Bootstrap/Tailwind (optional, can be added)

---

## Performance Considerations

- JWT tokens enable stateless authentication
- No database lookups needed for token validation
- Interceptor automatically handles token injection
- Route guards prevent unnecessary API calls
- BehaviorSubject provides efficient state management
- CORS reduces preflight requests (with proper setup)

---

## Next Phase: Weather API

The next phase will extend this architecture with:
- Weather data endpoints
- Integration with external weather APIs
- Weather alert system
- Favorite locations management
- Analytics and reporting

The authentication system provides the foundation for role-based access to these features.
