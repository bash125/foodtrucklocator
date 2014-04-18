from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from foodtruck.api import FoodTruckResource
from tastypie.api import Api
ft_api = Api(api_name='v1')
ft_api.register(FoodTruckResource())

urlpatterns = patterns('',
    # Redirect to the admin page
    url(r'^admin/', include(admin.site.urls)),
    # Redirect to the tastypie API
    url(r'^api/', include(ft_api.urls)),
    # Redirect to the main index.html page
    url(r'^$', include('foodtruck.urls')),

)
