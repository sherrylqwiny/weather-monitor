import os
import unittest

from config.settings import base


class SettingsHelpersTests(unittest.TestCase):
    def test_get_database_config_falls_back_to_sqlite_when_url_missing(self):
        with unittest.mock.patch.dict(os.environ, {"DATABASE_URL": "   "}, clear=False):
            config = base.get_database_config()

        self.assertEqual(config["ENGINE"], "django.db.backends.sqlite3")
        self.assertTrue(str(config["NAME"]).endswith("db.sqlite3"))

    def test_get_database_config_parses_postgres_url(self):
        with unittest.mock.patch.dict(
            os.environ,
            {"DATABASE_URL": "postgresql://user:pass@localhost:5432/weather"},
            clear=False,
        ):
            config = base.get_database_config()

        self.assertEqual(config["ENGINE"], "django.db.backends.postgresql")
        self.assertEqual(config["NAME"], "weather")

    def test_get_default_settings_module_prefers_production_on_railway(self):
        with unittest.mock.patch.dict(os.environ, {"RAILWAY_ENVIRONMENT": "production"}, clear=False):
            self.assertEqual(base.get_default_settings_module(), "config.settings.production")

        with unittest.mock.patch.dict(os.environ, {"ENVIRONMENT": "production"}, clear=False):
            self.assertEqual(base.get_default_settings_module(), "config.settings.production")

        with unittest.mock.patch.dict(os.environ, {"DJANGO_SETTINGS_MODULE": "custom.settings"}, clear=False):
            self.assertEqual(base.get_default_settings_module(), "custom.settings")


if __name__ == "__main__":
    unittest.main()
