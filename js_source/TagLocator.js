Taglocator = OpenLayers.Class( {
  baseUrl : "http://overpass-api.de/api/interpreter/",
  ls : new OpenLayers.Control.LayerSwitcher(),
  plink : new OpenLayers.Control.Permalink({base: "?map="}),
//  plink : new OpenLayers.Control.Permalink({base: "?map=" + tabtype.name}),
  layerGroups : null,
  map : null,
  featurePopup : null,

  // Constructor  
  initialize : function() {
    this.layerGroups = layerGroups();
    this.initOsmLayers();
    this.map = this.initMap();
    this.featurePopup = new FeaturePopup(this.baseUrl, this.map);
  },
  
  /*
   * Initialize the OpenLayers map
   */
  initMap : function() {
    var self = this;
    var map = new OpenLayers.Map ("map", {
      controls:[
        this.ls,
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
  //      new OpenLayers.Control.MousePosition(), // niet bij BTM
        this.plink,
        new OpenLayers.Control.Attribution()],
      maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
      maxResolution: 156543.0399,
      numZoomLevels: 19,
      units: 'm',
      projection: new OpenLayers.Projection("EPSG:900913"),
      displayProjection: new OpenLayers.Projection("EPSG:4326"),
      theme: null, // zie stylesheet
      eventListeners: {
        featureclick: function(e) {
          var popup = new FeaturePopup(self.baseUrl, map);
          popup.click(e);
        }
      }
    } );
    this.ls.maximizeControl(); 
    
    // De Zoekbox
    map.addControl (new OpenLayers.Control.SearchBox({      
      autoClose: false,            
      defaultLimit: 50,            
      minDistance: 50,            
      resultMinZoom: 13         // Hiermee stel je in op welk niveau moet worden ingezoomd nadat de zoekterm is gevonden      
    }));

    // The base layers
    $.each(this.createBaseLayers(), function (index, layer) {
      map.addLayer(layer);
    });

    // The OSM layers
    $.each(this.osmLayers, function (index, layer) {
      map.addLayer(layer);
    });

    //  layerdef(this, tabtype.name); // roept externe layerdefinitie in layerdef.js aan
    document.getElementById(tabtype.name).className = "choice";
    if(!map.getCenter()) {
      map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection, map.projection), zoom);
    }
    return map;
  },

  /*
   * Initialize the OSM layers
   */
  initOsmLayers : function() {
    var self = this;
    this.osmLayers = [];
    $.each(this.layerGroups, function(key, value) {
      self.makeLayerGroup(value);
    });
  },

  /*
   * create a group of layers
   */
  makeLayerGroup : function(group) {
    var self = this;
    $.each(group.layers, function(index, layerDef) {
      var layer = self.makeLayer(layerDef);
      self.osmLayers.push(layer);
    });
  },

  /*
   * Create an OSM Vector layer for a feature using the supplied layerDef
   */
  makeLayer : function(layerDef) {
    var data_url = this.baseUrl + "?data=" + layerDef.query;
    var color = layerDef.color;
    var name = layerDef.name;
    var size = 2.7;
    var visible = false;
    var dash;

    // ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
    if (dash != undefined) {
      dashalfa = dash.split("@");
      dash = dashalfa[0];
      if (dashalfa[1] == undefined) {
        opacity = 0.75;
      }
      else {
        opacity = parseFloat(dashalfa[1]);
      }
    }
    else {
      dash = "solid";
      opacity = 0.75;
    }
    //calculate seperate radius if given  
    var radius = (size - Math.floor(size)) * 10;
    if (radius <= 0) {
      radius = size;
      radopacity = 0.0;
    }
    else {
      radopacity = opacity;
    } 
    var html = layerDef.getNameHtml();
    //---- add an image if specified by  placehoder in name, placeholders are #l# > single line, #dl#>line line,#d#>dotted 
    //  alert(name);
    //    name = name.replace("#l#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/line.gif'>&nbsp");
    //    name = name.replace("#dl#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/lineline.gif'>&nbsp");
    //    name = name.replace("#d#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/dots.gif'>&nbsp");
    //    name = name.replace("#c#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle-geel.gif'>&nbsp");
    //zoomlevel
    return this.make_large_layer(data_url, color, html, 13, size, visible, dash, opacity, radius, radopacity);
  },

  make_large_layer : function make_large_layer(data_url, color, name, zoom, size,
    visible, dash, opacity, radius, radopacity) {
  
    var styleMap =  new OpenLayers.StyleMap( {
      strokeColor : color, 
      strokeOpacity : opacity,
      strokeWidth : size,
      strokeLinecap : "square", 
      strokeDashstyle : dash,
      pointRadius : radius,
      fillColor : "white",
      fillOpacity : radopacity
    });
    var layer =  new OpenLayers.Layer.Vector(name, {
      strategies : [new ZoomLimitedBBOXStrategy(zoomlevel)],
      protocol :  new OpenLayers.Protocol.HTTP( {
        url : data_url,
        format :  new OpenLayers.Format.OSM( {
          checkTags : true,
          areaTags : ["building", "amenity"]
        })
      }),
      styleMap : styleMap,
      visibility : visible,
      projection :  new OpenLayers.Projection("EPSG:4326")
    });
    layer.events.register("loadend", layer, make_features_added_closure());
    return layer;
  },

  /*
   * Create the base layers
   */
  createBaseLayers : function() {
    var layers = [];
    //In verband met de leesbaarheid heb ik MapQuest bovenaan gezet. De kleuren van die kaart zijn wat rustiger 
    //waardoor de contrasten met de kleuren van de gebruikte tekens wat groter is.

    //Mapquest  - De kaart die bovenstaat in deze lijst is de kaart die default wordt geopend.  
    var mapquest = new OpenLayers.Layer.OSM("MapQuest","http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
      {'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a>' +
         'Contributors<br>Cartography © MapQuest<br>Overlay data licensed under ODbL '}); 
    layers.push(mapquest);

    //Mapnik
    var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik",{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" ' +
      'target="_blank">OpenStreetMap</a> Contributors<br>Cartography licensed as CC-BY-SA<br>Overlay data licensed under ODbL '});
    layers.push(layerMapnik);
    
    //Topo
    var arcgis = new OpenLayers.Layer.XYZ("ArcGIS World Topo","http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",{'attribution': 'Cartography © <a href="http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ArcGIS</a><br>Overlay data OpenStreetMap Contributors, licensed under ODbL '}); 
    layers.push(arcgis);
 
    //Google    
    var googlesat = new OpenLayers.Layer.Google("Google Sat",{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 19});
    layers.push(googlesat);

    // === layers, zoom and position
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
       new OpenLayers.Projection("EPSG:900913"));
    return layers;
  }
});            

