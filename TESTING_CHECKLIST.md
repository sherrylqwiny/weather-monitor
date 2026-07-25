# Authentication Testing Checklist - Phase 2

## Pre-Testing Setup

### Backend Preparation
- [ ] Navigate to `backend` directory
- [ ] Activate Python virtual environment
  - Windows: `venv\Scripts\activate`
  - macOS/Linux: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser account with `python manage.py createsuperuser`
- [ ] Create test user in Django shell (optional)
- [ ] Start backend server: `python manage.py runserver`
- [ ] Verify backend running: `http://localhost:8000` shows Django page

### Frontend Preparation
- [ ] Open new terminal/command prompt
- [ ] Navigate to `frontend` directory
- [ ] Install dependencies: `npm install` (if not already done)
- [ ] Start Angular dev server: `ng serve`
- [ ] Verify frontend running: `http://localhost:4200` shows app

### Database Check
- [ ] Verify `db.sqlite3` exists in `backend` directory
- [ ] Run Django shell: `python manage.py shell`
  - `from apps.accounts.models import User`
  - `User.objects.all().count()` should be 1 (superuser)

---

## Backend API Testing

### 1. Registration Endpoint

**Endpoint**: `POST http://localhost:8000/api/accounts/register/register/`

#### Test Case 1a: Valid Registration
```bash
curl -X POST http://localhost:8000/api/accounts/register/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@weather.local",
    "username": "testuser",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Expected Response (200 OK)**:
```json
{
  "user": {
    "id": 2,
    "email": "testuser@weather.local",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

- [ ] Returns 200 status code
- [ ] User object contains correct fields
- [ ] Tokens are JWT format (3 parts separated by dots)
- [ ] Role defaults to "user"

#### Test Case 1b: Invalid Email (duplicate)
Try registering with existing email
- [ ] Returns 400 Bad Request
- [ ] Error message indicates email already exists

#### Test Case 1c: Password Mismatch
Register with mismatched password/password_confirm
- [ ] Returns 400 Bad Request
- [ ] Error message about password confirmation

#### Test Case 1d: Short Password
Register with password less than Django's minimum
- [ ] Returns 400 Bad Request
- [ ] Error message about password requirements

### 2. Login Endpoint

**Endpoint**: `POST http://localhost:8000/api/accounts/login/login/`

#### Test Case 2a: Valid Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@weather.local",
    "password": "testpass123"
  }'
```

**Expected Response (200 OK)**:
```json
{
  "user": {
    "id": 2,
    "email": "testuser@weather.local",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "role": "user"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

- [ ] Returns 200 status code
- [ ] Returns user object
- [ ] Returns valid JWT tokens

#### Test Case 2b: Invalid Email
Login with non-existent email
- [ ] Returns 401 Unauthorized
- [ ] Error message: "Invalid email or password"

#### Test Case 2c: Invalid Password
Login with correct email but wrong password
- [ ] Returns 401 Unauthorized
- [ ] Error message: "Invalid email or password"

### 3. Profile Endpoint

**Endpoint**: `GET http://localhost:8000/api/accounts/profile/me/`

#### Test Case 3a: Get Profile with Valid Token
```bash
curl -X GET http://localhost:8000/api/accounts/profile/me/ \
  -H "Authorization: Bearer <access_token_from_login>"
```

**Expected Response (200 OK)**:
```json
{
  "id": 2,
  "email": "testuser@weather.local",
  "username": "testuser",
  "first_name": "Test",
  "last_name": "User",
  "role": "user",
  "bio": null,
  "phone": null,
  "location": null
}
```

- [ ] Returns 200 status code
- [ ] Returns current user data
- [ ] All fields present

#### Test Case 3b: Get Profile without Token
Call endpoint without Authorization header
- [ ] Returns 401 Unauthorized

#### Test Case 3c: Get Profile with Invalid Token
Use corrupted or expired token
- [ ] Returns 401 Unauthorized

### 4. Update Profile Endpoint

**Endpoint**: `PATCH http://localhost:8000/api/accounts/profile/update_profile/`

#### Test Case 4a: Update Profile with Valid Token
```bash
curl -X PATCH http://localhost:8000/api/accounts/profile/update_profile/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "first_name": "Updated",
    "bio": "Weather enthusiast",
    "phone": "+254700000000",
    "location": "Nairobi, Kenya"
  }'
```

**Expected Response (200 OK)**:
```json
{
  "id": 2,
  "email": "testuser@weather.local",
  "username": "testuser",
  "first_name": "Updated",
  "last_name": "User",
  "role": "user",
  "bio": "Weather enthusiast",
  "phone": "+254700000000",
  "location": "Nairobi, Kenya"
}
```

- [ ] Returns 200 status code
- [ ] Updates reflected in response

#### Test Case 4b: Update without Token
- [ ] Returns 401 Unauthorized

### 5. Change Password Endpoint

**Endpoint**: `POST http://localhost:8000/api/accounts/password-change/change_password/`

#### Test Case 5a: Change Password with Valid Old Password
```bash
curl -X POST http://localhost:8000/api/accounts/password-change/change_password/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "old_password": "testpass123",
    "new_password": "newpass456",
    "new_password_confirm": "newpass456"
  }'
```

**Expected Response (200 OK)**:
```json
{"message": "Password changed successfully"}
```

- [ ] Returns 200 status code
- [ ] Can now login with new password

#### Test Case 5b: Invalid Old Password
Use wrong old password
- [ ] Returns 400 Bad Request
- [ ] Error message: "Old password is incorrect"

#### Test Case 5c: Password Mismatch
new_password != new_password_confirm
- [ ] Returns 400 Bad Request

### 6. Logout Endpoint

**Endpoint**: `POST http://localhost:8000/api/accounts/logout/logout/`

#### Test Case 6a: Logout with Valid Token
```bash
curl -X POST http://localhost:8000/api/accounts/logout/logout/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"refresh": "<refresh_token>"}'
```

**Expected Response (200 OK)**:
```json
{"message": "Successfully logged out"}
```

- [ ] Returns 200 status code
- [ ] Token is blacklisted (can't be used again)

#### Test Case 6b: Logout without Token
- [ ] Returns 401 Unauthorized

### 7. Password Reset Endpoints

#### Test Case 7a: Request Password Reset
```bash
curl -X POST http://localhost:8000/api/accounts/password-reset/request_reset/ \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@weather.local"}'
```

- [ ] Returns 200 status code
- [ ] Email integration stubbed (check backend console)

#### Test Case 7b: Confirm Password Reset
```bash
curl -X POST http://localhost:8000/api/accounts/password-reset/confirm_reset/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token",
    "new_password": "resetpass789",
    "new_password_confirm": "resetpass789"
  }'
```

- [ ] Returns 400 (stub implementation)

---

## Frontend UI Testing

### 1. Registration Page Test

**URL**: `http://localhost:4200/register`

#### Test Case 1a: Successful Registration
- [ ] Page loads with registration form
- [ ] Fields present: Email, Username, Full Name, Password, Confirm Password
- [ ] Fill with: 
  - Email: `frontend@weather.local`
  - Username: `frontenduser`
  - Full Name: `Frontend User`
  - Password: `frontendpass123`
  - Confirm Password: `frontendpass123`
- [ ] Click "Sign up" button
- [ ] Loading indicator appears
- [ ] Redirects to `/dashboard` on success
- [ ] No error messages displayed
- [ ] Check browser localStorage (DevTools > Application > Storage > localStorage)
  - [ ] `access_token` is set
  - [ ] `refresh_token` is set

#### Test Case 1b: Form Validation
- [ ] Leave email empty and try submit
  - [ ] Error message displayed
  - [ ] Form not submitted
- [ ] Enter mismatched passwords
  - [ ] Error message displayed
  - [ ] Form not submitted
- [ ] Enter email that already exists
  - [ ] Error message displayed after submit

#### Test Case 1c: Link to Login
- [ ] Click "Already have an account? Sign in" link
- [ ] Redirects to `/login` page

### 2. Login Page Test

**URL**: `http://localhost:4200/login`

#### Test Case 2a: Successful Login
- [ ] Page loads with login form
- [ ] Fields present: Email, Password
- [ ] Fill with:
  - Email: `frontend@weather.local`
  - Password: `frontendpass123`
- [ ] Click "Sign in" button
- [ ] Loading indicator appears
- [ ] Redirects to `/dashboard` on success
- [ ] No error messages displayed
- [ ] localStorage has tokens

#### Test Case 2b: Invalid Credentials
- [ ] Enter non-existent email
- [ ] Click "Sign in"
- [ ] Error message displayed: "Invalid email or password"
- [ ] Page does NOT redirect

#### Test Case 2c: Form Fields Required
- [ ] Try to submit with empty email
  - [ ] Form validation shows error
- [ ] Try to submit with empty password
  - [ ] Form validation shows error

#### Test Case 2d: Link to Registration
- [ ] Click "Don't have an account? Sign up" link
- [ ] Redirects to `/register` page

#### Test Case 2e: Link to Forgot Password
- [ ] Click "Forgot password?" link
- [ ] Redirects to `/forgot-password` page

### 3. Dashboard Access Test

#### Test Case 3a: Authenticated User Access
- [ ] Login successfully
- [ ] Dashboard page loads
- [ ] Weather cards displayed (placeholder data)
- [ ] User menu in navbar shows logged-in user name

#### Test Case 3b: Unauthenticated Access
- [ ] Open browser console and clear localStorage
- [ ] Navigate to `http://localhost:4200/dashboard`
- [ ] Redirects to `/login` page (AuthGuard protection)

#### Test Case 3c: Direct URL Navigation
- [ ] Try accessing `http://localhost:4200/dashboard` while logged in
- [ ] Dashboard loads successfully

### 4. Navbar User Menu Test

#### Test Case 4a: User Menu Display
- [ ] After login, navbar shows user name/first name
- [ ] User icon clickable
- [ ] Click user name/icon
- [ ] Dropdown menu appears with "Profile" and "Logout" options

#### Test Case 4b: Profile Navigation
- [ ] Click "Profile" in dropdown
- [ ] Navigates to `/profile` page
- [ ] Profile page loads (component exists, may be basic)
- [ ] Dropdown menu closes

#### Test Case 4c: Logout Functionality
- [ ] Click "Logout" in dropdown
- [ ] API logout call made (check Network tab)
- [ ] localStorage cleared
- [ ] Redirects to `/login` page
- [ ] Navbar no longer shows user menu

### 5. Route Guard Tests

#### Test Case 5a: AuthGuard Protection
- [ ] Clear localStorage (logout)
- [ ] Try to access `/dashboard`
  - [ ] Redirects to `/login`
- [ ] Try to access `/weather`
  - [ ] Redirects to `/login`
- [ ] Try to access `/alerts`
  - [ ] Redirects to `/login`

#### Test Case 5b: PublicGuard Protection
- [ ] Login successfully
- [ ] Try to access `/login`
  - [ ] Redirects to `/dashboard`
- [ ] Try to access `/register`
  - [ ] Redirects to `/dashboard`

#### Test Case 5c: AdminGuard Protection
- [ ] Login as standard user
- [ ] Try to access `/admin` (if route exists)
  - [ ] Should be blocked or show permission denied
- [ ] Login as admin
- [ ] Should be able to access `/admin` routes

### 6. HTTP Interceptor Test

#### Test Case 6a: Token Injection
- [ ] Login and navigate to any protected page
- [ ] Open DevTools Network tab
- [ ] Make any API request (hover on data, click profile button, etc.)
- [ ] Check request headers
  - [ ] `Authorization: Bearer <token>` header present

#### Test Case 6b: Unauthorized Response Handling
- [ ] Wait 15+ minutes (access token expires)
- [ ] Or manually remove access token from localStorage
- [ ] Try to access protected resource
- [ ] Browser logs out (future: refresh token flow)
- [ ] Redirects to login

### 7. Responsive Design Test

- [ ] Login/Register pages responsive on mobile (DevTools device emulation)
- [ ] Navbar works on mobile
- [ ] Forms usable on small screens
- [ ] Dropdown menu works on mobile

---

## Integration Testing

### 1. End-to-End Registration Flow
- [ ] Go to `http://localhost:4200/register`
- [ ] Register new user with unique email
- [ ] Tokens saved to localStorage
- [ ] Redirected to dashboard
- [ ] User visible in Django admin: `http://localhost:8000/admin/`

### 2. End-to-End Login Flow
- [ ] Logout
- [ ] Go to `/login`
- [ ] Login with registered credentials
- [ ] Tokens updated in localStorage
- [ ] Dashboard accessible

### 3. End-to-End Profile Update Flow
- [ ] Login
- [ ] Navigate to profile page
- [ ] Update profile information
- [ ] Changes saved in database
- [ ] Navbar reflects changes (if profile name updated)

### 4. CORS Verification
- [ ] Open DevTools Network tab
- [ ] Perform login
- [ ] Check response headers for CORS headers:
  - [ ] `Access-Control-Allow-Origin: http://localhost:4200`

### 5. Token Storage Verification
- [ ] Login
- [ ] DevTools > Application > Storage > localStorage
- [ ] Verify `access_token` exists
- [ ] Verify `refresh_token` exists
- [ ] Tokens are valid JWT format (3 parts)
- [ ] Logout
- [ ] Verify both tokens cleared

---

## Error Handling Tests

### Backend Error Scenarios
- [ ] Missing required fields in request
  - [ ] Returns 400 Bad Request with field errors
- [ ] Invalid JSON in request
  - [ ] Returns 400 Bad Request
- [ ] Database constraint violation (duplicate email)
  - [ ] Returns 400 Bad Request with error message
- [ ] Server error (500)
  - [ ] Error logged in backend console
  - [ ] User sees generic error message

### Frontend Error Scenarios
- [ ] Network error (backend down)
  - [ ] Error message displayed in UI
  - [ ] Form remains accessible for retry
- [ ] API returns error
  - [ ] Error message displayed
  - [ ] User can try again
- [ ] Invalid token
  - [ ] User logged out
  - [ ] Redirected to login

---

## Performance Tests

- [ ] Login response time < 500ms
- [ ] Registration response time < 1s
- [ ] Profile fetch response time < 300ms
- [ ] No console errors or warnings
- [ ] No memory leaks when toggling user menu multiple times

---

## Browser Compatibility

- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Edge latest
- [ ] Safari (if on macOS)
- [ ] Mobile browsers (Chrome on Android, Safari on iOS)

---

## Security Tests

- [ ] Password not visible in plain text in localStorage
- [ ] Password not logged to console
- [ ] Tokens not exposed in URL bar
- [ ] CORS prevents requests from other origins
- [ ] 401 responses properly handled
- [ ] Token expiry handled gracefully
- [ ] No sensitive data in error messages

---

## Summary Checklist

**Backend**: [ ] All API endpoints working
**Frontend**: [ ] All UI pages accessible
**Integration**: [ ] Frontend-Backend communication working
**Errors**: [ ] Error handling works properly
**Security**: [ ] Tokens managed securely
**Performance**: [ ] Response times acceptable

---

## Sign-Off

- [ ] All tests passed
- [ ] No critical bugs found
- [ ] User authentication flow complete
- [ ] Ready for Phase 3 (Weather API)

Date Tested: _______________
Tester Name: _______________
Notes: _____________________

---

## Troubleshooting Guide

If tests fail, refer to:
- [QUICK_START.md](QUICK_START.md) - Setup instructions
- [PHASE_2_AUTH.md](PHASE_2_AUTH.md) - API documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System overview
