from django.db import migrations

NEW_PHOTOS = [
    'static/images/bankovanie1.jpg',
    'static/images/bankovanie2.jpg',
]


def add_photos(apps, schema_editor):
    GalleryPhoto = apps.get_model('viewer', 'GalleryPhoto')
    for path in NEW_PHOTOS:
        GalleryPhoto.objects.get_or_create(photo=path)


def remove_photos(apps, schema_editor):
    GalleryPhoto = apps.get_model('viewer', 'GalleryPhoto')
    GalleryPhoto.objects.filter(photo__in=NEW_PHOTOS).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('viewer', '0003_reservation_massage_type'),
    ]

    operations = [
        migrations.RunPython(add_photos, remove_photos),
    ]
