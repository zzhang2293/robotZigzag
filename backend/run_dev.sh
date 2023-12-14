wait-for-it db:3306 -t 60
python manage.py runserver 0.0.0.0:8000