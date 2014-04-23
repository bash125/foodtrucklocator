var mapView;

var FoodTruckModel = Backbone.Model.extend({
    urlRoot: '/api/v1/foodtruck/?format=json'
});

var FoodTruckView = Backbone.View.extend({
    tagName: "div",
    foodTruckTemplate: _.template($("#foodTruckTemplate").html()),
    initialize: function() {
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude')),
            map: mapView.map,
            title: this.model.get('name')
        });

        this.marker.infoWindow = new google.maps.InfoWindow({
          content: this.render().el
        });
        
        //Because we lose the reference to the model, we reference the marker instead
        google.maps.event.addListener(this.marker, 'click', function () {
            if (mapView.prevInfoWindow) {
                mapView.prevInfoWindow.close();
            }

            this.infoWindow.open(mapView.map, this);
            mapView.prevInfoWindow = this.infoWindow;
        });
    },
    destroy: function() {
        this.marker.setMap(null);
    },
    render: function() {
        this.model.set('display_address', this.model.get('display_address').replace(/\n/g, '<br />'));
        this.$el.html(this.foodTruckTemplate(this.model.attributes));
        this.$el.addClass('panel panel-default');
        return this;
    }
});

var FoodTruckCollection = Backbone.Collection.extend({
    model: FoodTruckModel,
    url: '/api/v1/foodtruck/?format=json',
    parse: function(response) {
        return response.objects;
    }
});

var FoodTruckMapView = Backbone.View.extend({
    el: "#map-canvas",

    initialize: function() {
        var mapViewObj = this;
        var mapOptions = {
            zoom : 14
        };
        this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        
        //Use W3C geolocation if available
        if (navigator.geolocation) { 
            navigator.geolocation.getCurrentPosition(function(position) {
                var currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                mapViewObj.map.setCenter(currentLocation);
            });
        } else {
            //Center on San Francisco by default
            this.map.setCenter(new google.maps.LatLng(37.786235, -122.402517));
        }

        //Update the map when a user has finished dragging the map...
        google.maps.event.addListener(this.map, 'dragend', function() {
            mapViewObj.updateMap();
        });

        //..changing the zoom of the map...
        google.maps.event.addListener(this.map, 'zoom_changed', function() {
            mapViewObj.updateMap();
        });

        //..or initially on start-up when the center changes
        google.maps.event.addListenerOnce(this.map, 'center_changed', function() {
            mapViewObj.updateMap();
        });

    },
    updateMap: function(name) {
        var boundaries = this.map.getBounds();

        var searchParams = {
                ne: boundaries.getNorthEast().toString(), 
                sw: boundaries.getSouthWest().toString()
            };

        if (name) {
            searchParams.name = name;
        }

        this.collection.fetch({ 
            data: $.param(searchParams),
            success: function(collection, response, options) {
                
                var name;
                
                //Parse the query string to determine what the name field was
                var urlParams = decodeURIComponent(options.data.replace(/\+/g, " ")).split("&");
                for (var i = 0; i < urlParams.length; i++) {
                    var keyVal = urlParams[i].split("=");
                    if (keyVal[0] === 'name') {
                        name = keyVal[1].toLowerCase();
                    }
                }
                
                //Only select the first result with that search term
                var hasBeenClicked = false;
                
                collection.each(function(foodTruck){
                  var foodTruckView = new FoodTruckView({ model: foodTruck });

                  if (name && !hasBeenClicked && foodTruck.get('name').toLowerCase().indexOf(name) > -1 ) {
                      google.maps.event.trigger(foodTruckView.marker, 'click');
                      hasBeenClicked = true;
                  }
                  
                }, this);
            }
        });
    },
    moveMap: function(latlng) {
        this.map.panTo(latlng);
    }
});

var FormView = Backbone.View.extend({
    el: "#search",
    events: {
        'submit': 'submit'
    },
    submit: function(event) {
        if (event) {
            event.preventDefault();
        } 
        var name = $.trim(this.$el.children().find("input[name='name']").val());
        var address = $.trim(this.$el.children().find("input[name='address']").val());
        
        if (address) {
            var boundaries = mapView.map.getBounds();
            var geocoder = new google.maps.Geocoder();
            
            geocoder.geocode( { 'address': address, 'bounds': boundaries }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  mapView.moveMap(results[0].geometry.location);
                  //Wait until the map center is moved before searching for more food trucks
                  mapView.updateMap(name); 
                } else {
                  alert("Error! Try again.");
                }
            });
        } else {
            mapView.updateMap(name);
        }
        
    }
});

$(document).ready(function() {
    var formView = new FormView();
    var foodTrucks = new FoodTruckCollection();
    mapView = new FoodTruckMapView({collection: foodTrucks});
});