/** @class */
var FoodTruckModel = Backbone.Model.extend(
/** @lends FoodTruckModel.prototype */
{

    urlRoot : '/api/v1/foodtruck/?format=json',
    /**
     * @class FoodTruckModel
     * 
     * @augments Backbone.Model
     * @constructs
     */
    initialize : function() {
        this.markerView = new FoodTruckMarkerView({
            model : this
        });
        this.listItemView = new FoodTruckListItemView({
            model : this
        });
    },
    /**
     * Remove the two views.
     */
    destroy : function() {
        this.markerView.destroy();
        this.listItemView.destroy();
    }
});

/** @class */
var FoodTruckCollection = Backbone.Collection.extend(
/** @lends FoodTruckCollection.prototype */
{

    model : FoodTruckModel,
    /**
     * @class FoodTruckCollection
     * 
     * @augments Backbone.Collection
     * @constructs
     */
    initialize : function() {
        this.bind('remove', this.removeFoodTruck, this);
    },
    /**
     * Removes a FoodTruckModel's marker and list item from the DOM. 
     * @param {FoodTruckModel} model a FoodTruckModel object
     */
    removeFoodTruck : function(model) {
        model.destroy();
    },
    url : '/api/v1/foodtruck/?format=json',
    parse : function(response) {
        return response.objects;
    }
});

/** @class */
var FoodTruckListView = Backbone.View.extend(
/** @lends FoodTruckListView.prototype */
{
    el : "#listView",
    /**
     * @class FoodTruckListView
     * 
     * @augments Backbone.View
     * @constructs
     */
    initialize : function() {
        this.listenTo(this.collection, 'add', this.addListItem);
    },
    /**
     * Add a model's info card to the list view.
     * @param {FoodTruckModel} model a FoodTruckModel object
     */
    addListItem : function(model) {
        this.$el.append(model.listItemView.render().el);
    }
});

/** @class */
var FoodTruckListItemView = Backbone.View.extend(
/** @lends FoodTruckListItemView.prototype */
{
    tagName : "div",
    className : "panel panel-default",
    foodTruckTemplate : _.template($("#foodTruckListItem").html()),
    events : {
        "click a" : "openInfoWindow"
    },
    destroy : function() {
        this.$el.remove();
    },
    /**
     * Renders (but doesn't add) the food truck's info card.
     */
    render : function() {
        this.model.set('display_address', this.model.get('display_address')
                .replace(/\n/g, '<br />'));
        this.$el.html(this.foodTruckTemplate(this.model.attributes));
        return this;
    },
    /**
     * Triggers the marker info window to open by simulating a click event.
     */
    openInfoWindow : function() {
        google.maps.event.trigger(this.model.markerView.marker, 'click');
        return false;
    }
});

/** @class */
var FoodTruckMapView = Backbone.View.extend(
/** @lends FoodTruckMapView.prototype */
{
    el : "#map-canvas",
    /**
     * @class FoodTruckMapView
     * 
     * @augments Backbone.View
     * @constructs
     */
    initialize : function() {
        _.bindAll(this, "addMarkers");
        var mapViewObj = this;
        var mapOptions = {
            zoom : 14
        };
        this.map = new google.maps.Map(this.el, mapOptions);

        // Update the map when a user has finished dragging the map...
        google.maps.event.addListener(this.map, 'dragend', function() {
            mapViewObj.updateMap();
        });

        // ..changing the zoom of the map...
        google.maps.event.addListener(this.map, 'zoom_changed', function() {
            mapViewObj.updateMap();
        });

        // ..or initially on start-up when the center changes
        google.maps.event.addListenerOnce(this.map, 'center_changed',
                function() {
                    mapViewObj.updateMap();
                });

        // Use W3C geolocation if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var currentLocation = new google.maps.LatLng(
                        position.coords.latitude, position.coords.longitude);
                mapViewObj.map.setCenter(currentLocation);
            });
        } else {
            // Center on San Francisco by default
            this.map.setCenter(new google.maps.LatLng(37.786235, -122.402517));
        }

    },
    /**
     * Updates the map by fetching new collection data based on the current map bounds.
     * @param {string} [name] A search string to find food trucks.
     */
    updateMap : function(name) {
        var boundaries = this.map.getBounds();

        var searchParams = {
            ne : boundaries.getNorthEast().toString(),
            sw : boundaries.getSouthWest().toString()
        };

        if (name) {
            searchParams.name = name;
        }

        this.collection.fetch({
            data : $.param(searchParams),
            success : this.addMarkers
        });
    },
    /**
     * Adds food truck markers to the map.
     * @param {FoodTruckCollection} collection The new FoodTruckCollection. 
     * @param {object} response The server's response.
     * @param {object} options The original $.ajax parameter object.
     */
    addMarkers : function(collection, response, options) {

        var name;

        // Parse the query string to determine what the name field was
        var urlParams = decodeURIComponent(options.data.replace(/\+/g, " "))
                .split("&");
        for (var i = 0; i < urlParams.length; i++) {
            var keyVal = urlParams[i].split("=");
            if (keyVal[0] === 'name') {
                name = keyVal[1].toLowerCase();
            }
        }

        // Only select the first result with that search term
        var hasBeenClicked = false;

        collection.each(
                function(foodTruck) {
                    foodTruck.markerView.render(this);
                    if (name
                            && !hasBeenClicked
                            && foodTruck.get('name').toLowerCase()
                                    .indexOf(name) > -1) {
                        google.maps.event.trigger(foodTruck.markerView.marker,
                                'click');
                        hasBeenClicked = true;
                    }
                }, this);
    },
    /**
     * Moves the map to a new location.
     */
    moveMap : function(latlng) {
        this.map.panTo(latlng);
    }
});

