from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("weather", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="currentweather",
            name="air_quality_index",
            field=models.IntegerField(
                blank=True,
                help_text="OpenWeather AQI from 1 to 5",
                null=True,
            ),
        ),
    ]
