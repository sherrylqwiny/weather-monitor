web: if [ -d backend ]; then cd backend; fi; gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
worker: if [ -d backend ]; then cd backend; fi; celery -A config worker --loglevel=info
beat: if [ -d backend ]; then cd backend; fi; celery -A config beat --loglevel=info
