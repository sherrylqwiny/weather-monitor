from .base import *

# ------------------------------------------------------------------------------
# Production Settings
# ------------------------------------------------------------------------------

DEBUG = False

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        ".up.railway.app"
    ).split(",")
    if host.strip()
]

# ------------------------------------------------------------------------------
# Database
# Uses DATABASE_URL from Railway
# (Already configured in base.py)
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True

# ------------------------------------------------------------------------------
# CSRF
# ------------------------------------------------------------------------------

CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

# ------------------------------------------------------------------------------
# Security
# ------------------------------------------------------------------------------

SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

USE_X_FORWARDED_HOST = True

SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_TYPE_NOSNIFF = True

X_FRAME_OPTIONS = "DENY"

SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# ------------------------------------------------------------------------------
# Static Files
# ------------------------------------------------------------------------------

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ------------------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
