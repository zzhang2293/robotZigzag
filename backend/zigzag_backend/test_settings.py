from django.contrib.auth.hashers import BasePasswordHasher

from zigzag_backend.settings import *  # noqa: F403

# This keeps the formatter from thinking the import is unused
DEBUG = DEBUG  # noqa: F405

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

PASSWORD_HASHERS = ("zigzag_backend.test_settings.PlaintextPasswordHasher",)


class PlaintextPasswordHasher(BasePasswordHasher):
    """
    A custom password hasher that stores passwords in plaintext.
    """

    algorithm = "plaintext"

    def encode(self, password, salt):
        return f"{self.algorithm}${password}"

    def verify(self, password, encoded):
        return password == encoded.split("$", 1)[-1]
