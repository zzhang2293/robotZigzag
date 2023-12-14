set -e

black . --check --verbose --diff --color
flake8 --max-line-length=88 --exclude=venv .
