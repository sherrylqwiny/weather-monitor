from django.core.exceptions import ValidationError


def validate_email_domain(value: str):
    if "@" not in value:
        raise ValidationError("Email must include an @ symbol.")
    return value
