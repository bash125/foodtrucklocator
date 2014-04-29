function createMap() {
    var map_canvas = document.createElement("div");
    map_canvas.id = "map-canvas";
    $(document.body).append(map_canvas);
    return map_canvas;
}

describe('FoodTruck model', function() {

    var map_canvas;

    beforeEach(function() {
        map_canvas = createMap();

        this.foodTruck = new FoodTruckModel({
            review_count : 27,
            display_address : 'Hoboken, NJ 07030',
            latitude : 40.753141,
            name : 'Aroy-D, The Thai Elephant Truck',
            categories : 'Food Trucks, Thai',
            url : 'http://www.yelp.com/biz/aroy-d-the-thai-elephant-truck-hoboken',
            rating : 4.0,
            longitude : -74.025085,
            rating_img_url : 'http://s3-media4.ak.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png'
        });

    });

    afterEach(function() {
        $(map_canvas).remove();
        map_canvas = null;
    });

    describe('when instantiated', function() {
        it('should have the correct attributes', function() {
            expect(this.foodTruck.get('name')).toEqual('Aroy-D, The Thai Elephant Truck');
            expect(this.foodTruck.url()).toEqual('/api/v1/foodtruck/?format=json');
        });
        it('should have views instantiated', function() {
            expect(this.foodTruck.listView);
            expect(this.foodTruck.markerView);
        });

    });

});

describe('FoodTruck collection', function() {

    var map_canvas;

    beforeEach(function() {
        map_canvas = createMap();
        this.fixture = this.fixtures.FoodTrucks.valid;
        this.server = sinon.fakeServer.create();
        this.server.respondWith("GET", "/api/v1/foodtruck/?format=json", this.validResponse(this.fixture));

        this.foodTruckStub = sinon.stub(window, "FoodTruckModel");
        this.model = new Backbone.Model({
            review_count : 27,
            display_address : 'Hoboken, NJ 07030',
            latitude : 40.753141,
            name : 'Aroy-D, The Thai Elephant Truck',
            categories : 'Food Trucks, Thai',
            url : 'http://www.yelp.com/biz/aroy-d-the-thai-elephant-truck-hoboken',
            rating : 4.0,
            longitude : -74.025085,
            rating_img_url : 'http://s3-media4.ak.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png'
        });
        this.foodTruckStub.returns(this.model);

        this.foodTrucks = new FoodTruckCollection();
        this.foodTrucks.model = FoodTruckModel;

        this.foodTrucks.add({
            review_count : 27,
            display_address : 'Hoboken, NJ 07030',
            latitude : 40.753141,
            name : 'Aroy-D, The Thai Elephant Truck',
            categories : 'Food Trucks, Thai',
            url : 'http://www.yelp.com/biz/aroy-d-the-thai-elephant-truck-hoboken',
            rating : 4.0,
            longitude : -74.025085,
            rating_img_url : 'http://s3-media4.ak.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png'
        });

    });

    afterEach(function() {
        this.foodTruckStub.restore();
        this.server.restore();
        $(map_canvas).remove();
        map_canvas = null;
    });

    describe('when instantiated', function() {
        it('should have a model', function() {
            expect(this.foodTrucks.length).toEqual(1);
        });

        it('should make the correct request', function() {
            this.foodTrucks.fetch();
            expect(this.server.requests.length).toEqual(1);
            expect(this.server.requests[0].method).toEqual("GET");
            expect(this.server.requests[0].url).toEqual("/api/v1/foodtruck/?format=json");
        });

    });

});
