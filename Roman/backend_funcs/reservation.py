import logging
from django.conf import settings
from django.core import signing
from django.http import JsonResponse
from viewer.models import Reservation, TurnedOffDay, AlreadyMadeReservation
import json
from datetime import datetime, timedelta
from django.utils.translation import gettext_lazy as _
import configparser
from django.core.mail import send_mail
from django.template.loader import render_to_string
from Roman.backend_funcs.general import superuser_required_api

config = configparser.ConfigParser()

logger = logging.getLogger(__name__)

APPROVE_TOKEN_SALT = 'approve-reservation-mail'
APPROVE_TOKEN_MAX_AGE = 60 * 60 * 24 * 30  # 30 dní

def make_approve_token(reservation_id):
    return signing.dumps(reservation_id, salt=APPROVE_TOKEN_SALT)

def read_approve_token(token):
    """Vráti id rezervácie alebo None, ak je token neplatný/expirovaný."""
    try:
        return signing.loads(token, salt=APPROVE_TOKEN_SALT, max_age=APPROVE_TOKEN_MAX_AGE)
    except signing.BadSignature:
        return None

def send_email(subject, html_message, to_mail):
    from_email = getattr(settings, 'EMAIL_HOST_USER')
    try:
        send_mail(
            subject=subject,
            message='',
            from_email=from_email,
            recipient_list=[to_mail],
            html_message=html_message,
        )
    except Exception:
        # Zlyhanie SMTP nesmie zhodiť request - rezervácia je už uložená v DB
        logger.exception('Nepodarilo sa odoslať email "%s" na %s', subject, to_mail)

def prepare_reservation_data(reservation):
    data = {
        'id': str(reservation.id),
        'name_surname': reservation.name_surname,
        'email': reservation.email if reservation.email else '',
        'phone_number': reservation.phone_number if reservation.phone_number else '',
        'date': reservation.get_date_string(),
        'slot': reservation.get_time_range_string(),
        'active': reservation.active,
        'status': reservation.status,
        'created_at': reservation.get_created_at_string(),
        'massage_type': reservation.massage_type if reservation.massage_type else "",
        'special_request': reservation.special_request if reservation.special_request else '',
        'personal_note': reservation.personal_note if reservation.personal_note else '',
        'cancellation_reason': reservation.cancellation_reason if reservation.cancellation_reason else '',
    }

    return data

def validate_reservation_slot(datetime_from_obj, datetime_to_obj, duration):
    """Serverová validácia rezervácie bežného zákazníka. Vráti chybovú hlášku alebo None."""
    if duration not in (30, 45, 60):
        return _('Neplatná dĺžka masáže.')

    if datetime_from_obj <= datetime.now():
        return _('Termín musí byť v budúcnosti.')

    if datetime_from_obj.minute % 15 != 0:
        return _('Neplatný začiatok termínu.')

    worker_config = config['settings']
    weekday_name = datetime_from_obj.strftime('%A')
    if weekday_name not in worker_config['working_days']:
        return _('V tento deň sa nemasíruje.')

    starting_hour_str = worker_config.get(f'{weekday_name}_starting_hour')
    ending_hour_str = worker_config.get(f'{weekday_name}_ending_hour')
    if not starting_hour_str or not ending_hour_str:
        return _('V tento deň sa nemasíruje.')

    starting_hour = datetime.strptime(starting_hour_str, '%H:%M').time()
    ending_hour = datetime.strptime(ending_hour_str, '%H:%M').time()
    if datetime_from_obj.time() < starting_hour or datetime_to_obj.time() > ending_hour:
        return _('Termín je mimo pracovných hodín.')

    selected_date = datetime_from_obj.date()
    for off_day in TurnedOffDay.objects.filter(date=selected_date):
        if off_day.whole_day:
            return _('V tento deň sa nemasíruje.')
        if off_day.time_from and off_day.time_to:
            if off_day.time_from < datetime_to_obj.time() and datetime_from_obj.time() < off_day.time_to:
                return _('Termín nie je dostupný.')

    # Kontrola prekrytia s existujúcimi schválenými rezerváciami (s 15 min prestávkou),
    # aby nevznikol double-booking, keď má stránku otvorenú viac ľudí naraz.
    overlapping = Reservation.objects.filter(
        active=True,
        datetime_from__lt=datetime_to_obj + timedelta(minutes=15),
        datetime_to__gt=datetime_from_obj - timedelta(minutes=15),
    ).exists()
    if overlapping:
        return _('Termín je už obsadený, vyberte prosím iný.')

    return None

