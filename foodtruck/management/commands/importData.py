import csv
from django.contrib.gis.geos import Point
import urllib.parse, urllib.request, json
from django.core.management.base import BaseCommand, CommandError
from foodtruck.models import FoodTruck
from optparse import make_option

class Command(BaseCommand):
    help = 'Import food truck .csv data into the database'
    
    option_list = (BaseCommand.option_list
        + (make_option("-f", "--filename", type="string"),)
        + (make_option("-k", "--key",type="string"),) )

    def handle(self, *args, **options):
        print(options)
        key = options['key']
         
        with open(options['filename']) as csvfile:
            reader = csv.DictReader(csvfile, delimiter=',')
            # Filter out expired/suspended permits
            valid_permit_status = ['APPROVED', 'REQUESTED', 'ONHOLD', 'ISSUED']
            for row in reader:
                if row['Status'].upper() in valid_permit_status:
                    location = None
                    row['Address'] += ", San Francisco, CA"
                    
                    # Use given lat/long if provided
                    if (row['Latitude'] and row['Longitude']):
                        location = Point(float(row['Latitude']), float(row['Longitude']))
                    # Use the Google Geocoding API if not provided
                    else:     
                        address = urllib.parse.quote_plus(row['Address'])
                        request = "https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}&sensor=false".format(address, key)
                        data = json.loads(urllib.request.urlopen(request).read().decode('utf-8'))
                 
                        if data['status'] == 'OK':
                            lat = data['results'][0]['geometry']['location']['lat']
                            lng = data['results'][0]['geometry']['location']['lng']
                            location = Point(float(lat), float(lng))
                     
                    foodTruck = FoodTruck(name=row['Applicant'], address=row['Address'], location=location)
                    foodTruck.save()
                    self.stdout.write("Saved " + foodTruck.__str__())