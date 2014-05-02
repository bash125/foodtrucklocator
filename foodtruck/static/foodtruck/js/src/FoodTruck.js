var FoodTruckModel = Backbone.Model.extend({
    urlRoot: '/api/v1/foodtruck/?format=json',
    initialize: function() {
        this.markerView = new FoodTruckMarkerView({model: this});
        this.listView = new FoodTruckListItemView({model: this});
    },
    destroy: function() {
        this.markerView.destroy();
        this.listView.destroy();
    },
    //When the model is removed from the collection, destroy it as well
    remove: function() {
        this.destroy();
    }
    
});

var FoodTruckCollection = Backbone.Collection.extend({
    model: FoodTruckModel,
    url: '/api/v1/foodtruck/?format=json',
    parse: function(response) {
        return response.objects;
    }
});
var FoodTruckListView = Backbone.View.extend({
    el: "#listView",
    initialize : function () {
        this.listenTo(this.collection, 'add', this.addListItem);
    },
    addListItem: function(model) {
        this.$el.append(model.listView.render().el);
    }
});

//List view is in charge of adding itself to the div items on the right
var FoodTruckListItemView = Backbone.View.extend({
    tagName: "div",
    className: "panel panel-default",
    foodTruckTemplate: _.template($("#foodTruckListItem").html()),
    events: {
        "click a": "openInfoWindow"
    },
    initialize: function() {
    },
    destroy: function() {
        this.$el.remove();
    },
    render: function() {
        this.model.set('display_address', this.model.get('display_address').replace(/\n/g, '<br />'));
        this.$el.html(this.foodTruckTemplate(this.model.attributes));
        return this;
    },
    openInfoWindow: function() {
        google.maps.event.trigger(this.model.markerView.marker, 'click');
        return false;
    }
});

var FoodTruckMapView = Backbone.View.extend({
    el: "#map-canvas",

    initialize: function() {
        _.bindAll(this, "addMarkers");
        var mapViewObj = this;
        var mapOptions = {
            zoom : 14
        };
        this.map = new google.maps.Map(this.el, mapOptions);

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
            success: this.addMarkers
        });
    },
    addMarkers: function(collection, response, options) {
                
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
            foodTruck.markerView.render(this);
            if (name && !hasBeenClicked && foodTruck.get('name').toLowerCase().indexOf(name) > -1 ) {
                  google.maps.event.trigger(foodTruck.markerView.marker, 'click');
                  hasBeenClicked = true;
            }
        }, this);
    },
    moveMap: function(latlng) {
        this.map.panTo(latlng);
    }
});

var FoodTruckMarkerView = Backbone.View.extend({
    tagName: "div",
    foodTruckTemplate: _.template($("#foodTruckInfoWindow").html()),
    destroy: function() {
        this.marker.setMap(null);
    },
    render: function(mapView) {
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude')),
            map: mapView.map,
            title: this.model.get('name')
        });

        this.marker.infoWindow = new google.maps.InfoWindow({
          content: this.renderInfoWindow().el
        });
        
        //Because we lose the reference to the model, we reference the marker instead
        google.maps.event.addListener(this.marker, 'click', function() {
            if (mapView.prevInfoWindow) {
                mapView.prevInfoWindow.close();
            }

            this.infoWindow.open(mapView.map, this);
            mapView.prevInfoWindow = this.infoWindow;
        });
        
    },
    renderInfoWindow: function() {
        this.model.set('display_address', this.model.get('display_address').replace(/\n/g, '<br />'));
        this.$el.html(this.foodTruckTemplate(this.model.attributes));
        this.$el.addClass('panel panel-default');
        return this;
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
            var boundaries = this.model.map.getBounds();
            var geocoder = new google.maps.Geocoder();
            var moveAndUpdateMap = function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  this.moveMap(results[0].geometry.location);
                  //Wait until the map center is moved before searching for more food trucks
                  this.updateMap(name); 
                } else {
                  alert("Error! Try again.");
                }
            };
            moveAndUpdateMap = _.bind(moveAndUpdateMap, this.model);
            geocoder.geocode( { 'address': address, 'bounds': boundaries }, moveAndUpdateMap);
        } else {
            mapView.updateMap(name);
        }
        
    }
});

$(document).ready(function() {
    var foodTrucks = new FoodTruckCollection();
    var listView = new FoodTruckListView({collection: foodTrucks});
    var mapView = new FoodTruckMapView({collection: foodTrucks});
    //Although it's not tied to the map view, the Form view requires a reference to the Map view
    var formView = new FormView({model: mapView});
});