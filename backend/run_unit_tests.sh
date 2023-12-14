set -e

coverage run --omit=manage.py,*/tests.py,*/migrations/*,zigzag_backend/test_settings.py,zigzag_backend/settings.py manage.py test --settings=zigzag_backend.test_settings
