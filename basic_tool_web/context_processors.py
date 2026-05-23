from django.conf import settings


def ga_id(request):
    return {'GA_MEASUREMENT_ID': settings.GA_MEASUREMENT_ID}
