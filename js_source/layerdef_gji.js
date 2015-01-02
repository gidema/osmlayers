// Layerdefinities Marc Zoutendijk
// Met dank aan @ligfietser

// Deze versie in gebruik vanaf Beta 0.02
// Gewijzigde layout van keuzematrix met 6 keuzen.
// 
//versie donderdag 11 december 2014 
// ====================
// bevat de query strings voor de Overpass API voor de verschillende lagen
//
// De variabelen:
//<URL> string 'url', Voor hulp bij deze variabelen moet je de volgende wikipagina's hebben:

//http://wiki.openstreetmap.org/wiki/Overpass_API
//http://wiki.openstreetmap.org/wiki/Overpass_turbo
//http://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide
//http://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL
//http://wiki.openstreetmap.org/wiki/Overpass_API/FAQ#Language

 
//<color>: string '#RGB',            Dit is de kleur waarmee de gekozen tag wordt getekend
//<name>: string '[imagetype]tekst',     Afbeelding en tekst die gebruikt worden voor deze tag
//<lijnbreedte>[.cirkelradius]: int/float,   dikte van de lijn en diameter cirkel
//<zichtbaarheid> : boolean,         Als deze false is, hoef je de volgende niet op te geven. Weet niet waarvoor het is.
//[lijntpye][transparantie] :string '[aan uit (aan uit ( ...))][@transparantie]'


// Onderstaande codes worden in noordpass.js verwerkt.

// imagetype: #l# = lijn, #dl#=dubbele lijn, #d# = stippellijn, #c#= transparant, #co# = cirkel opaque met cijfers
// aan/uit = pixellengte van de lijn, zichtbare lijn-open gedeelte
// transparantie = 0-1 transparantie van de lijn
//

// Hieronder het model om voor één tag, alle mogelijkheden te vinden
// Wijzig de [tag=*] en de kleurcode

//  new LayerDef( ,"tag=*](bbox);node[tag=*](bbox);rel[tag=*](bbox));(._;>;);out;","#000000",name="#l#TAG", 2.7, false),

//=====================

//Sjabloon om een nieuwe laag te maken

//     if (type == "XXXX"){
//       map.addLayers([
//       
//      hier komt de make_layer code
//       
//       ]);
//     }

/* Create an LayerDef type */
function LayerDef(name, filter, color, type) {
  this.name = name;
  this.color = color;
  this.type = type;
  if (filter.substring(0, 1) == "(") {
    this.query = filter + ";(._;>;);out;";
  }
  else {
    this.query = this.createQuery(filter);
  }
}
LayerDef.prototype.createQuery = function(filter) {
  var query = "(";
  $.each(filter.split(";"), function(index, value) {
    query += "node[" + value + "](bbox);way[" + value + "](bbox);rel[" + value + "](bbox);";
  });
  return query + ");(._;>;);out;"
}
LayerDef.prototype.getNameHtml = function() {
  if (this.type == undefined) {
    return this.getName;
  }
  var img;
  switch (this.type) {
    case "line":
      return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/line.gif">&nbsp' + this.name;
    case "lineline":
      return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/lineline.gif">&nbsp' + this.name;
    case "dots":
      return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/dots.gif">&nbsp' + this.name;
    case "circle":
      return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/tcircle-geel.gif">&nbsp' + this.name;
   } 
} 
    
