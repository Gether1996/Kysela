import configparser
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.translation import activate
from django.utils.translation import gettext_lazy as _
from Roman.backend_funcs.reservation import prepare_reservation_data, send_email
from accounts.models import CustomUser
from viewer.models import GalleryPhoto, VoucherPhoto, Reservation, TurnedOffDay, AlreadyMadeReservation
from datetime import datetime
from django.utils.translation import gettext as _
import json

config = configparser.ConfigParser()

def homepage(request):
    language_code = request.session.get('django_language', 'sk')
    photos = GalleryPhoto.objects.all()
    vouchers = VoucherPhoto.objects.all()

    activate(language_code)
    return render(request, 'homepage.html', {'photos': photos, 'vouchers': vouchers})

def calendar_view_admin(request):
    if not request.user.is_authenticated:
        message = _('Najskôr sa prihláste. (len pre admina)')
        return render(request, 'error.html', {'message': message})

    if not request.user.is_superuser:
        message = _('Náhľad povolený len pre admina.')
        return render(request, 'error.html', {'message': message})

    current_datetime = datetime.now()
    future_reservations = Reservation.objects.filter(datetime_from__gt=current_datetime)
    events = []
    for reservation in future_reservations:
        events.append({
            'id': reservation.id,
            'title': f"{reservation.name_surname}",
            'start': reservation.datetime_from.isoformat(),
            'end': reservation.datetime_to.isoformat(),
            'borderColor': reservation.get_color(),
            'backgroundColor': reservation.get_color(),
            'textColor': 'white',

            # Put phone and email into extendedProps
            'extendedProps': {
                'phone': reservation.phone_number,
                'email': reservation.email,
                'active': "True" if reservation.active else "False",
            }
        })

    events_json = json.dumps(events)
    return render(request, 'calendar_view_admin.html', {'events': events_json})


def reservation(request):
    users = AlreadyMadeReservation.objects.all().order_by('name_surname')
    user_data = [
        {
            'id': str(user.id),
            'name_surname': user.name_surname,
            'email': user.email if user.email else '',
            'phone': user.phone_number if user.phone_number else '',
        }
        for user in users
    ]
    return render(request, 'reservation.html', {'user_data': user_data})

def settings(request):
    if not request.user.is_authenticated:
        message = _('Najskôr sa prihláste. (len pre admina)')
        return render(request, 'error.html', {'message': message})

    if not request.user.is_superuser:
        message = _('Náhľad povolený len pre admina.')
        return render(request, 'error.html', {'message': message})

    config.read('config.ini')
    days_ahead = int(config['settings']['days_ahead'])

    starting_slot_hour_monday = str(config['settings']['monday_starting_hour'])
    starting_slot_hour_tuesday = str(config['settings']['tuesday_starting_hour'])
    starting_slot_hour_wednesday = str(config['settings']['wednesday_starting_hour'])
    starting_slot_hour_thursday = str(config['settings']['thursday_starting_hour'])
    starting_slot_hour_friday = str(config['settings']['friday_starting_hour'])
    starting_slot_hour_saturday = str(config['settings']['saturday_starting_hour'])
    starting_slot_hour_sunday = str(config['settings']['sunday_starting_hour'])

    ending_slot_hour_monday = str(config['settings']['monday_ending_hour'])
    ending_slot_hour_tuesday = str(config['settings']['tuesday_ending_hour'])
    ending_slot_hour_wednesday = str(config['settings']['wednesday_ending_hour'])
    ending_slot_hour_thursday = str(config['settings']['thursday_ending_hour'])
    ending_slot_hour_friday = str(config['settings']['friday_ending_hour'])
    ending_slot_hour_saturday = str(config['settings']['saturday_ending_hour'])
    ending_slot_hour_sunday = str(config['settings']['sunday_ending_hour'])

    working_days = config['settings']['working_days']

    turned_off_days = TurnedOffDay.objects.all()

    turned_off_days_data = [
        {
            'id': day.id,
            'date': day.formatted_date(),
            'whole_day': day.whole_day,
            'time_range': day.formatted_time_range(),
        }
        for day in turned_off_days
    ]

    context = {
        'turned_off_days_data': turned_off_days_data,

        'days_ahead': days_ahead,
        'working_days': working_days,
        'starting_slot_hour_monday': starting_slot_hour_monday,
        'ending_slot_hour_monday': ending_slot_hour_monday,
        'starting_slot_hour_tuesday': starting_slot_hour_tuesday,
        'ending_slot_hour_tuesday': ending_slot_hour_tuesday,
        'starting_slot_hour_wednesday': starting_slot_hour_wednesday,
        'ending_slot_hour_wednesday': ending_slot_hour_wednesday,
        'starting_slot_hour_thursday': starting_slot_hour_thursday,
        'ending_slot_hour_thursday': ending_slot_hour_thursday,
        'starting_slot_hour_friday': starting_slot_hour_friday,
        'ending_slot_hour_friday': ending_slot_hour_friday,
        'starting_slot_hour_saturday': starting_slot_hour_saturday,
        'ending_slot_hour_saturday': ending_slot_hour_saturday,
        'starting_slot_hour_sunday': starting_slot_hour_sunday,
        'ending_slot_hour_sunday': ending_slot_hour_sunday,
    }

    return render(request, 'settings_view.html', context)

