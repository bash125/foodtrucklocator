describe("FoodTruckMarkerView", function() {
    beforeEach(function() {
        
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

    });
    
    afterEach(function() {
        this.mapViewStub.restore();
    });

    describe("Instantiation", function() {
        it("should create a div element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });

        it("should have the right classes", function() {
            expect(this.view.$el.hasClass("panel")).toBeTruthy();
            expect(this.view.$el.hasClass("panel-default")).toBeTruthy();
        });

        it("returns the view object", function() {
            expect(this.view.render()).toEqual(this.view);
        });
    });

    describe("Template", function() {
        beforeEach(function() {
            $('#listView').append(this.view.render().el);
        });
        
        it("has the correct URL" , function() {
            expect($('#listView').find('a')).toHaveAttr('href', '#');
        });
        
        it("has the correct heading" , function() {
            expect($('#listView').find('a')).toHaveText('Aroy-D, The Thai Elephant Truck');
        });
        
        it("has the correct number of stars" , function() {
            expect($('#listView').find('img')).toHaveAttr('src', 
            'http://s3-media4.ak.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png');
        });

    });

}); 