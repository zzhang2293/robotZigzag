wait-for-it db:3306 -t 60
python3 manage.py migrate
python3 manage.py collectstatic --no-input
export DJANGO_SETTINGS_MODULE=zigzag_backend.settings
daphne zigzag_backend.asgi:application --bind 0.0.0.0
