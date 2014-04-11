from tastypie.resources import ModelResource, ALL
from foodtruck.models import FoodTruck
from django.contrib.gis.geos import Polygon

import re
import logging
logger = logging.getLogger(__name__)


class FoodTruckResource(ModelResource):
    class Meta:
        queryset = FoodTruck.objects.all()
        filtering = {
            "id": ALL,
        }

    def obj_get_list(self, bundle, **kwargs):
        
        if 'ne' in bundle.request.GET and bundle.request.GET['ne'] and 'sw' in bundle.request.GET and bundle.request.GET['sw']:
            
            [neLat, neLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['ne'])]
            [swLat, swLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['sw'])]
            
            window =  Polygon(( (neLng, neLat),(neLng,swLat),(swLng, swLat),(swLng,neLat),(neLng, neLat) ))
            
            foodtrucks = FoodTruck.objects.filter(location__within=(window))
            return foodtrucks

        else:
            return self.get_object_list(bundle.request)
