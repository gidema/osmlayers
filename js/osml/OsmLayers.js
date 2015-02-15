'use strict';
$(document).ready(function () {
  window.osmLayers = new OsmLayers(52.09, 5.12, 13);
});    

var OsmLayers = OpenLayers.Class( {
  baseUrl : "http://overpass-api.de/api/interpreter/",
  zoom_data_limit : 12,
  ls : null,
  plink : new OpenLayers.Control.Permalink({base: "?map="}),
  layers : {},
  layerGroups : {},
  osmLayers: [],
  map : null,
//  hoverPopup : null,
//  featurePopup : null,

  // Constructor  
  initialize : function(lat, lon, zoom) {
    osmlConfig(this);
    this.initMap(lat, lon, zoom);
    this.initOsmLayers("amenity");
//    this.featurePopup = new FeaturePopup(this.baseUrl, this.map);
  },
  
  // Add a new layer
  addLayer : function(id, name, query, marker) {
    var layerDef = new LayerDef(id, name, query, marker);
    var layer = new osml.OverpassLayer(layerDef);
    this.layers[id] = layer;
  },
  
  // GetLayer
  getLayer: function(id) {
    return this.layers[id];
  },
  // Add a new layer group
  addLayerGroup : function(id, name, layers) {
    var group = new LayerGroup(this, id, name, layers);
    this.layerGroups[id] = group;
  },
  // GetLayer
  getGroup: function(id) {
    return this.layerGroups[id];
  },
  /*
   * Initialize the OpenLayers map
   */
  initMap : function(lat, lon, zoom) {
    var self = this;
    this.map = new OpenLayers.Map ("map", {
      controls:[
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        this.plink,
        new OpenLayers.Control.Attribution()],
      maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
      maxResolution: 156543.0399,
      numZoomLevels: 19,
      units: 'm',
      size: new OpenLayers.Size(500, 500),
      projection: new OpenLayers.Projection("EPSG:900913"),
      displayProjection: new OpenLayers.Projection("EPSG:4326"),
      theme: null, // zie stylesheet
      eventListeners: {
        featureclick: function(e) {
           self.featureclick(e);
        },
//        featureover: function(e) {
//          self.featureover(e);
//        },
//        featureout: function(e) {
//          self.featureout(e);
//        }
      }
    } );
    var map = this.map;
    map.Z_INDEX_BASE = {
        BaseLayer: 100,
        Overlay: 325,
        Feature: 725,
        Popup: 1500,
        Control: 2000
    },

    // The layer switcher
    this.ls = new osml.LayerTreeSwitcher({
      div: document.getElementById("osmlLayerSelector"),
      layerGroups: this.layerGroups
    });
    //this.ls.maximizeControl();
    map.addControl(this.ls);
    
    // De Zoekbox
    map.addControl (new OpenLayers.Control.SearchBox({
      div: document.getElementById("osmlSearchBox"),
      autoClose: false,
      defaultLimit: 50,
      minDistance: 50,
      resultMinZoom: 13 // Hiermee stel je in op welk niveau moet worden ingezoomd nadat de zoekterm is gevonden      
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
  initOsmLayers : function() {
    var map = this.map;
    $.each(this.layerGroups, function(name, group) {
      $.each(group.layers, function (index, layer) {
        map.addLayer(layer);
      });
    });
  },

  /*
   * Check if the zoom level is valid for downloading data
   */
  zoomValid: function() {
    return this.map.getZoom() > this.zoom_data_limit;
  },
  
  featureclick: function(event) {
      var popup = new osml.FeaturePopup(event, map);
      this.map.addPopup(popup, true);
  },
  
  featureover: function(event) {
    if (event.feature.attributes.name) {
      var name = event.feature.attributes.name;
      this.hoverPopup = new OpenLayers.Popup.Anchored("pop",
        event.feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(150, 15),
        '<div class="markerContent">'+name+'</div>',
        null,
        false
      );
      this.map.addPopup(this.hoverPopup);
    }
  },

  featureout: function(event) {
    if (this.hoverPopup) {
      this.hoverPopup.destroy();
      this.hoverPopup = null;
    }
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

var LayerDef = OpenLayers.Class ({
  id: null,
  name: null,
  filter: null,
  marker: null,
  
  initialize: function LayerDef(id, name, query, marker) {
    this.id = id;
    this.name = name;
    this.query = query;
    this.filter = this.createFilter(query);
    this.marker = marker;
  },
  
  createFilter : function(query) {
    var f = "(";
    var parts = query.split(",");
    if (parts.length > 1) {
      $.each(parts, function(index, value) {
        f += "node" + value + "(bbox);way" + value + "(bbox);rel" + value + "(bbox);";
      });
      return f + ");(._;>;);out center;";
    }
    return "(node[" + query + "](bbox);way[" + query + "](bbox);rel[" + query + "](bbox););(._;>;);out center;";
  }
  
});

var LayerGroup = OpenLayers.Class ({
  id: null,
  name: null,
  layers: null,
  
  initialize: function(osml, id, name, layerIds) {
    this.id = id;
    this.name = name;
    this.layers = [];
    layerIds.forEach(function(id) {
        var layer = osml.getLayer(id);
        if (layer) {
          this.layers.push(layer);
        }
        else {
          alert("Unknown layer: " + id);
        }
    }, this);
  }
});
