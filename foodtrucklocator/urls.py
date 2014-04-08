from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from foodtruck.api import FoodTruckResource
from tastypie.api import Api
ft_api = Api(api_name='v1')
ft_api.register(FoodTruckResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'foodtrucklocator.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(ft_api.urls)),
    url(r'^$', include('foodtruck.urls')),

)
