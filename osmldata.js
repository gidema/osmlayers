'use strict';
load("api/jquery-1.11.2.min.js");

var osml = {
  addLayerGroup: function(name, layers) {
    var i;
    for (i=0; i<layers.length; i++) {
      print('"' + name + '","' + layers[i] + '"');
    }
  }
}
osmlConfig(); 

function osmlConfig() {
  osml.addLayerGroup("amenity", ["Bench", "Post box", "Post office", "Pharmacy", "Toilets", "Police", "ATM", "Fuel", "School/College", "University",
    "Bicycle parking", "Bicycle rental", "Taxi", "Parking", "Arts centre", "Theatre", "Cinema"]);
  osml.addLayerGroup("tourism", ["Information", "Museum", "Artwork", "Gallery", "Picnic", "Zoo", "Viewpoint", "Attraction", 
    "Hotel", "Apartment", "Guest house", "Hostel", "Motel", "Camp site", "Camp site (no facilities)"]);
  osml.addLayerGroup("sport", ["Soccer", "American football", "Golf", "Tennis", "Volleybal", "Baseball", "Basketball",
    "Ice hockey", "Hockey", "Cycling", "Horse racing", "Swimming", "Surfing", "Gymnastics"]);
  osml.addLayerGroup("shop", ["Supermarket", "Mall/Shopping centre", "General", "Department store", "Clothes", "Fashion", "Jewelry", "Leather",
    "Shoes", "Hairdresser", "Beauty", "Cosmetics", "Chemist", "Opticien", "Books/Stationary", "Photo", "Toys", "Gift",
    "Bicycle", "Musical instruments"]); 
  osml.addLayerGroup("food", ["Restaurant", "Bar", "Cafe", "Pub", "Ice cream", "Fast food", "Supermarket", "Bakery", "Chocolate/Confectionery", "Deli", "Dairy",
    "Cheese", "Greengrocer", "Grocery", "Butcher", "Coffee", "Seafood", "Organic", "Drinking water", "Alcohol", "Wine", "Beverages"]);  
  osml.addLayerGroup("various", ["Travel agency", "Copy shop", "Defibrilator/AED", "Fire hose/extinguisher", "Memorial", "Monument", "Windmill"]);
}
