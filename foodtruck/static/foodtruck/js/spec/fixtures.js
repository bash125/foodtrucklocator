beforeEach(function() {

    this.fixtures = {

        FoodTrucks : {
            valid : {
                "status" : "OK",
                "version" : "1.0",
                "response" : {
                    "meta" : {
                        "limit" : 5,
                        "next" : null,
                        "offset" : 0,
                        "previous" : null,
                        "total_count" : 5
                    },
                    "objects" : [{
                        "categories" : "Food Trucks, Vegan",
                        "display_address" : "Midtown West\nNew York, NY 10001",
                        "latitude" : 40.750804901123,
                        "longitude" : -73.996643066406,
                        "name" : "The Cinnamon Snail",
                        "rating" : 4.5,
                        "rating_img_url" : "http:\/\/s3-media2.ak.yelpcdn.com\/assets\/2\/www\/img\/99493c12711e\/ico\/stars\/v1\/stars_4_half.png",
                        "resource_uri" : "",
                        "review_count" : 639,
                        "url" : "http:\/\/www.yelp.com\/biz\/the-cinnamon-snail-new-york-2"
                    }, {
                        "categories" : "Food Trucks",
                        "display_address" : "Park Ave & 51 St\nMidtown East\nNew York, NY 10022",
                        "latitude" : 40.7578418,
                        "longitude" : -73.9736032,
                        "name" : "Uncle Gussy's",
                        "rating" : 4.5,
                        "rating_img_url" : "http:\/\/s3-media2.ak.yelpcdn.com\/assets\/2\/www\/img\/99493c12711e\/ico\/stars\/v1\/stars_4_half.png",
                        "resource_uri" : "",
                        "review_count" : 176,
                        "url" : "http:\/\/www.yelp.com\/biz\/uncle-gussys-new-york"
                    }, {
                        "categories" : "Food Trucks, Korean",
                        "display_address" : "55th and Broadway\nMidtown West\nNew York, NY 10001",
                        "latitude" : 40.7647606,
                        "longitude" : -73.9822488,
                        "name" : "Korilla BBQ",
                        "rating" : 4,
                        "rating_img_url" : "http:\/\/s3-media4.ak.yelpcdn.com\/assets\/2\/www\/img\/c2f3dd9799a5\/ico\/stars\/v1\/stars_4.png",
                        "resource_uri" : "",
                        "review_count" : 419,
                        "url" : "http:\/\/www.yelp.com\/biz\/korilla-bbq-new-york"
                    }, {
                        "categories" : "Food Trucks, Mexican",
                        "display_address" : "Ditmars & 31st\nMidtown West\nAstoria, NY 11106",
                        "latitude" : 40.757415964851,
                        "longitude" : -73.981419656143,
                        "name" : "M\u00e9xico Blvd",
                        "rating" : 4,
                        "rating_img_url" : "http:\/\/s3-media4.ak.yelpcdn.com\/assets\/2\/www\/img\/c2f3dd9799a5\/ico\/stars\/v1\/stars_4.png",
                        "resource_uri" : "",
                        "review_count" : 51,
                        "url" : "http:\/\/www.yelp.com\/biz\/m%C3%A9xico-blvd-astoria"
                    }, {
                        "categories" : "Food Trucks, Polish",
                        "display_address" : "51st St, 6th And 7th Ave\nTheater District\nNew York, NY 10020",
                        "latitude" : 40.761805,
                        "longitude" : -73.982676,
                        "name" : "Old Traditional Polish Cuisine",
                        "rating" : 4,
                        "rating_img_url" : "http:\/\/s3-media4.ak.yelpcdn.com\/assets\/2\/www\/img\/c2f3dd9799a5\/ico\/stars\/v1\/stars_4.png",
                        "resource_uri" : "",
                        "review_count" : 20,
                        "url" : "http:\/\/www.yelp.com\/biz\/old-traditional-polish-cuisine-new-york"
                    }]
                }
            }
        }

    };

});