function layerGroups() {
  var groups = [
    { name: "amenity",
      layers: [
        new LayerDef("Bench", "amenity=bench","#ffcc00", "circle"),
        new LayerDef("Post box", "amenity=post_box","#663399", "circle"),
        new LayerDef("Post office", "amenity=post_office","#9e00bc", "circle"),
        new LayerDef("Pharmacy", "amenity=pharmacy","red", "circle"),
        new LayerDef("Toilets", "amenity=toilets","#0000f4", "circle"),
        new LayerDef("Police", "amenity=police","#000089", "circle"),
        new LayerDef("ATM", "(node[amenity=atm](bbox);way[amenity=bank][atm][atm!=no](bbox);node[amenity=bank][atm][atm!=no](bbox))",
          "#ff00cc", "circle"),
        new LayerDef("fuel", "amenity=fuel","#cc3333", "circle"),
        new LayerDef("school/college", "amenity=school;building=school","#000099", "circle"),
        new LayerDef("Bicycle rental", "amenity=bicycle_rental","#cc0066","circle"),
        new LayerDef("Taxi", "amenity=taxi","#ff0099", "circle"),
        new LayerDef("Parking", "amenity=parking","#cc5633","circle"),
        //Entertainment      
        new LayerDef("Arts centre", "amenity=arts_centre","#05a333","circle"),
        new LayerDef("Theatre", "amenity=theatre","#0553ff","circle"),
        new LayerDef("Cinema","amenity=cinema","#16c5df","circle")
    ]},
    { name: "tourism",
      layers: [
        new LayerDef("Information","tourism=information","black",name="#c#information", 2.7, false),
        new LayerDef("Museum" ,"tourism=museum", "blue", name="#l#museum", 2.7, false),
        new LayerDef("Art work","tourism=artwork","#663399",name="#c#artwork", 2.7, false),
        new LayerDef("Gallery","tourism=gallery","#660033",name="#c#gallery", 2.7, false),
        new LayerDef("Pinnic","tourism=picnic_site","#ff20d1",name="#c#picnic", 2.7, false),
        new LayerDef("Zoo","tourism=zoo","#fdcc00",name="#c#ZOO", 2.7, false),
        new LayerDef("Viewpoint","tourism=viewpoint","#cc3366",name="#c#viewpoint", 2.7, false),
        new LayerDef("Attraction","tourism=attraction","#1ff1b4",name="#c#attraction<hr>Accommodation", 2.7, false),
      //hotels
        new LayerDef("Hotel","tourism=hotel","red",name="#l#Hotel", 2.7, false),
        new LayerDef("Apartment","tourism=apartment","#9115cc",name="#l#Apartment", 2.7, false),
        new LayerDef("Guest house","tourism=guest_house","#409400",name="#l#Guest house", 2.7, false),
        new LayerDef("Hostel","tourism=hostel","#66ff33",name="#l#Hostel", 2.7, false),
        new LayerDef("Motel","tourism=motel","blue",name="#l#Motel", 2.7, false),      
        new LayerDef("Camp site" ,"tourism=camp_site","#ad7d54",name="#l#Camp site", 2.7, false)
    ]}
  ];
  return groups;
}