/** @class */
var FoodTruckMarkerView = Backbone.View.extend(
/** @lends FoodTruckMarkerView.prototype */
{
    tagName : "div",
    foodTruckTemplate : _.template($("#foodTruckInfoWindow").html()),
    /**
     * Removes the marker from the map.
     */
    destroy : function() {
        this.marker.setMap(null);
    },
    /**
     * Adds the marker and its info window to a FoodTruckMapView object.
     * @param {FoodTruckMapView} mapView a FoodTruckMapView object
     */
    render : function(mapView) {
        this.marker = new google.maps.Marker({
            position : new google.maps.LatLng(this.model.get('latitude'),
                    this.model.get('longitude')),
            map : mapView.map,
            title : this.model.get('name')
        });

        this.marker.infoWindow = new google.maps.InfoWindow({
            content : this.renderInfoWindow().el
        });

        // Because we lose the reference to the model, we reference the marker
        // instead
        google.maps.event.addListener(this.marker, 'click', function() {
            if (mapView.prevInfoWindow) {
                mapView.prevInfoWindow.close();
            }

            this.infoWindow.open(mapView.map, this);
            mapView.prevInfoWindow = this.infoWindow;
        });

    },
    /**
     * Renders the info window content for the marker.
     */
    renderInfoWindow : function() {
        this.model.set('display_address', this.model.get('display_address')
                .replace(/\n/g, '<br />'));
        this.$el.html(this.foodTruckTemplate(this.model.attributes));
        this.$el.addClass('panel panel-default');
        return this;
    }
});

/** @class */
var FormView = Backbone.View.extend(
        /** @lends FormView.prototype */
        {
            el : "#search",
            events : {
                'submit' : 'submit'
            },
            /**
             * Finds food trucks based on a given search string and location.
             */
            submit : function(event) {
                if (event) {
                    event.preventDefault();
                }
                var name = $.trim(this.$el.children()
                        .find("input[name='name']").val());
                var address = $.trim(this.$el.children().find(
                        "input[name='address']").val());

                if (address) {
                    var boundaries = this.model.map.getBounds();
                    var geocoder = new google.maps.Geocoder();
                    var moveAndUpdateMap = function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            this.moveMap(results[0].geometry.location);
                            // Wait until the map center is moved before
                            // searching for more food trucks
                            this.updateMap(name);
                        } else {
                            alert("Error! Try again.");
                        }
                    };
                    moveAndUpdateMap = _.bind(moveAndUpdateMap, this.model);
                    geocoder.geocode({
                        'address' : address,
                        'bounds' : boundaries
                    }, moveAndUpdateMap);
                } else {
                    mapView.updateMap(name);
                }

            }
        });

$(document).ready(function() {
    var foodTrucks = new FoodTruckCollection();
    var listView = new FoodTruckListView({
        collection : foodTrucks
    });
    var mapView = new FoodTruckMapView({
        collection : foodTrucks
    });
    //Although it's not tied to the map view, the Form view requires a reference to the Map view
    var formView = new FormView({
        model : mapView
    });
});