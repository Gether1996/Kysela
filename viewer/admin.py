from django.contrib import admin
from .models import GalleryPhoto, VoucherPhoto, Reservation, TurnedOffDay

@admin.register(GalleryPhoto)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('photo', 'id')

@admin.register(VoucherPhoto)
class VoucherAdmin(admin.ModelAdmin):
    list_display = ('photo', 'id')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'name_surname', 'email', 'phone_number', 'datetime_from',
        'datetime_to', 'active', 'status', 'created_at', 'updated_at'
    )
    list_filter = ('active', 'status', 'datetime_from', 'datetime_to')
    search_fields = ('name_surname', 'email', 'phone_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('user', 'name_surname', 'email', 'phone_number', 'datetime_from', 'datetime_to', 'active', 'status')
        }),
        ('Additional Info', {
            'classes': ('collapse',),
            'fields': ('special_request', 'personal_note', 'cancellation_reason')
        }),
        ('Timestamps', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(TurnedOffDay)
class TurnedOffDayAdmin(admin.ModelAdmin):
    list_display = (
        'date', 'whole_day', 'time_from', 'time_to'
    )
    list_filter = ('date', 'whole_day', 'time_from', 'time_to')