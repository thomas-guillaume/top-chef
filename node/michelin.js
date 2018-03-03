// modules
const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');


if (fs.existsSync('./michelin.json')) {
  fs.truncate('./michelin.json', 0, function() {})
}


let nbpages = -1


request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
}, function(error, response, body) {
  var $ = cheerio.load(body);

	// get the number of pages we have to go through
  $(".mr-pager-link").each(function() {
    var current = $(this);

    if (nbpages < parseInt(current.attr("attr-page-number"))) {
      nbpages = parseInt(current.attr("attr-page-number"));
    }

  });


	// for each page, browse each restaurant
  for (var i = 1; i <= nbpages; i++) {
    request({
      uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-" + i,
    }, function(error, response, body) {
      var $ = cheerio.load(body);
      $('.poi-card-link').each(function(index) {
        var link = $(this);
        let restaurant_link = "https://restaurant.michelin.fr" + link.attr('href');


				// for each restaurant, take the data needed
        request({
          uri: restaurant_link,
        }, function(error, response, body) {
          if (error) return console.log(error);
          var $ = cheerio.load(body);

          var restaurant = {};

          var thoroughfare = $('.poi_intro-display-address .field__items .thoroughfare').text();
          var postalcode = $('.poi_intro-display-address .field__items .postal-code').text();
          var locality = $('.poi_intro-display-address .field__items .locality').text();
          var address = {}
          address['thoroughfare'] = thoroughfare
          address['postalcode'] = postalcode
          address['locality'] = locality

					restaurant['name'] = $('.poi_intro-display-title').text().trim();
					restaurant['stars'] = $('#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper').text().charAt(0);
          restaurant['address'] = address


					// register all the restaurants in a json file
          try {
            fs.appendFile("./michelin.json", JSON.stringify(restaurant) + "\n", function() {});
          } catch (err) {
            console.log(err);
          }
        })
      });
    })
  }
})
