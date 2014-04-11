from django.shortcuts import render
from foodtruck.models import FoodTruck
from django.contrib.gis.measure import D
from django.contrib.gis.geos import Point
from django.core import serializers

def index(request):
    origin = Point(-122.419404, 37.770999)
    distance = 0.5
    nearby_foodtrucks = FoodTruck.objects.filter(location__distance_lte=(origin, D(mi=distance)))
    nearby_foodtrucks = serializers.serialize('json', nearby_foodtrucks, fields=('name','address', 'id', 'location'))

    context = {'nearby_foodtrucks': nearby_foodtrucks}
    return render(request, 'foodtruck/index.html', context)