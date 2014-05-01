beforeEach(function() {

    this.validResponse = function(responseText) {
        return [200, {
            "Content-Type" : "application/json"
        }, JSON.stringify(responseText)];
    };
    setFixtures('<div id="map-canvas"></div>');
    this.mapViewStub = sinon.stub(window, "FoodTruckMapView");
    this.mapViewStub.returns(new Backbone.View());

}); 

afterEach(function() {
    this.mapViewStub.restore();
});
