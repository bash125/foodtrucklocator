function initialize() {
    var mapOptions = {
        center : new google.maps.LatLng(37.770999, -122.419404),
        zoom : 14
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize); 