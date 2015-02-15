$(document).ready(function () {
  osml.init({
    map: {
      div: 'map',
      lat: 52.09,
      lon: 5.12,
      zoom: 14,
      baseLayers: [
        new ol.layer.Tile({
          style: 'Road',
          source: new ol.source.MapQuest({layer: 'osm'})
        })
      ]
    },
    layerTreeControl: {
      div: 'osmlLayerSelector'
    },
    layerData: layerData,
    treeData: treeData
  });
});

var layerData = {
  osmBench: {id: 'osmBench', name: 'Bench', query: 'amenity=bench', icon: 'letter_b.png'},
  osmPostbox: {id: 'osmPostbox', name: 'Post box', query: 'amenity=post_box', icon: 'letter_p.png'},
  osmPostoffice: {id: 'osmPostoffice', name: 'Post office', query: 'amenity=post_office', icon: 'postal.png'},
  osmPharmacy: {id: 'osmPharmacy', name: 'Pharmacy', query: 'amenity=pharmacy', icon: 'medicalstore.png'},
  osmToilets: {id: 'osmToilets', name: 'Toilets', query: 'amenity=toilets', icon: 'toilets.png'},
  osmPolice: {id: 'osmPolice', name: 'Police', query: 'amenity=police', icon: 'police.png'},
  osmATM: {id: 'osmATM', name: 'ATM', query: '[amenity=atm],[amenity=bank][atm][atm!=no]', icon: 'atm-2.png'},
  osmFuel: {id: 'osmFuel', name: 'Fuel', query: 'amenity=fuel', icon: 'fillingstation.png'},
  osmSchool: {id: 'osmSchool', name: 'School/College', query: '[amenity=school],[amenity=college]', icon: 'school.png'},
  osmUniversity: {id: 'osmUniversity', name: 'University', query: 'amenity=university', icon: 'university.png'},
  osmBicycleparking: {id: 'osmBicycleparking', name: 'Bicycle parking', query: 'amenity=bicycle_parking', icon: 'parking_bicycle-2.png'},
  osmBicyclerental: {id: 'osmBicyclerental', name: 'Bicycle rental', query: 'amenity=bicycle_rental', icon: 'number_1.png'},
  osmTaxi: {id: 'osmTaxi', name: 'Taxi', query: 'amenity=taxi', icon: 'taxi.png'},
  osmParking: {id: 'osmParking', name: 'Parking', query: 'amenity=parking', icon: 'parkinggarage.png'},
  osmArtscentre: {id: 'osmArtscentre', name: 'Arts centre', query: 'amenity=arts_centre', icon: 'artgallery.png'},
  osmTheatre: {id: 'osmTheatre', name: 'Theatre', query: 'amenity=theatre', icon: 'theater.png'},
  osmCinema: {id: 'osmCinema', name: 'Cinema', query: 'amenity=cinema', icon: 'cinema.png'},
  osmInformation: {id: 'osmInformation', name: 'Information', query: 'tourism=information', icon: 'information.png'},
  osmMuseum: {id: 'osmMuseum', name: 'Museum', query: 'tourism=museum', icon: 'museum_art.png'},
  osmArtwork: {id: 'osmArtwork', name: 'Artwork', query: 'tourism=artwork', icon: 'number_2.png'},
  osmGallery: {id: 'osmGallery', name: 'Gallery', query: 'tourism=gallery', icon: 'artgallery.png'},
  osmPicnic: {id: 'osmPicnic', name: 'Picnic', query: 'tourism=picnic_site', icon: 'picnic-2.png'},
  osmZoo: {id: 'osmZoo', name: 'Zoo', query: 'tourism=zoo', icon: 'zoo.png'},
  osmViewpoint: {id: 'osmViewpoint', name: 'Viewpoint', query: 'tourism=viewpoint', icon: 'sight-2.png'},
  osmAttraction: {id: 'osmAttraction', name: 'Attraction', query: 'tourism=attraction', icon: 'letter_a.png'},
  osmHotel: {id: 'osmHotel', name: 'Hotel', query: 'tourism=hotel', icon: 'hotel_0star.png'},
  osmApartment: {id: 'osmApartment', name: 'Apartment', query: 'tourism=apartment', icon: 'apartment-3.png'},
  osmGuesthouse: {id: 'osmGuesthouse', name: 'Guest house', query: 'tourism=guest_house', icon: 'bed_breakfast1-2.png'},
  osmHostel: {id: 'osmHostel', name: 'Hostel', query: 'tourism=hostel', icon: 'hostel_0star.png'},
  osmMotel: {id: 'osmMotel', name: 'Motel', query: 'tourism=motel', icon: 'motel-2.png'},
  osmCampsite: {id: 'osmCampsite', name: 'Camp site', query: 'tourism=camp_site', icon: 'camping-2.png'},
  osmSoccer: {id: 'osmSoccer', name: 'Soccer', query: 'sport=soccer', icon: 'soccer.png'},
  osmUsFootball: {id: 'osmUsFootball', name: 'American football', query: 'sport=american_football', icon: 'usfootball.png'},
  osmGolf: {id: 'osmGolf', name: 'Golf', query: 'leisure=golf_course', icon: 'golfing.png'},
  osmTennis: {id: 'osmTennis', name: 'Tennis', query: 'sport=tennis', icon: 'tennis.png'},
  osmVolleybal: {id: 'osmVolleybal', name: 'Volleybal', query: 'sport=volleybal', icon: 'volleyball.png'},
  osmBaseball: {id: 'osmBaseball', name: 'Baseball', query: 'sport=baseball', icon: 'baseball.png'},
  osmBasketball: {id: 'osmBasketball', name: 'Basketball', query: 'sport=basketball', icon: 'basketball.png'},
  osmIcehockey: {id: 'osmIcehockey', name: 'Ice hockey', query: '[sport=ice_hockey],[leisure=ice_rink]', icon: 'icehockey.png'},
  osmHockey: {id: 'osmHockey', name: 'Hockey', query: '[sport=hockey],[sport=field_hockey]', icon: 'hockey.png'},
  osmCycling: {id: 'osmCycling', name: 'Cycling', query: 'sport=cycling', icon: 'cycling.png'},
  osmHorseracing: {id: 'osmHorseracing', name: 'Horse racing', query: '[sport=horse_racing],[sport=equestrian]', icon: 'horseriding.png'},
  osmSwimming: {id: 'osmSwimming', name: 'Swimming', query: 'sport=swimming', icon: 'swimming.png'},
  osmSurfing: {id: 'osmSurfing', name: 'Surfing', query: 'sport=surfing', icon: 'surfing.png'},
  osmGymnastics: {id: 'osmGymnastics', name: 'Gymnastics', query: 'sport=gymnastics', icon: 'indoor-arena.png'},
  osmMall: {id: 'osmMall', name: 'Mall/Shopping centre', query: 'shop=mall', icon: 'mall.png'},
  osmShop: {id: 'osmShop', name: 'General', query: 'shop=general', icon: 'letter_s.png'},
  osmDepartmentstore: {id: 'osmDepartmentstore', name: 'Department store', query: 'shop=department_store', icon: 'departmentstore.png'},
  osmClothes: {id: 'osmClothes', name: 'Clothes', query: 'shop=clothes', icon: 'clothers_male.png'},
  osmFashion: {id: 'osmFashion', name: 'Fashion', query: 'shop=fashion', icon: 'clothers_female.png'},
  osmJewelry: {id: 'osmJewelry', name: 'Jewelry', query: 'shop=jewelry', icon: 'jewelry.png'},
  osmLeather: {id: 'osmLeather', name: 'Leather', query: 'shop=leather', icon: 'bags.png'},
  osmShoes: {id: 'osmShoes', name: 'Shoes', query: 'shop=shoes', icon: 'shoes.png'},
  osmHairdresser: {id: 'osmHairdresser', name: 'Hairdresser', query: 'shop=hairdresser', icon: 'barber.png'},
  osmBeauty: {id: 'osmBeauty', name: 'Beauty', query: 'shop=beauty', icon: 'beautysalon.png'},
  osmCosmetics: {id: 'osmCosmetics', name: 'Cosmetics', query: 'shop=cosmetics', icon: 'perfumery.png'},
  osmChemist: {id: 'osmChemist', name: 'Chemist', query: 'shop=chemist', icon: 'chemistry-2.png'},
  osmOpticien: {id: 'osmOpticien', name: 'Opticien', query: 'shop=optician', icon: 'ophthalmologist.png'},
  osmBooks: {id: 'osmBooks', name: 'Books/Stationary', query: '[shop=books],[shop=stationery]', icon: 'library.png'},
  osmPhoto: {id: 'osmPhoto', name: 'Photo', query: 'shop=photo', icon: 'photography.png'},
  osmToys: {id: 'osmToys', name: 'Toys', query: 'shop=toys', icon: 'toys.png'},
  osmGift: {id: 'osmGift', name: 'Gift', query: 'shop=gift', icon: 'gifts.png'},
  id: {id: 'id', name: 'name', query: 'query', icon: 'icon'},
  osmBicycle: {id: 'osmBicycle', name: 'Bicycle', query: 'shop=bicycle', icon: 'bicycle_shop.png'},
  osmMusicalinstruments: {id: 'osmMusicalinstruments', name: 'Musical instruments', query: 'shop=musical_instrument', icon: 'music.png'},
  osmRestaurant: {id: 'osmRestaurant', name: 'Restaurant', query: 'amenity=restaurant', icon: 'restaurant.png'},
  osmBar: {id: 'osmBar', name: 'Bar', query: 'amenity=bar', icon: 'bar.png'},
  osmCafe: {id: 'osmCafe', name: 'Cafe', query: 'amenity=cafe', icon: 'cafetaria.png'},
  osmPub: {id: 'osmPub', name: 'Pub', query: 'amenity=pub', icon: 'bar.png'},
  osmIcecream: {id: 'osmIcecream', name: 'Ice cream', query: 'amenity=ice_cream', icon: 'icecream.png'},
  osmFastfood: {id: 'osmFastfood', name: 'Fast food', query: 'amenity=fast_food', icon: 'fastfood.png'},
  osmSupermarket: {id: 'osmSupermarket', name: 'Supermarket', query: 'shop=supermarket', icon: 'supermarket.png'},
  osmBakery: {id: 'osmBakery', name: 'Bakery', query: 'shop=bakery', icon: 'bread.png'},
  osmConfectionery: {id: 'osmConfectionery', name: 'Chocolate/Confectionery', query: '[shop=chocolate],[shop=confectionery]', icon: 'candy.png'},
  osmDeli: {id: 'osmDeli', name: 'Deli', query: 'shop=deli', icon: 'patisserie.png'},
  osmDairy: {id: 'osmDairy', name: 'Dairy', query: 'shop=dairy', icon: 'milk_and_cookies.png'},
  osmCheese: {id: 'osmCheese', name: 'Cheese', query: 'shop=cheese', icon: 'cheese.png'},
  osmGreengrocer: {id: 'osmGreengrocer', name: 'Greengrocer', query: 'shop=greengrocer', icon: 'fruits.png'},
  osmGrocery: {id: 'osmGrocery', name: 'Grocery', query: 'shop=grocery', icon: 'grocery.png'},
  osmButcher: {id: 'osmButcher', name: 'Butcher', query: 'shop=butcher', icon: 'butcher-2.png'},
  osmCoffee: {id: 'osmCoffee', name: 'Coffee', query: 'shop=coffee', icon: 'coffee.png'},
  osmSeafood: {id: 'osmSeafood', name: 'Seafood', query: 'shop=seafood', icon: 'restaurant_fish.png'},
  osmOrganic: {id: 'osmOrganic', name: 'Organic', query: 'shop=organic', icon: 'restaurant_vegetarian.png'},
  osmDrinkingwater: {id: 'osmDrinkingwater', name: 'Drinking water', query: 'amenity=drinking_water', icon: 'drinkingwater.png'},
  osmAlcohol: {id: 'osmAlcohol', name: 'Alcohol', query: 'shop=alcohol', icon: 'liquor.png'},
  osmWine: {id: 'osmWine', name: 'Wine', query: 'shop=wine', icon: 'winebar.png'},
  osmBeverages: {id: 'osmBeverages', name: 'Beverages', query: 'shop=beverages', icon: 'bar_coktail.png'},
  osmTravelagency: {id: 'osmTravelagency', name: 'Travel agency', query: 'shop=travel_agency', icon: 'travel_agency.png'},
  osmCopyshop: {id: 'osmCopyshop', name: 'Copy shop', query: 'shop=copyshop', icon: 'printer-2.png'},
  osmDefibrilator: {id: 'osmDefibrilator', name: 'Defibrilator/AED', query: 'emergency=defibrillator', icon: 'aed-2.png'},
  osmFirehose: {id: 'osmFirehose', name: 'Fire hose/extinguisher', query: 'emergency=fire_extinguisher', icon: 'fireexstinguisher.png'},
  osmMemorial: {id: 'osmMemorial', name: 'Memorial', query: 'historic=memorial', icon: 'memorial.png'},
  osmMonument: {id: 'osmMonument', name: 'Monument', query: 'historic=monument', icon: 'monument.png'},
  osmWindmill: {id: 'osmWindmill', name: 'Windmill', query: 'man_made=windmill', icon: 'windmill-2.png'},
  osmWatermill: {id: 'osmWatermill', name: 'Water', query: 'man_made=watermill', icon: 'watermill-2.png'}
}

