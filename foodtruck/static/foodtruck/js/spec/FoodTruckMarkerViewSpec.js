describe("FoodTruckMarkerView", function() {
    beforeEach(function() {
                   
        this.googleMarkerStub = sinon.stub(google.maps, "Marker");
        this.googleMarker = new Backbone.Model({
            title: 'Aroy-D, The Thai Elephant Truck'
         });
        
        this.googleMarkerStub.returns(this.googleMarker);
        
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
        this.view = new FoodTruckMarkerView({
            model : this.model
        });
         
        this.mapView = {
            map: function () { 
                return true;
            }
        };
            
        this.view.render(this.mapView);

    });
    
    afterEach(function() {
        this.googleMarkerStub.restore();
    });

    describe("Template", function() {
        
        it("has the correct URL" , function() {
            expect(this.view.$el.find('a')).toHaveAttr('href', 'http://www.yelp.com/biz/aroy-d-the-thai-elephant-truck-hoboken');
        });
        
        it("has the correct heading" , function() {
            expect(this.view.$el.find('a')).toHaveText('Aroy-D, The Thai Elephant Truck');
        });
        
        it("has the correct number of stars" , function() {
            expect(this.view.$el.find('img')).toHaveAttr('src', 
            'http://s3-media4.ak.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png');
        });

    });
    
    describe("Marker", function() {
        beforeEach(function() {
            this.googleInfoWindowStub = sinon.stub(google.maps, "InfoWindow");
            this.googleInfoWindow = {
                content: this.view.el
            };       
            this.googleInfoWindowStub.returns(this.googleMarker);
        });
        afterEach(function() {
            this.googleInfoWindowStub.restore();
        });
        
        it("has an info window object with the correct data", function() {
            expect(this.view.marker.infoWindow.content).toEqual(this.view.el);
        });

    });

}); 