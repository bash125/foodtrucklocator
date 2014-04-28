from tastypie.resources import Resource
from tastypie import fields
from rauth import OAuth1Session
import os
import re

import logging
logger = logging.getLogger(__name__)

class FoodTruck(object):
    '''
    Generic FoodTruck object to pass around internally.
    '''
    # Define a new object from whatever parameters are passed in via the dict
    def __init__(self, **entries): 
        self.__dict__.update(entries)

class FoodTruckResource(Resource):
    '''
    Tastypie non-ORM resource to capture Yelp data and pass it back to the client.
    '''
    # Define all the relevant "model" fields here without actually defining a Django ORM model 
    name = fields.CharField(attribute='name')
    categories = fields.CharField(attribute='categories')
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
        '''
        Search's Yelp's API for relevant food trucks defined in the search parameters given in bundle. 
        
        :param bundle: A Tastypie bundle containing, among other things, the HTTP request containing search parameters.
        
        Mandatory parameters are:
            -ne: coordinates (in latitude, longitude form) representing the north-eastern point of the search area.
            -sw: coordinates (in latitude, longitude form) representing the south-wetern point of the search area.
        
        Optional parameters are:
            -name: a search term relevant to the food truck you are looking for, i.e. waffles, HappyIceCreamTruck, etc.
        
        :type bundle: Bundle.
        '''
        foodTrucks = []
        if 'ne' in bundle.request.GET and bundle.request.GET['ne'] and 'sw' in bundle.request.GET and bundle.request.GET['sw']:
            
            [neLat, neLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['ne'])]
            [swLat, swLng] = [float(c) for c in re.findall('[0-9.-]+', bundle.request.GET['sw'])]
            
            # Set up a session to the Yelp API
            session = OAuth1Session(consumer_key = os.environ['YELP_CONSUMER_KEY'],
                                          consumer_secret = os.environ['YELP_CONSUMER_SECRET'],
                                          access_token = os.environ['YELP_TOKEN'],
                                          access_token_secret = os.environ['YELP_TOKEN_SECRET'])
            
            searchParams = {
                    'category_filter': 'foodtrucks',
                    'limit': 20,
                    'bounds': '{0},{1}|{2},{3}'.format(swLat, swLng, neLat, neLng)
                    }
            
            # Optionally pass in the name of the food truck the user is looking for, if at all
            if 'name' in bundle.request.GET and bundle.request.GET['name']:
                searchParams['term'] = bundle.request.GET['name']
            
            response = session.get('http://api.yelp.com/v2/search',params=searchParams)
            parsed_response = response.json()
#             import pickle
#             pickle.dump(parsed_response, open(os.path.dirname(os.path.realpath(__file__)) + '/data/mock_data.p', 'wb')) 
#             parsed_response = pickle.load(open(os.path.dirname(os.path.realpath(__file__)) + '/data/mock_data.p', 'rb'))    


            for foodTruck in parsed_response['businesses']:
                if foodTruck['is_closed'] == False:
                    
                    display_address = "\n".join(foodTruck['location']['display_address'])
                    # Get rid of the Yelp category identifiers
                    categories = ", ".join([x[0] for x in foodTruck['categories']])

                    ftModel = {
                                'name': foodTruck['name'],
                                'display_address': display_address,
                                'url': foodTruck['url'],
                                'categories': categories,
                                'review_count': foodTruck['review_count'],
                                'rating_img_url': foodTruck['rating_img_url'],
                                'rating': foodTruck['rating'],
                                'latitude': foodTruck['location']['coordinate']['latitude'],
                                'longitude': foodTruck['location']['coordinate']['longitude']
                                }
                    foodTrucks.append(FoodTruck(**ftModel))

        return foodTrucks
