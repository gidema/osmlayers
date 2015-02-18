osml.OverpassLayer = OpenLayers.Class(OpenLayers.Layer.Vector, {
    baseUrl : "http://overpass-api.de/api/interpreter/",

    initialize : function(layerDef) {
        var styleMap =  new OpenLayers.StyleMap( {
            externalGraphic: 'img/markers/' + layerDef.marker,
            graphicWidth: 20, graphicHeight: 24, graphicYOffset: -24,
//            class: name,
            fillColor: "#888888"
        });
        OpenLayers.Layer.Vector.prototype.initialize.apply(this, [layerDef.name, {
            strategies : [new osml.ZoomLimitedBBOXStrategy(12)],
            protocol :  new OpenLayers.Protocol.HTTP( {
                url : this.baseUrl + "?data=" + layerDef.filter,
                format :  new osml.FormatOSMExtended( {
                    checkTags : true,
                    areaTags : ["area", "building", "amenity", "leisure"]
                })
            }),
            styleMap : styleMap,
            visibility : false,
            projection :  new OpenLayers.Projection("EPSG:4326"),
            cssClass : layerDef.id
        }]);
    },
    CLASS_NAME : 'osml.OverpassLayer'
});

osml.ZoomLimitedBBOXStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
    initialize : function (zoom_data_limit) {
        this.zoom_data_limit = zoom_data_limit;
      //alert(zoom_data_limit);
    },
    update : function (options) {
        if ('undefined' !== typeof osml.site) {
            var mapBounds = this.getMapBounds();
            if (!osml.site.zoomValid()) {
                if (this.layer.visibility == true) {
                    osml.site.setStatusText(" Please zoom in to view data! ");
                    this.bounds = null;
                }
            }
            else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
                if (this.layer.visibility == true) {
                    //  ++load_counter;
                    this.calculateBounds(mapBounds);
                    this.resolution = this.layer.map.getResolution();
                    this.triggerRead(options);
                }
            }
        }
    },
    CLASS_NAME : 'osml.ZoomLimitedBBOXStrategy'
});
