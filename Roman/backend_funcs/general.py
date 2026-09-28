from functools import wraps
from django.utils.translation import activate
from django.http import JsonResponse


def superuser_required_api(view_func):
    """Vráti 403 pre neprihlásených alebo ne-admin používateľov (pre JSON API endpointy)."""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not (request.user.is_authenticated and request.user.is_superuser):
            return JsonResponse({'status': 'error', 'message': 'Prístup zamietnutý.'}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper


def switch_language(request, language_code):
    if request.method == 'POST':
        activate(language_code)
        request.session['django_language'] = language_code
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"})