def profile(request):
    if not request.user.is_authenticated:
        message = _('Najskôr sa prihláste.')
        return render(request, 'error.html', {'message': message})
    try:
        reservations = Reservation.objects.filter(email=request.user.email).order_by('-datetime_from')
        reservation_data = [
            {
                'id': reservation.id,
                'name_surname': reservation.name_surname,
                'email': reservation.email,
                'phone_number': reservation.phone_number,
                'date': reservation.get_date_string(),
                'time': reservation.get_time_range_string(),
                'status': reservation.status,
                'massage_type': reservation.massage_type if reservation.massage_type else "",
                'special_request': reservation.special_request,
                'cancellation_reason': reservation.cancellation_reason if reservation.cancellation_reason else "",
                'created_at': reservation.get_created_at_string(),
                'is_past': datetime.now() > reservation.datetime_to,
                'active': reservation.active
            }
            for reservation in reservations
        ]

        context = {
            'reservation_data': reservation_data
        }

        return render(request, 'profile.html', context)
    except CustomUser.DoesNotExist:
        message = _('Najskôr sa prihláste.')
        return render(request, 'error.html', {'message': message})

def all_reservations(request):
    if not request.user.is_authenticated:
        message = _('Najskôr sa prihláste. (len pre admina)')
        return render(request, 'error.html', {'message': message})

    if not request.user.is_superuser:
        message = _('Náhľad povolený len pre admina.')
        return render(request, 'error.html', {'message': message})

    sort_by = request.GET.get('sort_by', 'datetime_from')
    order = request.GET.get('order', 'asc')
    page = request.GET.get('page', 1)

    context = {
        'current_sort_by': sort_by,
        'current_order': order,
        'page': page,
    }

    if 'sort_by' not in request.GET:
        if page:
            return redirect(f'{reverse("all_reservations")}?sort_by=datetime_from&order=asc&page={page}')
        else:
            return redirect(f'{reverse("all_reservations")}?sort_by=datetime_from&order=asc')
    return render(request, 'all_reservations.html', context)


