'use strict';
$(document).ready(function () {
  window.osmLayers = new OsmLayers(52.09, 5.12, 13);
});    

var OsmLayers = OpenLayers.Class( {
  baseUrl : "http://overpass-api.de/api/interpreter/",
  zoom_data_limit : 12,
  ls : new OpenLayers.Control.LayerSwitcher(),
  plink : new OpenLayers.Control.Permalink({base: "?map="}),
  layers : {},
  layerGroups : {},
  osmLayers: [],
  map : null,
  currentLayerGroup : null,
  featurePopup : null,

  // Constructor  
  initialize : function(lat, lon, zoom) {
    osmlConfig(this);
    this.initMap(lat, lon, zoom);
    this.initOsmLayers("amenity");
    this.featurePopup = new FeaturePopup(this.baseUrl, this.map);
  },
  
  // Add a new layer
  addLayer : function(filter, color, name) {
    var layerDef = new LayerDef(name, filter, color);
    var layer = this.makeLayer(layerDef);
    this.layers[name] = layer;
  },
  
  // GetLayer
  getLayer: function(name) {
    return this.layers[name];
  },
  // Add a new layer group
  addLayerGroup : function(name, layers) {
    var group = new LayerGroup(this, name, layers);
    this.layerGroups[name] = group;
  },
  /*
   * Initialize the OpenLayers map
   */
  initMap : function(lat, lon, zoom) {
    var self = this;
    this.map = new OpenLayers.Map ("map", {
      controls:[
        this.ls,
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
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
          self.featurePopup.click(e);
        }
      }
    } );
    var map = this.map;
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
      if (layer) {
        map.addLayer(layer);
      }
    });

    if(!map.getCenter()) {
      map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection, map.projection), zoom);
    }
  },

  /*
   * Initialize the OSM layers
   */
  initOsmLayers : function(groupName) {
    var layerGroup = this.layerGroups[groupName];
    if (layerGroup) {
      var map = this.map;
      $.each(layerGroup.layers, function (index, layer) {
        map.addLayer(layer);
      });
      this.currentLayerGroup = layerGroup;
      document.getElementById(groupName).className = "choice";
    }
  },
  
  /*
   * Change the layer group
   */
  changeGroup : function(newtab) { 
    // this removes all layers that are not base layers 
    // and construct a list of visible layers in the current view
    var activetab = this.currentLayerGroup.name;
    var layers = this.map.layers;
    while (layers[layers.length -1].isBaseLayer == false) {
      layers.pop();
    }
    // add the layers for the new tab group

    this.initOsmLayers(newtab);
    // redraw the layer selector
    this.ls.redraw();

    //update layout and global vars and permalink
    document.getElementById(activetab).className = "dorment";
    document.getElementById(newtab).className = "choice";
    this.plink.base = "?" + "map=" +  newtab;
    this.plink.updateLink();
  },
  
  /*
   * Unselect all layers
   */
  clearall: function () { //functie voor toekomstig gebruik
    this.osmLayers.forEach(function(layer) {
      layer.setVisibility(false);
    });
  },
  
  /*
   * Select all layers for the current layerGroup
   */
  selectall: function() {
//    for (i = map.layers.length - 1; i > 1; i--) { 
//      if (map.layers[i].isBaseLayer == false) { // only to overlays
//        map.layers[i].setVisibility(true);
//      }
//    }
  },
  /*
   * Check if the zoom level is valid for downloading data
   */
  zoomValid: function() {
    return this.map.getZoom() > this.zoom_data_limit;
  },
  /*
   * Create an OSM Vector layer for a feature using the supplied layerDef
   */
  makeLayer : function(layerDef) {
    var data_url = this.baseUrl + "?data=" + layerDef.filter;
    var color = layerDef.color;
    var size = 2.7;
    var visible = false;
    var dash;
    var opacity;
    var radopacity;

    // ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
    if (dash != undefined) {
      var dashalfa = dash.split("@");
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
      strategies : [new ZoomLimitedBBOXStrategy(12)],
      protocol :  new OpenLayers.Protocol.HTTP( {
        url : data_url,
        format :  new OpenLayers.Format.OSM( {
          checkTags : true,
          areaTags : ["area", "building", "amenity"]
        })
      }),
      styleMap : styleMap,
      visibility : visible,
      projection :  new OpenLayers.Projection("EPSG:4326")
    });
    layer.events.register("loadend", layer, function() {
      osmLayers.setStatusText("");
    });
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
//    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), 
//       new OpenLayers.Projection("EPSG:900913"));
    return layers;
  },
  /*
   * Set the status
   */
  setStatusText: function(text) {
    var element = document.getElementById("statusline");
    if (element != null) {
      //var div = html_node.firstChild;
      //div.deleteData(0, div.nodeValue.length);
      //div.appendData(text);
      element.innerHTML = text;
      if (text != "") {
        element.style.visibility = "visible";
      }
      else {
        element.style.visibility = "hidden";
      }
    }
  }
});            

var ZoomLimitedBBOXStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
  initialize : function (zoom_data_limit) {
    this.zoom_data_limit = zoom_data_limit;
  //alert(zoom_data_limit);
  },
  update : function (options) {
    if ('undefined' !== typeof osmLayers) {
      var mapBounds = this.getMapBounds();
      if (!osmLayers.zoomValid()) {
        if (this.layer.visibility == true) {
          osmLayers.setStatusText(" Please zoom in to view data! ");
          this.bounds = null;
        }
      }
      else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
        if (this.layer.visibility == true) {
        //  ++load_counter;
          osmLayers.setStatusText("<img src='img/zuurstok.gif'>");
          this.calculateBounds(mapBounds);
          this.resolution = this.layer.map.getResolution();
          this.triggerRead(options);
        }
      }
    }
  },
  CLASS_NAME : "ZoomLimitedBBOXStrategy"
}
);

var LayerDef = OpenLayers.Class ({
  name: null,
  filter: null,
  color: null,
  
  initialize: function LayerDef(name, filter, color) {
    this.filter = filter;
    this.color = color;
    this.name = name;
    this.filter = this.createFilter(filter);
  },
  
  createFilter : function(filter) {
    var f = "(";
    if ($.isArray(filter)) {
      $.each(filter, function(index, value) {
        f += "node" + value + "(bbox);way" + value + "(bbox);rel" + value + "(bbox);";
      });
      return f + ");(._;>;);out;";
    }
    return "(node[" + filter + "](bbox);way[" + filter + "](bbox);rel[" + filter + "](bbox););(._;>;);out;";
  },
  
  getNameHtml : function() {
//    if (this.type == undefined) {
//      return this.getName;
//    }
//    switch (this.type) {
//      case "line":
//        return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/line.gif">&nbsp;' + this.name;
//      case "lineline":
//        return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/lineline.gif">&nbsp;' + this.name;
//      case "dots":
//        return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/dots.gif">&nbsp;' + this.name;
//      case "circle":
        return '<img style="vertical-align: middle;background-color: ' + this.color + ';" src="img/tcircle-geel.gif">&nbsp;' + this.name;
//     } 
  } 
});

var LayerGroup = OpenLayers.Class ({
  name: null,
  layers: null,
  
  initialize: function(tl, name, layerNames) {
    this.name = name;
    this.layers = [];
    layerNames.forEach(function(name) {
        var layer = tl.getLayer(name);
        if (layer) {
          this.layers.push(layer);
        }
        else {
          throw "Unknown layer: " + name;
        }
    }, this);
  }
});
