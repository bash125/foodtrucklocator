from django.test import TestCase
from tastypie.test import ResourceTestCase
from foodtruck.models import FoodTruck

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
        FoodTruck.objects.create(name='D & T Catering', address='1150 FRANCISCO ST, San Francisco, CA', location=Point(37.8037902440403002, -122.4241451749829963))
        FoodTruck.objects.create(name='Munch A Bunch', address='1144 LARKIN ST, San Francisco, CA', location=Point(37.7885275753132035, -122.4183136857210030))
        FoodTruck.objects.create(name='John\'s Catering #5', address='1003 TURK ST, San Francisco, CA', location=Point(37.7808684365680989, -122.4254677266179954))
        FoodTruck.objects.create(name='Cheese Gone Wild', address='1801 VAN NESS AVE, San Francisco, CA', location=Point(37.7923033830752999, -122.4231319220940009))
        FoodTruck.objects.create(name='Mini Mobile Food Catering', address='1690 FOLSOM ST, San Francisco, CA', location=Point(37.7701375805014976, -122.4159834028040024))

    def test_food_trucks_search_json(self):
        address = '1918 Van Ness Ave, San Francisco, CA 94109'
        distance = 0.5
        uri = "/api/v1/foodtruck/?address={0}&distance={1}".format(address, distance)      
        resp = self.api_client.get(uri, format='json')
        self.assertValidJSONResponse(resp)
        
        food_trucks = self.deserialize(resp)['objects']
        # Make sure that only four of the five trucks return back
        self.assertEqual(len(food_trucks), 4)
        expected_foodtrucks = ['D & T Catering', 'Munch A Bunch', 'John\'s Catering #5', 'Cheese Gone Wild']
        for food_truck in food_trucks:
            self.assertTrue(food_truck['name'] in expected_foodtrucks)
