describe("FoodTruckCollection", function() {
   var map_canvas;

    beforeEach(function() {
        map_canvas = document.createElement("div");
        map_canvas.id = "map-canvas";
        $(document.body).append(map_canvas);
    });
        
    afterEach(function() {
        $(map_canvas).remove();
        map_canvas = null;
    });
    
    describe("when instantiated with model literal", function() {
     
        beforeEach(function() {
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
        });
    
        it('should have a model', function() {
            expect(this.foodTrucks.length).toEqual(1);
        });
        
        it('should find that model', function() {
            expect(this.foodTrucks.at(0).get("name")).toEqual('Aroy-D, The Thai Elephant Truck');
        });
    
    });
    
    describe('when fetching from an external API', function() {
        beforeEach(function() {
            this.listItemViewStub = sinon.stub(window, "FoodTruckListItemView");
            this.listItemViewStub.returns(new Backbone.View());
        
            this.markerViewStub = sinon.stub(window, "FoodTruckMarkerView");
            this.markerViewStub.returns(new Backbone.View());    
            
            this.foodTrucks = new FoodTruckCollection();
            this.fixture = this.fixtures.FoodTrucks.valid.response;
            this.server = sinon.fakeServer.create();
            this.server.respondWith("GET", "/api/v1/foodtruck/?format=json", this.validResponse(this.fixture));
        });
    
        afterEach(function() {
            this.server.restore();
            this.listItemViewStub.restore();
            this.markerViewStub.restore();
        });
    
        it('should make the correct request', function() {
            this.foodTrucks.fetch();
            expect(this.server.requests.length).toEqual(1);
            expect(this.server.requests[0].method).toEqual("GET");
            expect(this.server.requests[0].url).toEqual("/api/v1/foodtruck/?format=json");
        });
        
        it('should parse the correct response', function() {
            this.foodTrucks.fetch();
            this.server.respond();
            expect(this.foodTrucks.length).toEqual(this.fixture.objects.length);
            expect(this.foodTrucks.at(0).get('name')).toEqual(this.fixture.objects[0].name);
        });
    
    });
 
});