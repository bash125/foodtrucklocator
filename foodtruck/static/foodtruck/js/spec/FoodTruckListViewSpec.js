describe("FoodTruckListView", function() {
    beforeEach(function() {
        setFixtures('<div id="listView"></div>');
        
        this.collection = new Backbone.Collection();
        this.view = new FoodTruckListView({
            collection: this.collection
        });
        
    });

    describe("Instantiation", function() {
        it("should create a div element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });
        it("should have the right id", function() {
            expect(this.view.el.id).toEqual("listView");
        });
    });
    
    describe("Collection addition", function() {
        
        it("should append new models", function() {
            var foodTrucks = this.fixtures.FoodTrucks.valid.response.objects;
            for (var i = 0; i < foodTrucks.length; i++) {
                //Mock a simple fake object
                var model = new Backbone.Model(foodTrucks[i]);
                model.listView = {
                    render: function() {
                        this.el = document.createElement('div');
                        return this;
                    }
                };
                this.collection.add(model);
                expect($('#listView').children().length).toEqual(i+1); 
            }    
        });
        
    });

}); 