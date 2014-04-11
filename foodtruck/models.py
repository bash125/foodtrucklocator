from django.contrib.gis.db import models

class FoodTruck(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    location = models.PointField(default=None, blank=True, null=True)
    
    objects = models.GeoManager()
    
    def __str__(self):
        return self.name