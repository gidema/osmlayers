'use strict';
function osmlConfig(osml) {
  osml.addLayer("amenity=bench", "#ffcc00", "Bench");
  osml.addLayer("amenity=post_box", "#663399", "Post box");
  osml.addLayer("amenity=post_office", "#9e00bc", "Post office");
  osml.addLayer("amenity=pharmacy","red", "Pharmacy");
  osml.addLayer("amenity=toilets", "#0000f4", "Toilets");
  osml.addLayer("amenity=police", "#000089", "Police");
  osml.addLayer(["[amenity=atm]", "[amenity=bank][atm][atm!=no]"], "#ff00cc", "ATM");
  osml.addLayer("amenity=fuel", "#cc3333", "Fuel");
  osml.addLayer(["[amenity=school]", "[amenity=college]"], "#000099", name="School/College");
  osml.addLayer("amenity=university","red", "University");
  osml.addLayer("amenity=bicycle_parking", "#5a87ff", "Bicycle parking");
  osml.addLayer("amenity=bicycle_rental", "#cc0066", "Bicycle rental");
  osml.addLayer("amenity=taxi", "#ff0099", "Taxi");
  osml.addLayer("amenity=parking", "#cc5633", "Parking");
  osml.addLayer("amenity=arts_centre", "#05a333", "Arts centre");
  osml.addLayer("amenity=theatre", "#0553ff", "Theatre");
  osml.addLayer("amenity=cinema", "#16c5df", "Cinema");
  osml.addLayer("tourism=information", "black", "Information");
  osml.addLayer("tourism=museum", "blue", name="Museum");
  osml.addLayer("tourism=artwork", "#663399", "Artwork");
  osml.addLayer("tourism=gallery", "#660033", "Gallery");
  osml.addLayer("tourism=picnic_site", "#ff20d1", "Picnic");
  osml.addLayer("tourism=zoo", "#fdcc00", "Zoo");
  osml.addLayer("tourism=viewpoint", "#cc3366", "Viewpoint");
  osml.addLayer("tourism=attraction", "#1ff1b4", "Attraction");
  osml.addLayer("tourism=hotel", "red", "Hotel");
  osml.addLayer("tourism=apartment", "#9115cc", "Apartment");
  osml.addLayer("tourism=guest_house", "#409400", "Guest house");
  osml.addLayer("tourism=hostel", "#66ff33", "Hostel");
  osml.addLayer("tourism=motel", "blue", "Motel");
  osml.addLayer(["[tourism=camp_site][backcountry!=yes]"], "#ad7d54", "Camp site");
  osml.addLayer(["[tourism=camp_site][backcountry=yes]"], "#eea854", "Camp site (no facilities)");
  osml.addLayer("sport=soccer", "blue", "Soccer");
  osml.addLayer("sport=american_football", "brown", "American football");
  osml.addLayer("leisure=golf_course", "teal", "Golf");
  osml.addLayer("sport=tennis", "#00ff33", "Tennis");
  osml.addLayer("sport=volleybal", "#009633", "Volleybal");
  osml.addLayer("sport=baseball", "#009696", "Baseball");
  osml.addLayer("sport=basketball", "#65a5f3", "Basketball");
  osml.addLayer(["[sport=ice_hockey]", "[leisure=ice_rink]"], "#0000cc", "Ice hockey");
  osml.addLayer(["[sport=hockey]", "[sport=field_hockey]"],  "#ff9696", "Hockey");
  osml.addLayer("sport=cycling", "#0060ff", "Cycling");
  osml.addLayer(["[sport=horse_racing]", "[sport=equestrian]"], "#cc0033", "Horse racing");
  osml.addLayer("sport=swimming", "#650000", "Swimming");
  osml.addLayer("sport=surfing", "#cc7566", "Surfing");
  osml.addLayer("sport=gymnastics", "red", "Gymnastics");
  osml.addLayer("shop=mall", "#69712b", "Mall/Shopping centre");
  osml.addLayer("shop=general", "blue", "General");
  osml.addLayer("shop=department_store","green", "Department store");
  osml.addLayer("shop=clothes", "#ff00ff", "Clothes");
  osml.addLayer("shop=fashion", "blue", "Fashion");
  osml.addLayer("shop=jewelry", "#000066", "Jewelry");
  osml.addLayer("shop=leather", "#ffcc00", "Leather");
  osml.addLayer("shop=shoes", "#b46600", "Shoes");
  osml.addLayer("shop=hairdresser", "#66cc00", "Hairdresser");    
  osml.addLayer("shop=beauty", "#b466bc", "Beauty");
  osml.addLayer("shop=cosmetics", "#b466bc", "Cosmetics");
  osml.addLayer("shop=chemist", "#fa712b", "Chemist");
  osml.addLayer("shop=optician", "#54112b", "Opticien");
  osml.addLayer(["[shop=books]", "[shop=stationery]"], "#110011", "Books/Stationary");
  osml.addLayer("shop=photo", "#0066cc", "Photo");
  osml.addLayer("shop=toys", "#ff9833", "Toys");
  osml.addLayer("shop=gift", "#f03901", "Gift");
  osml.addLayer("shop=bicycle", "#f03901", "Bicycle");
  osml.addLayer("shop=musical_instrument", "green", "Musical instruments");
  // Food layers
  osml.addLayer("amenity=restaurant", "#0064ff", "Restaurant");
  osml.addLayer("amenity=bar", "#FF0033", "Bar");
  osml.addLayer("amenity=cafe", "#000033", "Cafe");
  osml.addLayer("amenity=pub", "#1899ff", "Pub");
  osml.addLayer("amenity=ice_cream", "#ff99ff", "Ice cream");
  osml.addLayer("amenity=fast_food", "#993399", "Fast food");
  osml.addLayer("shop=supermarket", "red", "Supermarket");
  osml.addLayer("shop=bakery", "#dea100", "Bakery");
  osml.addLayer(["[shop=chocolate]", "[shop=confectionery]"], "#663300", "Chocolate/Confectionery");
  osml.addLayer("shop=deli", "#65a5f3", "Deli");
  osml.addLayer("shop=dairy", "#650000", "Dairy");
  osml.addLayer("shop=cheese", "#decd00", "Cheese");
  osml.addLayer("shop=greengrocer","green", "Greengrocer");
  osml.addLayer("shop=grocery", "#ff9900", "Grocery");
  osml.addLayer("shop=butcher","brown", "Butcher");
  osml.addLayer("shop=coffee", "#993366", "Coffee");
  osml.addLayer("shop=seafood", "#00d2ff", "Seafood");
  osml.addLayer("shop=organic", "c35170", "Organic");
  osml.addLayer("amenity=drinking_water", "#0033ff", "Drinking water");
  osml.addLayer("shop=alcohol", "#00e7ff", "Alcohol");
  osml.addLayer("shop=wine", "#c30c70", "Wine");
  osml.addLayer("shop=beverages", "green", "Beverages");
  // Various layers
  // Hierin staan die tags die uit verschillende rubrieken komen die te klein zijn om een eigen tabje in het menu te geven.
  // Een paar winkels staan hier wel tussen. Ze pasten niet goed in mijn rubrieken bij de shoptags    
  osml.addLayer("shop=travel_agency", "#00e7ff", "Travel agency");
  osml.addLayer("shop=copyshop", "#c30c70", "Copy shop");
  osml.addLayer("emergency=defibrillator", "black", "Defibrilator/AED");
  osml.addLayer("emergency=fire_extinguisher","blue", "Fire hose/extinguisher");
  osml.addLayer("historic=memorial", "#ff9966", "Memorial");
  osml.addLayer("historic=monument", "#6b34de", "Monument");
  osml.addLayer("man_made=windmill", "#650000", "Windmill");
  
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