def get_all_reservations_data(request):
    config.read('config.ini')
    filters = {
        'name_surname': request.GET.get('name_surname', ''),
        'email': request.GET.get('email', ''),
        'phone_number': request.GET.get('phone_number', ''),
        'date': request.GET.get('date', ''),
        'slot': request.GET.get('slot', ''),
        'massage_type': request.GET.get('massage_type', ''),
        'created_at': request.GET.get('created_at', ''),
        'special_request': request.GET.get('special_request', ''),
        'status': request.GET.get('status', ''),
    }

    reservations_per_page = int(config['settings']['reservations_per_page'])
    all_reservations_obj = Reservation.objects.all()

    sort_by = request.GET.get('sort_by', 'datetime_from')
    order = request.GET.get('order', 'asc')

    if filters['name_surname']:
        all_reservations_obj = all_reservations_obj.filter(name_surname__icontains=filters['name_surname'])

    if filters['email']:
        all_reservations_obj = all_reservations_obj.filter(email__icontains=filters['email'])

    if filters['phone_number']:
        all_reservations_obj = all_reservations_obj.filter(phone_number__icontains=filters['phone_number'])

    if filters['special_request']:
        all_reservations_obj = all_reservations_obj.filter(special_request__icontains=filters['special_request'])

    if filters['status']:
        all_reservations_obj = all_reservations_obj.filter(status__icontains=filters['status'])

    if filters['massage_type']:
        all_reservations_obj = all_reservations_obj.filter(massage_type__icontains=filters['massage_type'])

    if filters['created_at']:
        all_reservations_obj_filtered = [
            reservation for reservation in all_reservations_obj
            if filters['created_at'] in reservation.get_created_at_string()
        ]
        all_reservations_obj = all_reservations_obj.filter(created_at__in=[reservation.created_at for reservation in all_reservations_obj_filtered])

    if filters['date']:
        all_reservations_obj_filtered = [
            reservation for reservation in all_reservations_obj
            if filters['date'] in reservation.get_date_string()
        ]
        all_reservations_obj = all_reservations_obj.filter(datetime_from__in=[reservation.datetime_from for reservation in all_reservations_obj_filtered])

    if filters['slot']:
        all_reservations_obj_filtered = [
            reservation for reservation in all_reservations_obj
            if filters['slot'] in reservation.get_time_range_string()
        ]
        all_reservations_obj = all_reservations_obj.filter(datetime_from__in=[reservation.datetime_from for reservation in all_reservations_obj_filtered])

    if order == 'asc' and sort_by:
        all_reservations_obj = all_reservations_obj.order_by(str(sort_by))
    elif order == 'desc' and sort_by:
        all_reservations_obj = all_reservations_obj.order_by(f'-{sort_by}')

    paginator = Paginator(all_reservations_obj, reservations_per_page)
    page = request.GET.get('page', 1)
    try:
        loaded_reservations = paginator.page(page)
    except PageNotAnInteger:
        loaded_reservations = paginator.page(1)
    except EmptyPage:
        loaded_reservations = paginator.page(paginator.num_pages)

    formatted_reservations = []
    for reservation in loaded_reservations:
        formatted_reservations.append(prepare_reservation_data(reservation))

    response_data = {
        'reservations': formatted_reservations,
        'pagination': {
            'current_page': loaded_reservations.number,
            'total_pages': paginator.num_pages,
            'total_files': paginator.count,
            'files_per_page': reservations_per_page,
            'has_previous': loaded_reservations.has_previous(),
            'has_next': loaded_reservations.has_next(),
        }
    }

    return JsonResponse(response_data, safe=False)

def approve_reservation_mail(request, reservation_id):
    if request.method == 'GET':
        try:
            reserv = Reservation.objects.get(id=reservation_id)

            if not reserv.active:
                reserv.active = True
                reserv.status = 'Schválená'
                reserv.save()

                subject = f'Rezervácia potvrdená'
                html_message = render_to_string('email_template.html',
                                                {'reservation': prepare_reservation_data(reserv),
                                                 'button': None,
                                                 'accept_link': None,
                                                 'text': '',
                                                 })
                send_email(subject, html_message, reserv.email)

            context = {
                'reservation': prepare_reservation_data(reserv),
            }

            return render(request, 'approved_reservation.html', context)

        except Reservation.DoesNotExist:
            message = 'Rezervácia sa nenašla.'
            return render(request, 'error.html', {'message': message})

    message = 'Zlý request'
    return render(request, 'error.html', {'message': message})
