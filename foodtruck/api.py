from tastypie.resources import ModelResource, ALL
from foodtruck.models import FoodTruck
from django.contrib.gis.measure import D
from django.contrib.gis.geos import Point
import configparser
import urllib.parse, urllib.request, json
import os.path

class FoodTruckResource(ModelResource):
    class Meta:
        queryset = FoodTruck.objects.all()

    def obj_get_list(self, bundle, **kwargs):
        
        if 'address' in bundle.request.GET and bundle.request.GET['address'] and 'distance' in bundle.request.GET and bundle.request.GET['distance']:
            # Capture the radius distance from the api call
            distance = float(bundle.request.GET['distance'])
            
            # Get the key from the api file
            config = configparser.ConfigParser()
            config.read(os.path.dirname(os.path.realpath(__file__)) + '/data/keys.ini')
            key = config['Geolocation']['key']
            
            # Geocode the user's address
            address = urllib.parse.quote_plus(bundle.request.GET['address'])
            request = "https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}&sensor=false".format(address, key)
            data = json.loads(urllib.request.urlopen(request).read().decode('utf-8'))
     
            if data['status'] == 'OK':
                lat = data['results'][0]['geometry']['location']['lat']
                lng = data['results'][0]['geometry']['location']['lng']
                origin = Point(float(lat), float(lng))
                # Filter foodtrucks to those within that radius distance
                foodtrucks = FoodTruck.objects.filter(location__distance_lte=(origin, D(mi=distance)))
                return foodtrucks
        else:
            return self.get_object_list(bundle.request)
