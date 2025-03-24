import json
from django.http import JsonResponse
import configparser
from viewer.models import TurnedOffDay
from datetime import datetime, timedelta

config = configparser.ConfigParser()
config.read('config.ini')

def save_settings(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        days_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        days_ahead = json_data.get('days_ahead')
        selected_days = json_data.get('selected_days')
        files_per_page = json_data.get('files_per_page')

        if files_per_page:
            config.set('settings', 'reservations_per_page', files_per_page)
        if days_ahead:
            config.set('settings', 'days_ahead', days_ahead)
        if selected_days:
            config.set('settings', 'working_days', str(selected_days))

        for day in days_of_week:
            time_from_key = f'time_from_{day}'
            time_to_key = f'time_to_{day}'
            if json_data.get(time_from_key):
                config.set('settings', f'{day}_starting_hour', json_data.get(time_from_key))
            if json_data.get(time_to_key):
                config.set('settings', f'{day}_ending_hour', json_data.get(time_to_key))

        with open('config.ini', 'w') as config_file:
            config.write(config_file)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def add_turned_off_day(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)

        date_from_str = json_data.get('date_from')
        date_to_str = json_data.get('date_to')
        whole_day_bool = bool(json_data.get('whole_day'))
        time_from = json_data.get('time_from') if not whole_day_bool else None
        time_to = json_data.get('time_to') if not whole_day_bool else None

        # Convert string dates to datetime objects
        date_from = datetime.strptime(date_from_str, '%Y-%m-%d').date()
        date_to = datetime.strptime(date_to_str, '%Y-%m-%d').date()

        # Iterate through the date range
        current_date = date_from
        while current_date <= date_to:
            TurnedOffDay.objects.create(
                date=current_date,
                whole_day=whole_day_bool,
                time_from=time_from,
                time_to=time_to
            )
            current_date += timedelta(days=1)

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def delete_turned_off_day(request):
    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        try:
            turned_off_day = TurnedOffDay.objects.get(id=json_data.get('turnedOffDayId'))
            turned_off_day.delete()
            return JsonResponse({'status': 'success', 'message': 'Obmedzenie vymazané'})
        except TurnedOffDay.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Obmedzenie sa nenašlo.'})
    return JsonResponse({'status': 'error'})

def delete_turned_off_days(request):
    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        for day_id in json_data.get('ids'):
            try:
                turned_off_day = TurnedOffDay.objects.get(id=day_id)
                turned_off_day.delete()
            except TurnedOffDay.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Obmedzenie sa nenašlo.'})
        return JsonResponse({'status': 'success', 'message': 'Obmedzenia vymazané'})
    return JsonResponse({'status': 'error'})