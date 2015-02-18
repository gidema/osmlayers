/**
 * 
 * @param options
 * @returns {osml.Site}
 */
osml.Site = OpenLayers.Class({
    zoom_data_limit : 12,
    ls : null,
    statusDiv : 'statusline',
    map : null,
    layers : {},
    layerTree : {},
    layerGroups : {}, // Old style 2 level layer groups

    initialize : function(options) {
        this.statusDiv = options.statusDiv ? options.statusDiv : 'statusline';
        var mapOptions = options.map;
        // Initialize old style 2 level layers
        this.initializeLayers(options.layerData, options.layerGroups);
        this.createMap(mapOptions);
//    this.createOsmLayers(options.layerData);
//    var layerTreeControlOptions = options.layerTreeControl;
//    if (layerTreeControlOptions) {
//        this.createLayerTreeControl(layerTreeControlOptions);
//    }
    },

    initializeLayers : function(layerData, layerGroups) {
        var self = this;
        $.each(layerData, function(id, l) {
            var layerDef = new osml.LayerDef(id, l.name, l.query, l.icon);
            var layer = new osml.OverpassLayer(layerDef);
            self.layers[id] = layer;
        });
        $.each(layerGroups, function(id, g) {
            var group = new osml.LayerGroup(self, g.id, g.name, g.layers);
            self.layerGroups[id] = group;
        });
    },
    createMap : function(options) {
        var self = this;
        this.map = new OpenLayers.Map ('map', {
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
          projection: new OpenLayers.Projection('EPSG:900913'),
          displayProjection: new OpenLayers.Projection('EPSG:4326'),
          theme: null, // zie stylesheet
          eventListeners: {
            featureclick: function(e) {
               self.featureclick(e);
            },
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
        this.ls = new osml.LayerTreeSwitcher(this, {
          div: document.getElementById('osmlLayerSelector'),
          layerGroups: this.layerGroups
        });
        //this.ls.maximizeControl();
        map.addControl(this.ls);
        
        // De Zoekbox
        map.addControl (new OpenLayers.Control.SearchBox({
          div: document.getElementById('osmlSearchBox'),
          autoClose: false,
          defaultLimit: 50,
          minDistance: 50,
          resultMinZoom: 13 // Hiermee stel je in op welk niveau moet worden ingezoomd nadat de zoekterm is gevonden      
        }));

        // The base layers
        this.createBaseLayers();
        
        // The other layers
        $.each(this.layers, function(id, layer) {
            map.addLayer(layer);
        });

        if(!map.getCenter()) {
          map.setCenter(new OpenLayers.LonLat(options.lon, options.lat).transform(map.displayProjection, map.projection), options.zoom);
        };
    },

    /*
     * Create the base layers
     */
    createBaseLayers : function() {
        //In verband met de leesbaarheid heb ik MapQuest bovenaan gezet. De kleuren van die kaart zijn wat rustiger 
        //waardoor de contrasten met de kleuren van de gebruikte tekens wat groter is.

        //Mapquest  - De kaart die bovenstaat in deze lijst is de kaart die default wordt geopend.  
        var mapquest = new OpenLayers.Layer.OSM('MapQuest','http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png',
          {'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a>' +
             'Contributors<br>Cartography © MapQuest<br>Overlay data licensed under ODbL '}); 
        this.map.addLayer(mapquest);
    },

//    createBaseLayers : function() {
//        var layers = [];
//        //In verband met de leesbaarheid heb ik MapQuest bovenaan gezet. De kleuren van die kaart zijn wat rustiger 
//        //waardoor de contrasten met de kleuren van de gebruikte tekens wat groter is.
//
//        //Mapquest  - De kaart die bovenstaat in deze lijst is de kaart die default wordt geopend.  
//        var mapquest = new OpenLayers.Layer.OSM("MapQuest","http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
//          {'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" target="_blank">OpenStreetMap</a>' +
//             'Contributors<br>Cartography © MapQuest<br>Overlay data licensed under ODbL '}); 
//        layers.push(mapquest);
//
//        //Mapnik
//        var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik",{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" ' +
//          'target="_blank">OpenStreetMap</a> Contributors<br>Cartography licensed as CC-BY-SA<br>Overlay data licensed under ODbL '});
//        layers.push(layerMapnik);
//        
//        //Topo
//        var arcgis = new OpenLayers.Layer.XYZ("ArcGIS World Topo","http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",{'attribution': 'Cartography © <a href="http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ArcGIS</a><br>Overlay data OpenStreetMap Contributors, licensed under ODbL '}); 
//        layers.push(arcgis);
//     
//        //Google    
//        var googlesat = new OpenLayers.Layer.Google("Google Sat",{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 19});
//        layers.push(googlesat);
//
//        return layers;
//      },

    createLayerTreeControl : function(options) {
        this.ls = new osml.LayerTreeControl(this, {
            div : options.div,
            layerGroups : this.layerGroups
        });
        // this.ls.maximizeControl();
        map.addControl(this.ls);
    },
    
    getLayer : function(id) {
        return this.layers[id];
    },
    
    getGroup : function(id) {
        return this.layerGroups[id];
    },
    zoomValid: function() {
        return this.map.getZoom() > this.zoom_data_limit;
    },
    featureclick: function(event) {
        var popup = new osml.FeaturePopup(event, map);
        this.map.addPopup(popup, true);
    },
    /*
     * Set the status
     */
    setStatusText: function(text) {
        var element = document.getElementById(this.statusDiv);
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
    },

    CLASS_NAME : 'osml.Site'
});