var treeData = {
  facilities: {
    name: 'Facilities',
    childeren: {
      transport: {
        name: 'Transport',
        layers: ['osmFuel', 'osmBicycleparking', 'osmBicyclerental', 'osmTaxi', 'osmParking']
      },
      education: {
        name: 'Education',
        layers: ['osmSchool', 'osmUniversity']
      },
      culture: {
        name: 'Culture',
        layers: ['osmArtscentre', 'osmTheatre', 'osmCinema', 'osmMuseum', 'osmArtwork', 'osmGallery']
      },
      tourism: {
        name: 'Tourism',
        layers: ['osmInformation', 'osmPicnic', 'osmZoo', 'osmViewpoint', 'osmAttraction']
      },
      accomodation: {
        name: 'Accomodation',
        layers: ['osmHotel', 'osmApartment', 'osmGuesthouse', 'osmHostel', 'osmMotel', 'osmCampsite', 'osmCampsiteCountry']
      },
      facilities: {
        name: 'Food',
        layers: ['osmRestaurant', 'osmBar', 'osmCafe', 'osmPub', 'osmIcecream', 'osmFastfood']
      }
    }
  },
  sport: {
    name: 'Sport',
    layers: ['osmSoccer', 'osmUsFootball', 'osmGolf', 'osmTennis', 'osmVolleybal', 'osmBaseball', 'osmBasketball',
      'osmIcehockey', 'osmHockey', 'osmCycling', 'osmHorseracing', 'osmSwimming', 'osmSurfing', 'osmGymnastics']
  },
  shopping: {
    name: 'Shopping',
    children: {
      food: {
        name: 'Food',
        layers: ['osmSupermarket', 'osmBakery', 'osmConfectionery', 'osmDeli', 'osmDairy', 'osmCheese', 'osmGreengrocer', 'osmGrocery',
          'osmButcher', 'osmCoffee', 'osmSeafood', 'osmOrganic', 'osmDrinkingwater', 'osmAlcohol', 'osmWine', 'osmBeverages']
      },
      other: {
        name: 'Other shops',
        layers: ['osmMall', 'osmGeneral', 'osmDepartmentstore', 'osmClothes', 'osmFashion', 'osmJewelry', 'osmLeather', 'osmShoes',
          'osmHairdresser', 'osmBeauty', 'osmCosmetics', 'osmChemist', 'osmOpticien', 'osmBooks', 'osmPhoto', 'osmToys', 'osmGift',
          'osmBicycle', 'osmMusicalinstruments']
      }
    }
  },
  various: {
    name: 'Various',
    layers: ['osmTravelagency', 'osmCopyshop', 'osmDefibrilator', 'osmFirehose', 'osmMemorial', 'osmMonument', 'osmWindmill']
  },
  amenity: {
    name: 'Amenity',
    layers: ['osmBench', 'osmPostbox', 'osmPostoffice', 'osmPharmacy', 'osmToilets', 'osmPolice', 'osmATM']
  }
}
