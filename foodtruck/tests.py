from django.test import TestCase
from tastypie.test import ResourceTestCase
import urllib.parse
import unittest.mock
import foodtruck.api
import os
import pickle

import logging
# Get an instance of a logger
logger = logging.getLogger(__name__)

class FoodTruckResourceTest(ResourceTestCase):

    @unittest.mock.patch.object(foodtruck.api.OAuth1Session, 'get')
    def test_food_trucks_search_json(self, mock_session_get):
        ne = urllib.parse.quote_plus('(37.78110738788123, -122.40873953695677)')
        sw = urllib.parse.quote_plus('(37.764146219585186, -122.45766302938841)')
        uri = "/api/v1/foodtruck/?ne={0}&sw={1}".format(ne, sw) 
        
        # Define the Response object from the OAuth1Session
        mock_session_get.return_value = mock_response = unittest.mock.Mock()
        mock_response.status_code = 200
        # Mock the Yelp API response from a file
        mock_response.json.return_value = pickle.load(open(os.path.dirname(os.path.realpath(__file__)) + '/data/mock_data.p', 'rb'))    
 
        resp = self.api_client.get(uri, format='json')
        self.assertValidJSONResponse(resp)
   
        food_trucks = self.deserialize(resp)['objects']
 
        self.assertEqual(len(food_trucks), 20)
        expected_foodtrucks = ['Juice Shop Truck', 'Lil Burma', 'Off The Grid: McCoppin Hub', 
        'Off the Grid: Civic Center', 'Waffle Mania Truck', 'Off the Grid: Upper Haight', 
        'El Tonayense Taco Truck', 'JapaCurry Truck', 'Bacon Bacon', 'Brass Knuckle', 
        'Off the Grid: UN Plaza', 'Little Red Riding Truck', 'BS Trivia', "Koz's Kitchen", 
        'The Boneyard', "Lexie's Frozen Custard Truck", 'Hongry Kong Truck', 'Old World Food Truck', 
        'Los Compadres Taco Truck', 'Me So Hungry']
        
        for food_truck in food_trucks:
            self.assertTrue(food_truck['name'] in expected_foodtrucks)
