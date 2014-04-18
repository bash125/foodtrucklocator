from django.conf.urls import patterns, url
from foodtruck import views
from django.conf import settings

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
)
if not settings.DEBUG:
    urlpatterns += patterns('',
        (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )