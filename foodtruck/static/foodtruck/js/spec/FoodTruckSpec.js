function createMap() {
    var map_canvas = map_canvas = document.createElement("div");
    map_canvas.id = "map-canvas";
    $(document.body).append(map_canvas);
    return map_canvas;
}

describe('FoodTruck model', function() {
    
    var map_canvas;
    
    beforeEach(function() {
        map_canvas = createMap();
        
        this.foodTruck = new FoodTruckModel({
            display_address: "432 Octavia St\n(b/t Linden St & Fell St)\nHayes Valley\nSan Francisco, CA 94102",
            latitude: 37.7763714,
            longitude: -122.4242157,
            name: "Juice Shop Truck",
            rating: 4.5,
            rating_img_url: "http://s3-media2.ak.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png",
            review_count: 30,
            url: "http://www.yelp.com/biz/juice-shop-truck-san-francisco"
        });
    });
    
    afterEach(function() {
       $(map_canvas).remove(); 
    });
    
    describe('when instantiated', function() {
        it('should have the correct attributes', function() {
            expect(this.foodTruck.get('name')).toEqual('Grilled Cheesus');
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
        this.foodTruckStub = sinon.stub(window, "FoodTruckModel");
        this.model = new Backbone.Model({
            display_address: "432 Octavia St\n(b/t Linden St & Fell St)\nHayes Valley\nSan Francisco, CA 94102",
            latitude: 37.7763714,
            longitude: -122.4242157,
            name: "Juice Shop Truck",
            rating: 4.5,
            rating_img_url: "http://s3-media2.ak.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png",
            review_count: 30,
            url: "http://www.yelp.com/biz/juice-shop-truck-san-francisco"
        });
        this.foodTruckStub.returns(this.model);
        
        this.foodTrucks = new FoodTruckCollection();
        this.foodTrucks.model = FoodTruckModel;
        
        this.foodTrucks.add({
            display_address: "432 Octavia St\n(b/t Linden St & Fell St)\nHayes Valley\nSan Francisco, CA 94102",
            latitude: 37.7763714,
            longitude: -122.4242157,
            name: "Juice Shop Truck",
            rating: 4.5,
            rating_img_url: "http://s3-media2.ak.yelpcdn.com/assets/2/www/img/99493c12711e/ico/stars/v1/stars_4_half.png",
            review_count: 30,
            url: "http://www.yelp.com/biz/juice-shop-truck-san-francisco"
        });
    });
    
    afterEach(function() {
        this.foodTruckStub.restore();
        $(map_canvas).remove(); 
    });
    
    describe('when instantiated', function() {
        it('should have a model', function() {
            expect(this.foodTrucks.length).toEqual(1);
        });
    });
    
});
