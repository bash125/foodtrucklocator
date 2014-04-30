var map_canvas;

beforeEach(function() {
    map_canvas = document.createElement("div");
    map_canvas.id = "map-canvas";
    $(document.body).append(map_canvas);
});

describe('FoodTruck model', function() {

    beforeEach(function() {
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

afterEach(function() {
    $(map_canvas).remove();
    map_canvas = null;
});
