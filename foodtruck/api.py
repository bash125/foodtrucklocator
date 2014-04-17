from tastypie.resources import Resource
from tastypie import fields
import configparser
from rauth import OAuth1Session
import os
import re

import logging
logger = logging.getLogger(__name__)

class FoodTruck(object):
    # Define a new object from whatever parameters are passed in via the dict
    def __init__(self, **entries): 
        self.__dict__.update(entries)

class FoodTruckResource(Resource):
    name = fields.CharField(attribute='name')
    display_address = fields.CharField(attribute='display_address')
    url = fields.CharField(attribute='url')
    review_count = fields.IntegerField(attribute='review_count')
    rating_img_url = fields.CharField(attribute='rating_img_url')
    rating = fields.FloatField(attribute='rating')
    latitude = fields.FloatField(attribute='latitude')
    longitude = fields.FloatField(attribute='longitude')
    
    class Meta:
        object_class = FoodTruck

    def obj_get_list(self, bundle, **kwargs):
        foodTrucks = []
        if 'ne' in bundle.request.GET and bundle.request.GET['ne'] and 'sw' in bundle.request.GET and bundle.request.GET['sw']:
            
            [neLat, neLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['ne'])]
            [swLat, swLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['sw'])]
            
            config = configparser.ConfigParser()
            config.read(os.path.dirname(os.path.realpath(__file__)) + '/data/keys.ini')
            
            # Set up a session to the Yelp API
            session = OAuth1Session(consumer_key = config['Yelp']['consumer_key'],
                                          consumer_secret = config['Yelp']['consumer_secret'],
                                          access_token = config['Yelp']['token'],
                                          access_token_secret = config['Yelp']['token_secret'])
            
            searchParams = {
                    'category_filter': 'foodtrucks',
                    'limit': 20,
                    'bounds': '{0},{1}|{2},{3}'.format(swLat, swLng, neLat, neLng)
                    }
            
            # Optionally pass in the name of the food truck the user is looking for, if at all
            if 'name' in bundle.request.GET and bundle.request.GET['name']:
                searchParams['term'] = bundle.request.GET['name']
            
#             response = session.get('http://api.yelp.com/v2/search',params=searchParams)
#             parsed_response = response.json()
#             logger.debug(parsed_response)
            import pickle
            parsed_response = pickle.load(open(os.path.dirname(os.path.realpath(__file__)) + '/data/mock_data.p', 'rb'))    
           
            for foodTruck in parsed_response['businesses']:
                if foodTruck['is_closed'] == False:
                    
                    display_address = "\n".join(foodTruck['location']['display_address'])

                    ftModel = {
                                'name': foodTruck['name'],
                                'display_address': display_address,
                                'url': foodTruck['url'],
                                'review_count': foodTruck['review_count'],
                                'rating_img_url': foodTruck['rating_img_url'],
                                'rating': foodTruck['rating'],
                                'latitude': foodTruck['location']['coordinate']['latitude'],
                                'longitude': foodTruck['location']['coordinate']['longitude']
                                }
                    foodTrucks.append(FoodTruck(**ftModel))

        return foodTrucks
