beforeEach(function() {

    this.validResponse = function(responseText) {
        return [200, {
            "Content-Type" : "application/json"
        }, JSON.stringify(responseText)];
    };
    setFixtures('<div id="map-canvas"></div>');
    navigator.geolocation = false;
  
}); 

afterEach(function() {
    navigator.geolocation = true;
});
