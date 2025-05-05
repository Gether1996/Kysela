import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-sx5t9b&tpm9y0r+8(er1459^l2#tkplzc6w9#bu2wt_g-kuk7!'

DEBUG = False

ALLOWED_HOSTS = ['127.0.0.1', 'mail.314.sk', '*']

DOMAINS = ['https://pkrelaxfit.sk', 'https://www.pkrelaxfit.sk', 'http://pkrelaxfit.sk']
CURRENT_DOMAIN = 'https://pkrelaxfit.sk'

CSRF_TRUSTED_ORIGINS = DOMAINS

MAIN_EMAIL = 'kyspa@kyspa.sk'
# MAIN_EMAIL = 'gether1996@gmail.com'

LOGIN_URL = '/admin/login/'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'viewer',
    'accounts',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Roman.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'viewer.context_processors.language_code',
            ],
        },
    },
]

WSGI_APPLICATION = 'Roman.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'mysql.connector.django',
        'NAME': 'c0masazekysela',
        'USER': 'c0masazekysela',
        'PASSWORD': 'PwgM9#Y8bm',
        'HOST': 'mail.314.sk',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'use_pure': True,
        },
    },
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'locale'),
]

AUTH_USER_MODEL = 'accounts.CustomUser'

LANGUAGE_CODE = 'sk'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.314.sk'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'objednavky@pkrelaxfit.sk'
EMAIL_HOST_PASSWORD = 'dSByF7Gsf@7Cy'