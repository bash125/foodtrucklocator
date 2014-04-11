from django.test import TestCase
from tastypie.test import ResourceTestCase
from foodtruck.models import FoodTruck
import urllib.parse, urllib.request
from django.contrib.gis.geos import Point

import logging
# Get an instance of a logger
logger = logging.getLogger(__name__)

class FoodTruckTestCase(TestCase):
    def setUp(self):
        FoodTruck.objects.create(name='Munch A Bunch', address='1144 LARKIN ST, San Francisco, CA', location=Point(37.7885275753132035, -122.4183136857210030))

    def test_food_trucks_creation(self):
        munch_a_bunch = FoodTruck.objects.get(name="Munch A Bunch")
        self.assertEqual(munch_a_bunch.address, '1144 LARKIN ST, San Francisco, CA')

class FoodTruckResourceTest(ResourceTestCase):

    def setUp(self):
        super(FoodTruckResourceTest, self).setUp()
        FoodTruck.objects.create(name='Subs on Hubs', address='333 08TH ST, San Francisco, CA', location=Point(-122.4093858231940004, 37.7749754998217000))
        FoodTruck.objects.create(name='Mini Mobile Food Catering', address='350 08TH ST, San Francisco, CA', location=Point(-122.4096584413560009, 37.7736941524749028))
        FoodTruck.objects.create(name='Munch A Bunch', address='333 12TH ST, San Francisco, CA', location=Point(-122.4140072975969957, 37.7708182299992998))
        FoodTruck.objects.create(name='Cheese Gone Wild', address='1801 VAN NESS AVE, San Francisco, CA', location=Point(-122.4231319220940009, 37.7923033830752999))

    def test_food_trucks_search_json(self):
        ne = urllib.parse.quote_plus('(37.78110738788123, -122.40873953695677)')
        sw = urllib.parse.quote_plus('(37.764146219585186, -122.45766302938841)')

        uri = "/api/v1/foodtruck/?ne={0}&sw={1}".format(ne, sw)        
        
        resp = self.api_client.get(uri, format='json')
        self.assertValidJSONResponse(resp)

        food_trucks = self.deserialize(resp)['objects']
        # Make sure that only four of the five trucks return back
        self.assertEqual(len(food_trucks), 3)
        expected_foodtrucks = ['Subs on Hubs', 'Munch A Bunch', 'Mini Mobile Food Catering']
        for food_truck in food_trucks:
            self.assertTrue(food_truck['name'] in expected_foodtrucks)
