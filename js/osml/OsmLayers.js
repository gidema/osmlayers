'use strict';
//$(document).ready(function () {
//  window.osmLayers = new OsmLayers(52.09, 5.12, 13);
//});    

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
   * Create the base layers
   */
});            