/**
function layerdef(taglocator, type){
//-------------------------------------------------- Amenity layer
  var map = taglocator.map;
  if (type == "amenity"){
    map.addLayers([
        new LayerDef( ,"amenity=bench](bbox);node(w););out;","#ffcc00",name="#c#Bench", 2.7, false),
        new LayerDef( ,"amenity=post_box](bbox);node(w););out;","#663399",name="#c#Post box", 2.7, false),
        new LayerDef( ,"amenity=post_office](bbox);way[amenity=post_office](bbox);rel[amenity=post_office](bbox));(._;>;);out;","#9e00bc",name="#c#Post office", 2.7, false),
        new LayerDef( ,"amenity=pharmacy](bbox);way[amenity=pharmacy](bbox);rel[amenity=pharmacy](bbox));(._;>;);out;","red",name="#c#Pharmacy", 2.7, false),
        new LayerDef( ,"amenity=toilets](bbox);way[amenity=toilets](bbox);rel[amenity=toilets](bbox));(._;>;);out;","#0000f4",name="#c#Toilets", 2.7, false),
        new LayerDef( ,"amenity=police](bbox);way[amenity=police](bbox);rel[amenity=police](bbox));(._;>;);out;","#000089",name="#c#Police", 2.7, false),
      // Bank en ATM. Alleen banken waar een ATM beschikbaar is. Banken zonder ATM worden niet getoond.    
        new LayerDef( ,"amenity=atm](bbox);way[amenity=bank][atm][atm!=no](bbox);node[amenity=bank][atm][atm!=no](bbox));(._;>;);out;","#ff00cc",name="#c#ATM or Bank with ATM", 2.7, false),
        new LayerDef( ,"amenity=fuel](bbox);node[amenity=fuel](bbox);rel[amenity=fuel](bbox));(._;>;);out;","#cc3333",name="#c#fuel<hr>Education", 2.7, false),
      //Education
        new LayerDef( ,"amenity=school](bbox);way[amenity=school](bbox);rel[amenity=school](bbox);node[amenity=college](bbox);way[amenity=college](bbox);rel[amenity=college](bbox));(._;>;);out;", "#000099", name="#l#school/college", 2.7, false),
        new LayerDef( ,"amenity=university](bbox);way[amenity=university](bbox);rel[amenity=university](bbox));(._;>;);out;","red",name="#l#university<hr>Transportation", 2.7, false),
      //Transportation  
        new LayerDef( ,"amenity=bicycle_parking](bbox);way[amenity=bicycle_parking](bbox);rel[amenity=bicycle_parking](bbox));(._;>;);out;","#5a87ff",name="#c#bicycle parking", 2.7, false),
        new LayerDef( ,"amenity=bicycle_rental](bbox);way[amenity=bicycle_rental](bbox);rel[amenity=bicycle_rental](bbox));(._;>;);out;","#cc0066",name="#c#bicycle rental", 2.7, false),
        new LayerDef( ,"amenity=taxi](bbox);way[amenity=taxi](bbox);rel[amenity=taxi](bbox));(._;>;);out;","#ff0099",name="#c#taxi", 2.7, false),
        new LayerDef( ,"amenity=parking](bbox);way[amenity=parking](bbox);rel[amenity=parking](bbox));(._;>;);out;","#cc5633",name="#l#parking<hr>Entertainment", 2.7, false),
      //Entertainment      
        new LayerDef( ,"amenity=arts_centre](bbox);way[amenity=arts_centre](bbox);rel[amenity=arts_centre](bbox));(._;>;);out;","#05a333",name="#c#arts centre", 2.7, false),
        new LayerDef( ,"amenity=theatre](bbox);way[amenity=theatre](bbox);rel[amenity=theatre](bbox));(._;>;);out;","#0553ff",name="#c#theatre", 2.7, false),
        new LayerDef( ,"amenity=cinema](bbox);way[amenity=cinema](bbox);rel[amenity=cinema](bbox));(._;>;);out;","#16c5df",name="#c#cinema", 2.7, false)
    ]);
  }
  //-------------------------------------------------- Tourism layer
  if (type == "tourism"){
    map.addLayers([
        new LayerDef( ,"tourism=information](bbox);way[tourism=information](bbox);rel[tourism=information](bbox));(._;>;);out;","black",name="#c#information", 2.7, false),
        new LayerDef( ,"tourism=museum](bbox);way[tourism=museum](bbox);rel[tourism=museum](bbox););(._;>;);out;", "blue", name="#l#museum", 2.7, false),
        new LayerDef( ,"tourism=artwork](bbox);node(w););out;","#663399",name="#c#artwork", 2.7, false),
        new LayerDef( ,"tourism=gallery](bbox);way[tourism=gallery](bbox);rel[tourism=gallery](bbox));(._;>;);out;","#660033",name="#c#gallery", 2.7, false),
        new LayerDef( ,"tourism=picnic_site](bbox);way[tourism=picnic_site](bbox);rel[tourism=picnic_site](bbox));(._;>;);out;","#ff20d1",name="#c#picnic", 2.7, false),
        new LayerDef( ,"tourism=zoo](bbox);way[tourism=zoo](bbox);rel[tourism=zoo](bbox));(._;>;);out;","#fdcc00",name="#c#ZOO", 2.7, false),
        new LayerDef( ,"tourism=viewpoint](bbox);node(w););out;","#cc3366",name="#c#viewpoint", 2.7, false),
        new LayerDef( ,"tourism=attraction](bbox);way[tourism=attraction](bbox);rel[tourism=attraction](bbox));(._;>;);out;","#1ff1b4",name="#c#attraction<hr>Accommodation", 2.7, false),
      //hotels
        new LayerDef( ,"tourism=hotel](bbox);node[tourism=hotel](bbox);rel[tourism=hotel](bbox));(._;>;);out;","red",name="#l#Hotel", 2.7, false),
        new LayerDef( ,"tourism=apartment](bbox);node[tourism=apartment](bbox);rel[tourism=apartment](bbox));(._;>;);out;","#9115cc",name="#l#Apartment", 2.7, false),
        new LayerDef( ,"tourism=guest_house](bbox);node[tourism=guest_house](bbox);rel[tourism=guest_house](bbox));(._;>;);out;","#409400",name="#l#Guest house", 2.7, false),
        new LayerDef( ,"tourism=hostel](bbox);node[tourism=hostel](bbox);rel[tourism=hostel](bbox));(._;>;);out;","#66ff33",name="#l#Hostel", 2.7, false),
        new LayerDef( ,"tourism=motel](bbox);node[tourism=motel](bbox);rel[tourism=motel](bbox));(._;>;);out;","blue",name="#l#Motel", 2.7, false),      
        new LayerDef( ,"tourism=camp_site][backcountry!=yes](bbox);node[tourism=camp_site][backcountry!=yes](bbox);rel[tourism=camp_site][backcountry!=yes](bbox));(._;>;);out;","#ad7d54",name="#l#Camp site", 2.7, false),
        new LayerDef( ,"tourism=camp_site][backcountry=yes](bbox);node[tourism=camp_site][backcountry=yes](bbox);rel[tourism=camp_site][backcountry=yes](bbox));(._;>;);out;","#eea854",name="#l#Camp site (no facilities)", 2.7, false)
    ]);
  }      
  //-------------------------------------------------- Sports layer
  if (type == "sport"){
    map.addLayers([
        new LayerDef( ,"sport=soccer](bbox);node[sport=soccer](bbox));(._;>;);out;","blue",name="#l#Soccer", 2.7, false),
        new LayerDef( ,"sport=american_football](bbox);way[sport=american_football](bbox));(._;>;);out;","brown",name="#l#American football<hr>", 2.7, false),
      // ---      
        new LayerDef( ,"leisure=golf_course](bbox);way[sport=golf](bbox));(._;>;);out;","teal",name="#l#Golf", 2.7, false),    
        new LayerDef( ,"sport=tennis](bbox);node[sport=tennis](bbox));(._;>;);out;","#00ff33",name="#l#Tennis", 2.7, false),
        new LayerDef( ,"sport=volleybal](bbox);node[sport=volleybal](bbox));(._;>;);out;","#009633",name="#l#Volleybal", 2.7, false),
        new LayerDef( ,"sport=baseball](bbox);node[sport=baseball](bbox));(._;>;);out;","#009696",name="#l#Baseball", 2.7, false),
        new LayerDef( ,"sport=basketball](bbox);node[sport=basketball](bbox));(._;>;);out;","#65a5f3",name="#l#Basketball<hr>", 2.7, false),
        new LayerDef( ,"sport=ice_hockey](bbox);node[sport=ice_hockey](bbox);rel[sport=ice_hockey](bbox);way[leisure=ice_rink](bbox));(node[leisure=ice_rink](bbox));(._;>;);out;","#0000cc",name="#l#Ice hockey", 2.7, false),
      // ---      
        new LayerDef( ,"sport=hockey](bbox);node[sport=hockey](bbox);rel[sport=hockey](bbox);way[sport=field_hockey](bbox);node[sport=field_hockey](bbox);rel[sport=field_hockey](bbox));(._;>;);out;","#ff9696",name="#l#Hockey<hr>", 2.7, false),
        new LayerDef( ,"sport=cycling](bbox);node[sport=cycling](bbox);rel[sport=cycling](bbox));(._;>;);out;","#0060ff",name="#l#Cycling", 2.7, false),
        new LayerDef( ,"sport=horse_racing](bbox);(way[sport=equestrian](bbox);node[sport=horse_racing](bbox);(node[sport=equestrian](bbox));(._;>;);out;","#cc0033",name="#l#Horse racing", 2.7, false),
        new LayerDef( ,"sport=swimming](bbox);node[sport=swimming](bbox);rel[sport=swimming](bbox));(._;>;);out;","#650000",name="#l#Swimming", 2.7, false),
        new LayerDef( ,"sport=surfing](bbox);node[sport=surfing](bbox);rel[sport=surfing](bbox));(._;>;);out;","#cc7566",name="#l#Surfing", 2.7, false),
        new LayerDef( ,"sport=gymnastics](bbox);node[sport=gymnastics](bbox);rel[sport=gymnastics](bbox));(._;>;);out;","red",name="#l#Gymnastics", 2.7, false)
    ]);
  }  
  //-------------------------------------------------- Shop layer   
  if (type == "shop"){
    map.addLayers([
      //General store - Supermarket      
        new LayerDef( ,"shop=mall](bbox);way[shop=mall](bbox);rel[shop=mall](bbox));(._;>;);out;","#69712b",name="#c#Mall - Shopping centre", 2.7, false),
        new LayerDef( ,"shop=general](bbox);way[shop=general](bbox));(._;>;);out;","blue",name="#c#General", 2.7, false),
        new LayerDef( ,"shop=department_store](bbox);way[shop=department_store](bbox));(._;>;);out;","green",name="#c#Department_store<hr>", 2.7, false),
      //Clothing - Shoes - Accessories
        new LayerDef( ,"shop=clothes](bbox);way[shop=clothes](bbox);rel[shop=clothes](bbox));(._;>;);out;","#ff00ff",name="#c#Clothes", 2.7, false),
        new LayerDef( ,"shop=fashion](bbox);way[shop=fashion](bbox);rel[shop=fashion](bbox));(._;>;);out;","blue",name="#c#Fashion", 2.7, false),
        new LayerDef( ,"shop=jewelry](bbox);way[shop=jewelry](bbox);rel[shop=jewelry](bbox));(._;>;);out;","#000066",name="#c#Jewelry", 2.7, false),
        new LayerDef( ,"shop=leather](bbox);node[shop=leather](bbox);rel[shop=leather](bbox));(._;>;);out;","#ffcc00",name="#c#Leather", 2.7, false),
        new LayerDef( ,"shop=shoes](bbox);way[shop=shoes](bbox));(._;>;);out;","#b46600",name="#c#Shoes<hr>", 2.7, false),
      //Health and Beauty  
        new LayerDef( ,"shop=hairdresser](bbox);node[shop=hairdresser](bbox);rel[shop=hairdresser](bbox));(._;>;);out;","#66cc00",name="#c#Hairdresser", 2.7, false),    
        new LayerDef( ,"shop=beauty](bbox);node[shop=beauty](bbox);rel[shop=beauty](bbox));(._;>;);out;","#b466bc",name="#c#Beauty", 2.7, false),
        new LayerDef( ,"shop=cosmetics](bbox);node[shop=cosmetics](bbox);rel[shop=cosmetics](bbox));(._;>;);out;","#b466bc",name="#c#Cosmetics", 2.7, false),
        new LayerDef( ,"shop=chemist](bbox);node[shop=chemist](bbox);rel[shop=chemist](bbox));(._;>;);out;","#fa712b",name="#c#Chemist", 2.7, false),
        new LayerDef( ,"shop=optician](bbox);node[shop=optician](bbox);rel[shop=optician](bbox));(._;>;);out;","#54112b",name="#c#Optician<hr>", 2.7, false),
      //Stationery etc.
        new LayerDef( ,"shop=books](bbox);node[shop=books](bbox);rel[shop=books](bbox);way[shop=stationery](bbox);node[shop=stationery](bbox);rel[shop=stationery](bbox));(._;>;);out;","#110011",name="#c#Books/Stationary", 2.7, false),
        new LayerDef( ,"shop=photo](bbox);node[shop=photo](bbox);rel[shop=photo](bbox));(._;>;);out;","#0066cc",name="#c#Photo", 2.7, false),
        new LayerDef( ,"shop=toys](bbox);node[shop=toys](bbox);rel[shop=toys](bbox));(._;>;);out;","#ff9833",name="#c#Toys", 2.7, false),
        new LayerDef( ,"shop=gift](bbox);node[shop=gift](bbox);rel[shop=gift](bbox));(._;>;);out;","#f03901",name="#c#Gift", 2.7, false),
        new LayerDef( ,"shop=bicycle](bbox);node[shop=bicycle](bbox);rel[shop=bicycle](bbox));(._;>;);out;","#f03901",name="#c#Bicycle", 2.7, false),
        new LayerDef( ,"shop=musical_instrument](bbox);node[shop=musical_instrument](bbox);rel[shop=musical_instrument](bbox));(._;>;);out;","green",name="#c#Musical instrument", 2.7, false)    
    ]);
  }
  // Food layers
  if (type == "food"){
      map.addLayers([  
      // Restaurants etc.       
        new LayerDef( ,"amenity=restaurant](bbox);way[amenity=restaurant](bbox);rel[amenity=restaurant](bbox));(._;>;);out;","#0064ff",name="#c#Restaurant", 2.7, false),
        new LayerDef( ,"amenity=bar](bbox);way[amenity=bar](bbox);rel[amenity=bar](bbox));(._;>;);out;","#FF0033",name="#c#Bar", 2.7, false),
        new LayerDef( ,"amenity=cafe](bbox);way[amenity=cafe](bbox);rel[amenity=cafe](bbox));(._;>;);out;","#000033",name="#c#Cafe", 2.7, false),
        new LayerDef( ,"amenity=pub](bbox);way[amenity=pub](bbox);rel[amenity=pub](bbox));(._;>;);out;","#1899ff",name="#c#Pub", 2.7, false),
        new LayerDef( ,"amenity=ice_cream](bbox);way[amenity=ice_cream](bbox);rel[amenity=ice_cream](bbox));(._;>;);out;","#ff99ff",name="#c#Ice cream", 2.7, false),
        new LayerDef( ,"amenity=fast_food](bbox);way[amenity=fast_food](bbox);rel[amenity=fast_food](bbox));(._;>;);out;","#993399",name="#c#Fast food<hr>Food shops", 2.7, false),
      //food shops
        new LayerDef( ,"shop=supermarket](bbox);way[shop=supermarket](bbox));(._;>;);out;","red",name="#c#Supermarket", 2.7, false),
        new LayerDef( ,"shop=bakery](bbox);way[shop=bakery](bbox));(._;>;);out;","#dea100",name="#c#Bakery", 2.7, false),
        new LayerDef( ,"shop=chocolate](bbox);way[shop=chocolate](bbox);rel[shop=chocolate](bbox);node[shop=confectionery](bbox);way[shop=confectionery](bbox);rel[shop=confectionery](bbox));(._;>;);out;","#663300",name="#c#Chocolate / Confectionery", 2.7, false),
        new LayerDef( ,"shop=deli](bbox);way[shop=deli](bbox));(._;>;);out;","#65a5f3",name="#c#Deli", 2.7, false),
        new LayerDef( ,"shop=dairy](bbox);way[shop=dairy](bbox));(._;>;);out;","#650000",name="#c#Dairy", 2.7, false),
        new LayerDef( ,"shop=cheese](bbox);node[shop=cheese](bbox);rel[shop=cheese](bbox));(._;>;);out;","#decd00",name="#c#Cheese", 2.7, false),
        new LayerDef( ,"shop=greengrocer](bbox);node[shop=greengrocer](bbox);rel[shop=greengrocer](bbox));(._;>;);out;","green",name="#c#Greengrocer", 2.7, false),
        new LayerDef( ,"shop=grocery](bbox);way[shop=grocery](bbox));(._;>;);out;","#ff9900",name="#c#Grocery", 2.7, false),
        new LayerDef( ,"shop=butcher](bbox);node[shop=butcher](bbox);rel[shop=butcher](bbox));(._;>;);out;","brown",name="#c#Butcher", 2.7, false),
        new LayerDef( ,"shop=coffee](bbox);node[shop=coffee](bbox);rel[shop=coffee](bbox));(._;>;);out;","#993366",name="#c#Coffee", 2.7, false),
        new LayerDef( ,"shop=seafood](bbox);node[shop=seafood](bbox);rel[shop=seafood](bbox));(._;>;);out;","#00d2ff",name="#c#Seafood", 2.7, false),
        new LayerDef( ,"shop=organic](bbox);node[shop=organic](bbox);rel[shop=organic](bbox));(._;>;);out;","c35170",name="#c#Organic<hr>Drinkable", 2.7, false),
        new LayerDef( ,"amenity=drinking_water](bbox);way[amenity=drinking_water](bbox);rel[amenity=drinking_water](bbox));(._;>;);out;","#0033ff",name="#c#Drinking water", 2.7, false),
        new LayerDef( ,"shop=alcohol](bbox);way[shop=alcohol](bbox);rel[shop=alcohol](bbox));(._;>;);out;","#00e7ff",name="#c#Alcohol", 2.7, false),
        new LayerDef( ,"shop=wine](bbox);way[shop=wine](bbox);rel[shop=wine](bbox));(._;>;);out;","#c30c70",name="#c#Wine", 2.7, false),
        new LayerDef( ,"shop=beverages](bbox);node[shop=beverages](bbox);rel[shop=beverages](bbox));(._;>;);out;","green",name="#c#Beverages", 2.7, false)
      ]);
    }
    // Various layers
    // Hierin staan die tags die uit verschillende rubrieken komen die te klein zijn om een eigen tabje in het menu te geven.
    // Een paar winkels staan hier wel tussen. Ze pasten niet goed in mijn rubrieken bij de shoptags    
    if (type == "various"){
      map.addLayers([
          new LayerDef( ,"shop=travel_agency](bbox);way[shop=travel_agency](bbox);rel[shop=travel_agency](bbox));(._;>;);out;","#00e7ff",name="#c#Travel_agency", 2.7, false),
          new LayerDef( ,"shop=copyshop](bbox);way[shop=copyshop](bbox);rel[shop=copyshop](bbox));(._;>;);out;","#c30c70",name="#c#Copyshop", 2.7, false),
          new LayerDef( ,"emergency=defibrillator](bbox);way[emergency=defibrillator](bbox);rel[emergency=defibrillator](bbox));(._;>;);out;","black",name="#c#Defibrillator - AED", 2.7, false),
          new LayerDef( ,"emergency=fire_extinguisher](bbox);node[emergency=fire_hose](bbox));(._;>;);out;","blue",name="#c#Fire hose/extinguisher", 2.7, false),
          new LayerDef( ,"historic=memorial](bbox);way[historic=memorial](bbox);rel[historic=memorial](bbox));(._;>;);out;","#ff9966",name="#c#Memorial", 2.7, false),
          new LayerDef( ,"historic=monument](bbox);way[historic=monument](bbox);rel[historic=monument](bbox));(._;>;);out;","#6b34de",name="#c#Monument", 2.7, false),
          new LayerDef( ,"man_made=windmill](bbox);way[man_made=windmill](bbox);rel[man_made=windmill](bbox));(._;>;);out;","#650000",name="#c#Windmill", 2.7, false)
      ]);
    }
  }
*/
  
