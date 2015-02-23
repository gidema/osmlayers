/**
 * 
 * @param options
 * @returns {osml.Site}
 */
osml.Site = OpenLayers.Class({
    zoom_data_limit : 12,
    ltc : null,
    statusDiv : 'statusline',
    map : null,
    layers : {},
    layerTree : null,

    initialize : function(options) {
        this.statusDiv = options.statusDiv ? options.statusDiv : 'statusline';
        var mapOptions = options.map;
        this.layerTree = new osml.LayerTree(options.layerData, options.treeData);
        this.createMap(mapOptions);
        var layerTreeControlOptions = options.layerTreeControl;
        if (layerTreeControlOptions) {
            this.createLayerTreeControl(layerTreeControlOptions);
        }
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
        $.each(this.layerTree.layers, function(id, layer) {
            map.addLayer(layer);
        });

        if(!map.getCenter()) {
          map.setCenter(new OpenLayers.LonLat(options.lon, options.lat).transform(map.displayProjection, map.projection), options.zoom);
        };
    },
    createLayerTreeControl : function(options) {
        // The layer tree control
        var div = document.getElementById(options.div);
        this.ltc = new osml.LayerTreeControl(this.layerTree, {
            div: div
        });
        this.map.addControl(this.ltc);
        div.style.height = this.map.div.clientHeight;
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
//        layers.push(mapquest);
//
//        //Mapnik
        var mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik",{'attribution': '© <a href="http://www.openstreetmap.org/copyright/en" ' +
          'target="_blank">OpenStreetMap</a> Contributors<br>Cartography licensed as CC-BY-SA<br>Overlay data licensed under ODbL '});
//        layers.push(layerMapnik);
//        
//        //Topo
        var arcgis = new OpenLayers.Layer.XYZ("ArcGIS World Topo","http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",{'attribution': 'Cartography © <a href="http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ArcGIS</a><br>Overlay data OpenStreetMap Contributors, licensed under ODbL '}); 
//        layers.push(arcgis);
//     
//        //Google    
        var googlesat = new OpenLayers.Layer.Google("Google Sat",{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 19});
//        layers.push(googlesat);
//
//        return layers;
        this.map.addLayer(mapquest);
      },
    zoomValid: function() {
        return this.map.getZoom() > this.zoom_data_limit;
    },
    featureclick: function(event) {
        var popup = new osml.FeaturePopup(event, this.map);
        this.map.addPopup(popup, true);
    },
    /*
     * Set the status
     */
    setStatusText: function(text) {
        var element = document.getElementById(this.statusDiv);
        if (element != null) {
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
