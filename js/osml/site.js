/**
 * 
 * @param options
 * @returns {osml.Site}
 */
osml.Site = OpenLayers.Class({
    zoom_data_limit : 12,
    ls : null,

    map : null,
    layers : {},
    layerTree : {},

    initialize : function(options) {
    var mapOptions = options.map;
    this.createMap(mapOptions);
//    this.createOsmLayers(options.layerData);
//    var layerTreeControlOptions = options.layerTreeControl;
//    if (layerTreeControlOptions) {
//        this.createLayerTreeControl(layerTreeControlOptions);
//    }
    },

    createMap : function(options) {
        var self = this;
        this.map = new OpenLayers.Map ("map", {
          controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
//            this.plink,
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
//            featureover: function(e) {
//              self.featureover(e);
//            },
//            featureout: function(e) {
//              self.featureout(e);
//            }
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
        };
    },

    createOsmLayers : function(layerData) {
        $.each(this.layerData, function(id, l) {
            var layerDef = new LayerDef(id, l.name, l.query, l.icon);
            var layer = this.makeLayer(layerDef);
            this.layers[id] = layer;
            this.map.addLayer(layer);
        });
    },

    createLayerTreeControl : function(options) {
        this.ls = new osml.LayerTreeControl({
            div : options.div,
            layerGroups : this.layerGroups
        });
        // this.ls.maximizeControl();
        map.addControl(this.ls);
    },
});
