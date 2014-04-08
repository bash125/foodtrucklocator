from django.conf.urls import patterns, url

from foodtruck import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
)