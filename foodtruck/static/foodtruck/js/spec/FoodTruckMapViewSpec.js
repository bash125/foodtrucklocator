describe("FoodTruckMapView", function() {
    beforeEach(function() {
        this.googleMapStub = sinon.stub(google.maps, "Map");
        this.googleMap = {
            panTo: function() { return true; },
            getBounds: function() {              
                return {
                    getNorthEast: function() {
                        return {
                            toString: function() {
                                return "(40.78255640680479, -73.9553936880859)";
                            }
                        };
                    },
                    getSouthWest: function() {
                        return {
                            toString: function() {
                                return "(40.75005321896782, -74.02817811191403)";
                            }                         
                        };
                    }                   
                };
            }
        };
        this.panToSpy = sinon.spy(this.googleMap, "panTo");
        
        this.googleMapStub.returns(this.googleMap);
        
        this.collection = new Backbone.Collection();
        this.collection.url = "/test";
        this.view = new FoodTruckMapView({
            collection: this.collection
        });
        
    });
    
    afterEach(function() {
        this.googleMapStub.restore();
        this.panToSpy.restore();
    });

    describe("Instantiation", function() {
        it("should create a div element", function() {
            expect(this.view.el.nodeName).toEqual("DIV");
        });
        it("should have the right id", function() {
            expect(this.view.el.id).toEqual("map-canvas");
        });
    });
    
    describe("Moving the map", function() {
        beforeEach(function() {
            this.view.moveMap();
        });
        
        it("should call the correct method", function() {
            expect(this.panToSpy.calledOnce).toBeTruthy();
        });
    });
    
    describe("Updating the map", function() {

        beforeEach(function() {
            this.fetchStub = sinon.stub(this.collection, "fetch");
            this.fetchStub.returns(true);      
        });
        
        describe("without a name argument", function() {
            it("should pass the correct params", function() {
                this.view.updateMap();
                expect(this.fetchStub.args[0][0].data).toEqual(
                    $.param({
                        ne: "(40.78255640680479, -73.9553936880859)",
                        sw: "(40.75005321896782, -74.02817811191403)"
                }));
            });
        });
        
        describe("with a name argument", function() {
            it("should pass the correct params", function() {
                this.view.updateMap("thai");
                expect(this.fetchStub.args[0][0].data).toEqual(
                    $.param({
                        ne: "(40.78255640680479, -73.9553936880859)",
                        sw: "(40.75005321896782, -74.02817811191403)",
                        name: "thai"
                }));
            });
        });
    });
    
    describe("Adding new markers", function() {
        
        beforeEach(function() {
            this.markerSpy = sinon.spy(google.maps, "Marker");
            var fakeCollection = new Backbone.Collection();
            this.foodTrucks = this.fixtures.FoodTrucks.valid.response.objects;
            for (var i = 0; i < this.foodTrucks.length; i++) {
                //Mock a simple fake object
                var model = new Backbone.Model(this.foodTrucks[i]);
                model.markerView = {
                    render: function() {
                        this.marker = new google.maps.Marker();
                        return this;
                    }
                };
                fakeCollection.add(model);
            }    
            
            var fakeOptions = {
                data: "ne=(40.78255640680479%2C+-73.9553936880859)&sw=(40.75005321896782%2C+-74.02817811191403)"
            };
            this.view.addMarkers(fakeCollection, null, fakeOptions);
        });
        
        afterEach(function() {
            this.markerSpy.restore();
        });
        
        it("should add new markers", function() {
            expect(this.markerSpy.callCount).toEqual(this.foodTrucks.length);
        });
    
    });

}); 