var map;
var prevInfoWindow;

function initialize() {
    var mapOptions = {
        //Center on San Francisco
        center : new google.maps.LatLng(37.770999, -122.419404),
        zoom : 14
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    google.maps.event.addListener(map, 'dragend', function() {
        updateMap(map);
    });

    google.maps.event.addListener(map, 'zoom_changed', function() {
        updateMap(map);
    });

    google.maps.event.addListener(map, 'center_changed', function() {
        updateMap(map);
    });

}

function adjustBootstrappedData(foodTrucks) {

    for (var i = 0; i < foodTrucks.length; i++) {
        var keys = Object.keys(foodTrucks[i].fields);

        for (var j = 0; j < keys.length; j++) {
            foodTrucks[i][keys[j]] = foodTrucks[i]['fields'][keys[j]];
        }
        delete(foodTrucks[i].fields);
    }

    return foodTrucks;
}

function addMarkers(foodTrucks) {
   
    for (var i = 0; i < foodTrucks.length; i++) {
        
        var coord = foodTrucks[i].location.match(/[0-9-.]+/g).map(parseFloat);
        
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coord[1], coord[0]),
            map: map,
            title: foodTrucks[i].name
        });
        
        marker.infoWindow = new google.maps.InfoWindow({
          content: '<h2>' + foodTrucks[i].name + '</h2>'
        });

        google.maps.event.addListener(marker, 'click', function() {
              if (prevInfoWindow) {
                  prevInfoWindow.close();
              }
              
              this.infoWindow.open(map,this);
              prevInfoWindow = this.infoWindow;
        });
    }

}

function updateMap(map) {
    var boundaries = map.getBounds();
    var foodTrucks = new FoodTruckCollection;
    foodTrucks.fetch({ 
        data: $.param({ ne: boundaries.getNorthEast().toString(), sw: boundaries.getSouthWest().toString()}),
        success: function(model, response, options) {
            addMarkers(response.objects);
        }
    });
    
}

var FoodTruckModel = Backbone.Model.extend({
    urlRoot: '/api/v1/foodtruck/?format=json'
});

var FoodTruckCollection = Backbone.Collection.extend({
    model: FoodTruckModel,
    url: '/api/v1/foodtruck/?format=json'
});

var FormView = Backbone.View.extend({
    el: "#search",
    events: {
        'submit': 'submit'
    },
    initialize: function() {
        _.bindAll(this, 'submit');
    },
    submit: function(event) {
        event && event.preventDefault();

        var address = $.trim($(this.el).children().find("input[name='address']").val());
        var boundaries = map.getBounds();

        var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode( { 'address': address, 'bounds': boundaries }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              latlng = results[0].geometry.location;
              map.panTo(latlng);
            } else {
              alert("Error! Try again.");
            }
        }); 

    }
    
});

$(document).ready(function() {

    var formView = new FormView();
    initialize();
    
});