// Hieronder de code voor het popupvenster bij het klikken op de kaart.
function popuplinks(lonlat) {
  var thelink = "<div STYLE=\"margin:0px 0px 0px 0px;font-size: 8pt;\"><b>View area:</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\"><img src='img/osm.gif'>OSM</a>&nbsp&nbsp"
  thelink = thelink + "<a href=\"https://maps.google.nl/maps?ll=" + lonlat.lat + "," + lonlat.lon + "&t=h&z=17\" target=\"_blank\"><img src='img/google.gif'>Google</a>&nbsp&nbsp";
  thelink = thelink + "<a href=\"http://www.bing.com/maps/?v=2&cp=" + lonlat.lat + "~" + lonlat.lon + "&lvl=17&dir=0&sty=h&form=LMLTCC\" target=\"_blank\"><img src='img/bing.gif'>Bing</a><p>";
  thelink = thelink + "<a href=\"http://www.mapillary.com/map/im/bbox/"  + (lonlat.lat - 0.005) + "/" + (lonlat.lat + 0.005) + "/" + (lonlat.lon -0.005) +  "/" + (lonlat.lon + 0.005) + "\" target=\"_blank\"><img src='img/mapillary.png'>Mapillary</a><p>";  
  
  // Hoe wordt de te bewerken oppervlakte berekend?  
  // var area = 0.01 // oorspronkelijke waarde
  // Gegevensset kleiner voor josm
  var area = 0.005; // was 0.01
  var ctop = lonlat.lat + area;
  var cbottom = ctop - (2 * area);
  var cleft = lonlat.lon - area;
  var cright = cleft + (2 * area); 
    
  thelink = thelink + "<b>Edit area:</b><br><a href=\"http://localhost:8111/load_and_zoom?top=" + ctop + "&bottom=" + cbottom + "&left=" + cleft + "&right=" + cright + "\" target=\"josm_frame\">JOSM (plugin needed)</a><br>";
  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=id&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">ID editor</a>&nbsp&nbsp";
  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 2</a>&nbsp&nbsp";  
  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 1</a><hr>";
    
  thelink = thelink + "<b>Show OSM errors </b><br><a href=\"http://www.openstreetmap.org/#map=12" + "/" + lonlat.lat + "/" + lonlat.lon + "&layers=N" + "\" target=_blank> Openstreetmap Notes</a><hr>";
       
  thelink = thelink + "</b></div>";
  return thelink;  
}
