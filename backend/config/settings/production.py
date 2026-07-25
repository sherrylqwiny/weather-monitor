from .base import *

# ------------------------------------------------------------------------------
# Production Settings
# ------------------------------------------------------------------------------

DEBUG = False

railway_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN", "").strip()
allowed_hosts = get_env_list(
    "ALLOWED_HOSTS",
    ".up.railway.app",
)

if railway_domain:
    allowed_hosts.append(railway_domain)

ALLOWED_HOSTS = allowed_hosts

# ------------------------------------------------------------------------------
# Database
# Uses DATABASE_URL from Railway
# (Already configured in base.py)
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = False

cros_origins = get_env_list("CORS_ALLOWED_ORIGINS", "")
if railway_domain:
    cros_origins.append(f"https://{railway_domain}")

CORS_ALLOWED_ORIGINS = list(dict.fromkeys(cros_origins))

CORS_ALLOW_CREDENTIALS = True

# ------------------------------------------------------------------------------
# CSRF
# ------------------------------------------------------------------------------

csrf_origins = get_env_list("CSRF_TRUSTED_ORIGINS", "")
if railway_domain:
    csrf_origins.append(f"https://{railway_domain}")

CSRF_TRUSTED_ORIGINS = list(dict.fromkeys(csrf_origins))

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

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# ------------------------------------------------------------------------------
# Celery
# ------------------------------------------------------------------------------

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL") or os.getenv("REDIS_URL") or "memory://"
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND") or os.getenv("REDIS_URL") or "memory://"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60

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
