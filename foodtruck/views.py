from django.shortcuts import render
from foodtruck.models import FoodTruck

# Create your views here.
def index(request):
    return render(request, 'foodtruck/index.html')