def create_reservation(request):
    if request.method == 'POST':
        active = False
        status = 'Čaká sa schválenie'
        note = 'user'
        user = request.user if request.user.is_authenticated else None
        is_admin = bool(user and user.is_superuser)
        if is_admin:
            active = True
            status = 'Schválená'
            note = 'admin'

        config.read('config.ini')
        try:
            json_data = json.loads(request.body)
            selected_date = json_data.get('selectedDate')
            time_slot = json_data.get('timeSlot')
            duration = int(json_data.get('duration'))
            datetime_from_obj = datetime.strptime(f"{selected_date} {time_slot}", "%Y-%m-%d %H:%M")
        except (json.JSONDecodeError, ValueError, TypeError):
            return JsonResponse({'status': 'error', 'message': _('Neplatné údaje rezervácie.')}, status=400)

        date_time_to_obj = datetime_from_obj + timedelta(minutes=duration)

        if not json_data.get('nameSurname'):
            return JsonResponse({'status': 'error', 'message': _('Chýba meno a priezvisko.')}, status=400)

        if not is_admin:
            error = validate_reservation_slot(datetime_from_obj, date_time_to_obj, duration)
            if error:
                return JsonResponse({'status': 'error', 'message': str(error)}, status=400)

        new_reservation = Reservation.objects.create(
            user=user,
            name_surname=json_data.get('nameSurname'),
            email=json_data.get('email'),
            phone_number=json_data.get('phone'),
            status=status,
            active=active,
            special_request=json_data.get('note') if note == 'user' else '',
            personal_note=json_data.get('note') if note == 'admin' else '',
            datetime_from=datetime_from_obj,
            datetime_to=date_time_to_obj,
            massage_type = json_data.get('massageType') if json_data.get('massageType') else "",
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        try:
            already_created_reservation = AlreadyMadeReservation.objects.get(name_surname=json_data.get('nameSurname'))
        except AlreadyMadeReservation.DoesNotExist:
            already_created_reservation = AlreadyMadeReservation.objects.create(
                name_surname=json_data.get('nameSurname'),
                email=json_data.get('email'),
                phone_number=json_data.get('phone'),
            )

        if note == 'user':
            current_domain = getattr(settings, 'CURRENT_DOMAIN')
            subject = f'Nová rezervácia'
            accept_link = f'{current_domain}/approve_reservation_mail/{make_approve_token(new_reservation.id)}/'
            all_reservations_link = f'{current_domain}/all_reservations/'
            html_message = render_to_string('email_template.html',
                                            {'reservation': prepare_reservation_data(new_reservation),
                                             'button': True,
                                             'accept_link': accept_link,
                                             'all_reservations_link': all_reservations_link,
                                             'text': subject,
                                             })
            send_email(subject, html_message, getattr(settings, 'MAIN_EMAIL'))

        if note == 'admin' and new_reservation.email:
            subject = f'Rezervácia potvrdená'
            html_message = render_to_string('email_template.html',
                                            {'reservation': prepare_reservation_data(new_reservation),
                                             'button': None,
                                             'accept_link': None,
                                             'all_reservations_link': None,
                                             'text': '',
                                             })
            send_email(subject, html_message, new_reservation.email)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def check_available_slots(request):
    if request.method == 'POST':
        config.read('config.ini')
        json_data = json.loads(request.body)

        selected_date = json_data['selectedDate']
        selected_date = datetime.strptime(selected_date, '%Y-%m-%d').date()
        weekday_name = selected_date.strftime('%A')

        worker_config = config['settings']
        starting_hour_str = worker_config.get(f'{weekday_name}_starting_hour')
        ending_hour_str = worker_config.get(f'{weekday_name}_ending_hour')

        # Determine work hours
        starting_hour = datetime.strptime(starting_hour_str, '%H:%M').time()
        ending_hour = datetime.strptime(ending_hour_str, '%H:%M').time()

        # Get all reservations and turned-off days for the worker on the selected date
        reservations = Reservation.objects.filter(datetime_from__date=selected_date, active=True)
        turned_off_days = TurnedOffDay.objects.filter(date=selected_date)

        # Create a list of all possible slots for the day
        available_slots = []
        current_time = datetime.combine(selected_date, starting_hour)
        end_time = datetime.combine(selected_date, ending_hour)

        # Calculate the end time for the last possible starting slot to account for the minimum reservation time
        last_possible_start = end_time - timedelta(minutes=30)  # Adjust for 30-minute reservations

        while current_time <= last_possible_start:  # Include last possible starting time
            next_time = current_time + timedelta(minutes=15)  # Assuming 15-minute slots
            slot_start = current_time.time()
            slot_end = next_time.time()

            # Check if the slot overlaps with any turned-off time or reservations
            is_available = True

            # Check against turned-off days with specific times
            for turned_off_day in turned_off_days:
                turned_off_start = turned_off_day.time_from
                turned_off_end = turned_off_day.time_to
                
                if turned_off_day.whole_day:
                    is_available = False
                    break

                if turned_off_start and turned_off_end:
                    slot_end = (datetime.combine(selected_date, slot_start) + timedelta(minutes=30)).time()

                    if not (slot_end <= turned_off_start or slot_start >= turned_off_end):
                        is_available = False
                        break

            # Check against reservations
            for reservation in reservations:
                reservation_start_time = (reservation.datetime_from - timedelta(minutes=15)).time()
                reservation_end_time = (reservation.datetime_to + timedelta(minutes=15)).time()

                if (slot_start < reservation_end_time and
                        (datetime.combine(selected_date, slot_start) + timedelta(
                            minutes=30)).time() > reservation_start_time):
                    is_available = False
                    break

            if is_available:
                if slot_start.minute == 0:
                    available_slots.append(f"{slot_start.strftime('%H:%M')}")

            current_time = next_time
        return JsonResponse({'status': 'success', 'available_slots': available_slots})
    return JsonResponse({'status': 'error'})

def check_available_durations(request):
    if request.method == 'POST':
        config.read('config.ini')
        json_data = json.loads(request.body)
        selected_date = json_data.get('pickedDateGeneralData')
        selected_date = datetime.strptime(selected_date, '%Y-%m-%d').date()
        time_slot_start_str = json_data.get('timeSlot')  # Time as string (e.g., "15:30")
        time_slot_start = datetime.strptime(time_slot_start_str, '%H:%M').time()  # Convert to time object
        weekday_name = selected_date.strftime('%A')

        worker_config = config['settings']
        starting_hour_str = worker_config.get(f'{weekday_name}_starting_hour')
        ending_hour_str = worker_config.get(f'{weekday_name}_ending_hour')

        # Determine work hours
        starting_hour = datetime.strptime(starting_hour_str, '%H:%M').time()
        ending_hour = datetime.strptime(ending_hour_str, '%H:%M').time()

        turned_off_times = TurnedOffDay.objects.filter(date=selected_date)
        reservations = Reservation.objects.filter(datetime_from__date=selected_date, active=True)

        # Define possible duration windows in minutes
        duration_options = [30, 45, 60]
        available_durations = []

        for duration in duration_options:
            end_time = (datetime.combine(selected_date, time_slot_start) + timedelta(minutes=duration)).time()

            # Check if the window is within working hours
            if not (starting_hour <= time_slot_start <= ending_hour and starting_hour <= end_time <= ending_hour):
                continue

            # Special rule: allow 60 min only if this is the last possible slot
            if duration == 60:
                latest_start_for_60min = (datetime.combine(selected_date, ending_hour) - timedelta(minutes=60)).time()
                if time_slot_start != latest_start_for_60min:
                    continue

            # Check if this duration overlaps with any turned-off times
            overlaps = False
            for off_day in turned_off_times:
                off_start = off_day.time_from
                off_end = off_day.time_to

                if off_day.whole_day or (off_start and off_end and off_start < end_time and time_slot_start < off_end):
                    overlaps = True
                    break

            # Check for overlap with existing reservations, considering a 15-minute buffer
            for reservation in reservations:
                reservation_start = (reservation.datetime_from - timedelta(minutes=15)).time()
                reservation_end = (reservation.datetime_to + timedelta(minutes=15)).time()

                if reservation_start < end_time and time_slot_start < reservation_end:
                    overlaps = True
                    break

            if not overlaps:
                available_durations.append(duration)
            else:
                print(f"Duration {duration} is not available due to overlap.")

        print("Available durations:", available_durations)
        return JsonResponse({'status': 'success', 'available_durations': available_durations})
    return JsonResponse({'status': 'error'})

def check_available_slots_ahead(request):
    if request.method == 'GET':
        config.read('config.ini')
        today = datetime.now().date()
        tomorrow = today + timedelta(days=1)
        worker_config = config['settings']

        if request.user.is_superuser:
            days_to_check_ahead = 90
        else:
            days_to_check_ahead = int(worker_config['days_ahead'])
        working_days = worker_config['working_days']
        end_date = today + timedelta(days=days_to_check_ahead)
        slot_duration = 60

        events = []

        for single_date in (today + timedelta(n) for n in range((end_date - today).days + 1)):
            if single_date == today or single_date == tomorrow:
                continue
            weekday_name = single_date.strftime('%A')

            # Skip if the day is not a working day
            if weekday_name not in working_days:
                continue

            # Retrieve start and end working hours for the specific day
            starting_hour_str = worker_config.get(f'{weekday_name}_starting_hour')
            ending_hour_str = worker_config.get(f'{weekday_name}_ending_hour')

            if not starting_hour_str or not ending_hour_str:
                continue

            starting_hour = datetime.strptime(starting_hour_str, '%H:%M').time()
            ending_hour = datetime.strptime(ending_hour_str, '%H:%M').time()

            # Check if the day is turned off for the whole day
            turned_off_day = TurnedOffDay.objects.filter(date=single_date, whole_day=True).first()
            if turned_off_day:
                continue

            # Get all reservations and partial turned-off slots for that day
            reservations = Reservation.objects.filter(datetime_from__date=single_date, active=True)
            turned_off_slots = TurnedOffDay.objects.filter(date=single_date, whole_day=False)

            available_slots_count = 0
            current_time = datetime.combine(single_date, starting_hour)

            while current_time.time() < ending_hour:
                next_time = current_time + timedelta(minutes=slot_duration)
                slot_start = current_time.time()
                slot_end = next_time.time()

                # Check if the slot overlaps with any turned-off time
                slot_is_available = True
                for off in turned_off_slots:
                    if off.time_from <= slot_start < off.time_to or off.time_from < slot_end <= off.time_to:
                        slot_is_available = False
                        break

                # Check if the slot overlaps with any reservation
                for reservation in reservations:
                    if reservation.datetime_from.time() < slot_end and reservation.datetime_to.time() > slot_start:
                        slot_is_available = False
                        break

                if slot_is_available:
                    available_slots_count += 1

                current_time = next_time

            if available_slots_count == 1:
                possible = _('voľný')
            elif 2 <= available_slots_count <= 4:
                possible = _('voľné')
            else:
                possible = _('voľných')

            if available_slots_count > 0:
                events.append({
                    'start': single_date.strftime('%Y-%m-%d'),
                    'end': single_date.strftime('%Y-%m-%d'),
                    'title': f"{available_slots_count} {possible}",
                    'className': 'allowed-events-day'
                })

        return JsonResponse({'status': 'success', 'events': events})
    return JsonResponse({'status': 'error'})

def deactivate_reservation(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': _('Najskôr sa prihláste.')}, status=403)

    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        try:
            reservation = Reservation.objects.get(id=json_data.get('reservation_id'))
            # Zákazník smie zrušiť len vlastnú rezerváciu (podľa emailu účtu)
            if not request.user.is_superuser and reservation.email != request.user.email:
                return JsonResponse({'status': 'error', 'message': _('Prístup zamietnutý.')}, status=403)
            reservation.active = False
            reservation.status = 'Zrušená zákazníkom'
            reservation.cancellation_reason = json_data.get('reason')
            reservation.save()
            return JsonResponse({'status': 'success', 'message': _('Rezervácia úspešne zrušená.')})
        except Reservation.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': _('Rezervácia sa nenašla.')})
    return JsonResponse({'status': 'error', 'message': _('Zlý request')})

@superuser_required_api
def approve_reservation(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)

        try:
            reservation = Reservation.objects.get(id=json_data.get('id'))
            reservation.active = True
            reservation.status = 'Schválená'
            reservation.save()
            if reservation.email:
                subject = f'Rezervácia potvrdená'
                html_message = render_to_string('email_template.html',
                                                {'reservation': prepare_reservation_data(reservation),
                                                 'button': None,
                                                 'accept_link': None,
                                                 'text': '',
                                                 })
                send_email(subject, html_message, reservation.email)
            return JsonResponse({'status': 'success'})
        except Reservation.DoesNotExist:
            return JsonResponse({'status': 'error'})
    return JsonResponse({'status': 'error', 'message': _('Zlý request')})

@superuser_required_api
def deactivate_reservation_by_admin(request):
    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        try:
            reservation = Reservation.objects.get(id=json_data.get('id'))
            reservation.active = False
            reservation.status = 'Zrušená Masérom'
            reservation.personal_note = json_data.get('note')
            reservation.save()

            if reservation.email:
                subject = f'Rezervácia zamietnutá'
                html_message = render_to_string('email_template.html',
                                                {'reservation': prepare_reservation_data(reservation),
                                                 'button': None,
                                                 'accept_link': None,
                                                 'text': f'Poznámka maséra: {json_data.get("note")}' if json_data.get("note") else "",
                                                 })
                send_email(subject, html_message, reservation.email)
            return JsonResponse({'status': 'success'})
        except Reservation.DoesNotExist:
            return JsonResponse({'status': 'error'})
    return JsonResponse({'status': 'error', 'message': _('Zlý request')})

@superuser_required_api
def delete_reservation(request):
    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        try:
            reservation = Reservation.objects.get(id=json_data.get('id'))
            reservation.delete()
            return JsonResponse({'status': 'success'})

        except Reservation.DoesNotExist:
            return JsonResponse({'status': 'error'})
    return JsonResponse({'status': 'error', 'message': _('Zlý request')})

@superuser_required_api
def add_personal_note(request):
    if request.method == 'POST':
        json_data = json.loads(request.body)

        try:
            reservation = Reservation.objects.get(id=json_data.get('id'))
            reservation.personal_note = json_data.get('note')
            reservation.save()
            return JsonResponse({'status': 'success'})

        except Reservation.DoesNotExist:
            return JsonResponse({'status': 'error'})
    return JsonResponse({'status': 'error', 'message': _('Zlý request')})
