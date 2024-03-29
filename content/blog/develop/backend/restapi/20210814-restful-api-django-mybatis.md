---
title: "Django rest api Mybatis 연동"
image: "bg-rest.png"
font_color: "white"
font_size: "22px"
opacity: "0.4"
date: 2021-08-14
slug: "restful-api-django-mybatis"
description: "레스트풀 API"	
keywords: ["Restful"]
draft: true
categories: ["Backend"]
subcategories: ["RESTful"]
tags: ["Restful","Api", "Django", "RDS", "Mysql","Mybatis"]
math: false
toc: true
---

# Django rest api Mybatis 연동


PS C:\Users\offetuoso> pip install django

PS C:\Users\offetuoso> pip install djangorestframework

PS C:\Users\offetuoso> pip install django-cors-headers


PS C:\Users\offetuoso> pip install --upgrade virtualenv

#가상환경생성
PS C:\Users\offetuoso> virtualenv myvenv

PS C:\Users\offetuoso>  call venv/scripts/activate

#Django 생성
PS C:\develop\Git\engall-v2> django-admin startproject engall


# cmd 창에서 vscode 열기
C:\develop\Git\engall-v2\engall>code .

# Django 실행
C:\develop\Git\engall-v2\engall>python manage.py runserver
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
August 14, 2021 - 13:08:20
Django version 3.2.6, using settings 'engall.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
[14/Aug/2021 13:08:40] "GET / HTTP/1.1" 200 10697
[14/Aug/2021 13:08:41] "GET /static/admin/css/fonts.css HTTP/1.1" 200 423
[14/Aug/2021 13:08:41] "GET /static/admin/fonts/Roboto-Bold-webfont.woff HTTP/1.1" 200 86184
[14/Aug/2021 13:08:41] "GET /static/admin/fonts/Roboto-Light-webfont.woff HTTP/1.1" 200 85692
[14/Aug/2021 13:08:41] "GET /static/admin/fonts/Roboto-Regular-webfont.woff HTTP/1.1" 200 85876
Not Found: /favicon.ico
[14/Aug/2021 13:08:41] "GET /favicon.ico HTTP/1.1" 404 2110


## UserApp 생성
C:\develop\Git\engall-v2\engall>python manage.py startapp UserApp


setting.py 설정 

```
"""
Django settings for engall project.

Generated by 'django-admin startproject' using Django 3.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-gi4m9sw5s)(9+g10f^_=0c=z9wv9r$e4%2$ah(zzfp*h-yfct$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'UserApp.apps.UserappConfig',
    'EmployeeApp.apps.EmployeeappConfig'
]

CORS_ORIGIN_ALLOW_ALL = True

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'engall.urls'

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
            ],
        },
    },
]

WSGI_APPLICATION = 'engall.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

```

## model.py 설정

```


class Departments(models.Model):
	DepartmentId = models.AutoField(primary_key=True)
	DepartmentName = models.models.CharField(max_length=500)

class Employees(models.Model):
	EmployeeId = models.AutoField(primary_key=True)
	EmployeeName = models.models.CharField(max_length=500)
	Department = models.models.CharField(max_length=500)
	DateOfJoining = models.models.models.DateField()
	PhotoFileName = models.models.CharField(max_length=500)
```


## pymysql 설치

C:\develop\Git\engall-v2\engall>pip install pymysql
Defaulting to user installation because normal site-packages is not writeable
Collecting pymysql
  Downloading PyMySQL-1.0.2-py3-none-any.whl (43 kB)
     |████████████████████████████████| 43 kB 396 kB/s
Installing collected packages: pymysql
Successfully installed pymysql-1.0.2
WARNING: You are using pip version 21.0.1; however, version 21.2.4 is available.
You should consider upgrading via the 'c:\program files\python\python39\python.exe -m pip install --upgrade pip' command.

C:\develop\Git\engall-v2\engall>


# vscode 에서 pymysql 설치
https://stackoverflow.com/questions/68638109/import-module-could-not-be-resolved-from-sourcepylancereportmissingmodulesourc

# Model 생성
C:\develop\Git\engall-v2\engall>python manage.py makemigrations UserApp
Migrations for 'UserApp':
  UserApp\migrations\0001_initial.py
    - Create model Stuendts
    - Create model Tutors
    
    
###  Email = models.models.CharField(max_length=500) AttributeError: module 'django.db.models' has no attribute 'models'
> models.models.CharField X / models.CharField O

C:\develop\Git\engall-v2\engall>python manage.py makemigrations UserApp
Traceback (most recent call last):
  File "C:\develop\Git\engall-v2\engall\manage.py", line 22, in <module>
    main()
  File "C:\develop\Git\engall-v2\engall\manage.py", line 18, in main
    execute_from_command_line(sys.argv)
  File "C:\Program Files\Python\Python39\lib\site-packages\django\core\management\__init__.py", line 419, in execute_from_command_line
    utility.execute()
  File "C:\Program Files\Python\Python39\lib\site-packages\django\core\management\__init__.py", line 395, in execute
    django.setup()
  File "C:\Program Files\Python\Python39\lib\site-packages\django\__init__.py", line 24, in setup
    apps.populate(settings.INSTALLED_APPS)
  File "C:\Program Files\Python\Python39\lib\site-packages\django\apps\registry.py", line 114, in populate
    app_config.import_models()
  File "C:\Program Files\Python\Python39\lib\site-packages\django\apps\config.py", line 301, in import_models
    self.models_module = import_module(models_module_name)
  File "C:\Program Files\Python\Python39\lib\importlib\__init__.py", line 127, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
  File "<frozen importlib._bootstrap>", line 1030, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1007, in _find_and_load
  File "<frozen importlib._bootstrap>", line 986, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 680, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 790, in exec_module
  File "<frozen importlib._bootstrap>", line 228, in _call_with_frames_removed
  File "C:\develop\Git\engall-v2\engall\UserApp\models.py", line 5, in <module>
    class Stuendts(models.Model):
  File "C:\develop\Git\engall-v2\engall\UserApp\models.py", line 7, in Stuendts
    Email = models.models.CharField(max_length=500)
AttributeError: module 'django.db.models' has no attribute 'models'

C:\develop\Git\engall-v2\engall>






## migrate

C:\develop\Git\engall-v2\engall>python manage.py migrate UserApp
Operations to perform:
  Apply all migrations: UserApp
Running migrations:
  Applying UserApp.0001_initial... OK




## 테이블 Model로 DB에 생성해주기 
python manage.py makemigrations UserApp




## 접속한 DB의 테이블 대로 Models 생성
python manage.py inspectdb > userApp/models_created.py

**** 생성된 models encoding 16진수로 나와서 utf-8로 바꿔줘야됨 !!!! ****

**** 디폴트 벨류 세팅 models.DateTimeField(auto_now_add=True, blank=True)  *****



## 테스트 코드 실행
python manage.py test --settings='engall.settings_test' --verbosity 3