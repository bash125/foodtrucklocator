(function() {
    'use strict';

    var mapView;

    var FoodTruckModel = Backbone.Model.extend({
        urlRoot: '/api/v1/foodtruck/?format=json'
    });

    var FoodTruckView = Backbone.View.extend({
        tagName: "div",
        foodTruckTemplate: _.template($("#foodTruckTemplate").html()),
        initialize: function() {
            this.marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.model.attributes.latitude, this.model.attributes.longitude),
                map: mapView.map,
                title: this.model.attributes.name
            });

            this.marker.infoWindow = new google.maps.InfoWindow({
              content: this.render().el
            });

            google.maps.event.addListener(this.marker, 'click', function () {
                this.model.openInfoWindow(this);
            });
        },
        destroy: function() {
            this.marker.setMap(null);
            this.$el.remove();
        },
        render: function() {
            this.model.attributes.display_address.replace(/\n/g, '<br />');
            this.$el.html(this.foodTruckTemplate(this.model.attributes));
            this.$el.addClass('panel panel-default');
            return this;
        },
        openInfoWindow: function(marker) {
            if (mapView.prevInfoWindow) {
              mapView.prevInfoWindow.close();
            }

            marker.infoWindow.open(mapView.map, marker);
            mapView.prevInfoWindow = marker.infoWindow;
        }
    });

    var FoodTruckCollection = Backbone.Collection.extend({
        model: FoodTruckModel,
        url: '/api/v1/foodtruck/?format=json',
        parse: function(response) {
            return response.objects;
        }
    });

    var FoodTruckCollectionView = Backbone.View.extend({
        el: "#listView",
        initialize: function() {
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);
        },
        render: function() {
            this.$el.empty();
            this.collection.each(function(foodTruck){
              var foodTruckView = new FoodTruckView({ model: foodTruck });
              var listContent = foodTruckView.render().el;

              //Change the list view link to open the info window directly
              $(listContent).find('a').each(function() {
                $(this).click(function() {
                    foodTruckView.openInfoWindow(foodTruckView.marker);
                    return false;
                });
              });

              this.$el.append(listContent); 
            }, this);
            return this;
        }
    });

    var FoodTruckMapView = Backbone.View.extend({
        el: "#map-canvas",

        initialize: function() {
            this.listenTo(this.collection, 'add', this.render);
            this.listenTo(this.collection, 'remove', this.render);

            var mapOptions = {
                //Center on San Francisco
                center : new google.maps.LatLng(37.770999, -122.419404),
                zoom : 14
            };
            this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            var mapViewObj = this;

            //Update the map when a user has finished dragging the map...
            google.maps.event.addListener(this.map, 'dragend', function() {
                mapViewObj.updateMap();
            });

            //..changing the zoom of the map...
            google.maps.event.addListener(this.map, 'zoom_changed', function() {
                mapViewObj.updateMap();
            });

            //..or initially on start-up
            google.maps.event.addListenerOnce(this.map, 'idle', function() {
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
            var boundaries = mapView.map.getBounds();

            var geocoder = new google.maps.Geocoder();
            
            geocoder.geocode( { 'address': address, 'bounds': boundaries }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  mapView.moveMap(results[0].geometry.location);
                  mapView.updateMap(name);
                } else {
                  alert("Error! Try again.");
                }
            }); 

        }
        
    });

    $(document).ready(function() {
        var formView = new FormView();
        var foodTrucks = new FoodTruckCollection();
        var listView = new FoodTruckCollectionView({collection: foodTrucks});
        mapView = new FoodTruckMapView({collection: foodTrucks});
    });

}());