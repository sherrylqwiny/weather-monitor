# Phase 2: User Authentication

## Overview

Phase 2 implements secure user authentication with JWT tokens, custom User model with roles, and full API integration with the frontend.

---

## Backend Implementation

### 1. Custom User Model

**File**: `backend/apps/accounts/models.py`

Custom User model extending Django's AbstractUser with:
- Email-based authentication
- Role-based access control (Admin / Standard User)
- Profile picture support
- Additional user fields (bio, phone, location)

```python
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('user', 'Standard User'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
```

### 2. JWT Authentication

**Configuration**: `backend/config/settings/base.py`

- Access token lifetime: 15 minutes
- Refresh token lifetime: 7 days
- Token rotation enabled
- Signed with Django SECRET_KEY

### 3. API Endpoints

**Base URL**: `http://localhost:8000/api/accounts/`

#### Registration
```
POST /register/register/
{
  "email": "user@example.com",
  "username": "username",
  "password": "secure_password",
  "password_confirm": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "role": "user"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login
```
POST /login/login/
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### Logout
```
POST /logout/logout/
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Profile
```
GET /profile/me/
Authorization: Bearer <access_token>
```

#### Update Profile
```
PATCH /profile/update_profile/
Authorization: Bearer <access_token>
{
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Weather enthusiast",
  "phone": "+254700000000",
  "location": "Nairobi, Kenya"
}
```

#### Change Password
```
POST /password-change/change_password/
Authorization: Bearer <access_token>
{
  "old_password": "current_password",
  "new_password": "new_password",
  "new_password_confirm": "new_password"
}
```

#### Request Password Reset
```
POST /password-reset/request_reset/
{
  "email": "user@example.com"
}
```

#### Confirm Password Reset
```
POST /password-reset/confirm_reset/
{
  "token": "reset_token",
  "new_password": "new_password",
  "new_password_confirm": "new_password"
}
```

### 4. Role-Based Permissions

**File**: `backend/apps/accounts/permissions.py`

Available permission classes:
- `IsAdmin`: Only administrators
- `IsAdminOrReadOnly`: Read-only for all, write for admins
- `IsStandardUser`: Only standard users
- `IsOwnerOrAdmin`: Object owner or admin

### 5. Admin Panel

Access at: `http://localhost:8000/admin/`

Users can:
- Create user accounts
- Assign roles
- Manage permissions
- View user statistics

---

## Frontend Integration

### 1. Authentication Service

**File**: `frontend/src/core/services/auth.service.ts`

Provides methods:
- `register(email, username, password, firstName?, lastName?): Observable<AuthResponse>`
- `login(email, password): Observable<AuthResponse>`
- `logout(): void`
- `getProfile(): Observable<User>`
- `updateProfile(updates): Observable<User>`
- `changePassword(oldPassword, newPassword): Observable<any>`
- `requestPasswordReset(email): Observable<any>`
- `confirmPasswordReset(token, newPassword): Observable<any>`
- `isAuthenticated(): boolean`
- `isAdmin(): boolean`
- `getCurrentUser(): User | null`

### 2. HTTP Interceptor

**File**: `frontend/src/core/interceptors/auth.interceptor.ts`

Automatically:
- Adds JWT token to all requests
- Handles 401 responses (logs out expired sessions)

### 3. Route Guards

**File**: `frontend/src/core/guards/auth.guard.ts`

- `AuthGuard`: Requires authentication
- `AdminGuard`: Requires admin role
- `PublicGuard`: Blocks authenticated users (login/register pages)

### 4. Login Component

**File**: `frontend/src/features/auth/login/login.component.ts`

- Email and password fields
- Error message display
- Loading state
- Redirect to dashboard on success
- Link to registration and forgot password

### 5. Register Component

**File**: `frontend/src/features/auth/register/register.component.ts`

- Email, username, full name fields
- Password validation
- Error handling
- Redirect to dashboard on success
- Link to login

### 6. Navbar Integration

**File**: `frontend/src/app/shared/components/navbar/navbar.component.ts`

- Displays current user
- Dropdown menu with Profile and Logout options
- Uses AuthService to manage user state

---

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create migrations (if needed):
```bash
python manage.py makemigrations
```

3. Apply migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run the server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
ng serve
```

3. Access the app at `http://localhost:4200`

---

## Testing the Flow

### 1. Register New User
1. Navigate to `http://localhost:4200/register`
2. Enter email, username, password, and full name
3. Click Register
4. Should redirect to dashboard

### 2. Login
1. Navigate to `http://localhost:4200/login`
2. Enter email and password
3. Click Sign in
4. Should redirect to dashboard

### 3. View Profile
1. Click user icon in top-right navbar
2. Select "Profile"
3. View current user information

### 4. Update Profile
1. On profile page, update fields
2. Save changes
3. Changes reflected in navbar

### 5. Logout
1. Click user icon in top-right navbar
2. Select "Logout"
3. Should redirect to login page

---

## JWT Token Storage

Tokens are stored in browser's localStorage:
- `access_token`: Short-lived (15 minutes)
- `refresh_token`: Long-lived (7 days)

**Note**: In production, consider using httpOnly cookies for better security.

---

## Security Considerations

- ✅ Passwords validated with Django's built-in validators
- ✅ JWT tokens signed with SECRET_KEY
- ✅ CORS configured for frontend origin
- ✅ HTTP interceptor automatically attaches tokens
- ✅ 401 responses trigger logout

**To-do for Production**:
- Implement email verification
- Add rate limiting
- Use httpOnly cookies for tokens
- Implement refresh token rotation
- Add password reset email flow
- Implement account lockout after failed attempts

---

## Environment Variables

### Backend `.env`
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,127.0.0.1:4200
```

### Frontend `environment.ts`
```typescript
apiBaseUrl: 'http://localhost:8000/api'
```

---

## Troubleshooting

### "Invalid email or password"
- Ensure email and password are correct
- Check database for user existence

### "CORS error"
- Verify CORS is enabled in backend settings
- Check frontend URL is in ALLOWED_HOSTS

### "Token expired"
- Interceptor will logout and redirect to login
- Use refresh token to get new access token (to be implemented)

### "Module not found" errors
- Run `npm install` in frontend
- Run `pip install -r requirements.txt` in backend

---

## Next Steps

- Phase 3: Implement weather data API
- Phase 4: Connect frontend to weather endpoints
- Phase 5: Add alert management system
