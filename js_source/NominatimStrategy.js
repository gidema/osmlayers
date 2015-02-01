'use strict';
/**
 * The Nominatim Strategy allows downloading features from the OSM
 * Nominatim search service.
 */

OsmLayers.NominatimStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
  initialize : function (zoom_data_limit, maxFeatures) {
    this.zoom_data_limit = zoom_data_limit;
    this.maxFeatures = maxFeatures;
    this.query = '';
  },
  update : function (options) {
    if ('undefined' !== typeof osmLayers) {
      var mapBounds = this.getMapBounds();
      if (!osmLayers.zoomValid()) {
        if (this.layer.visibility == true) {
          osmLayers.setStatusText(' Please zoom in to view data! ');
          this.bounds = null;
        }
      }
      else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
        if (this.layer.visibility == true) {
          options.async = false;
          options.url = 'http://nominatim.openstreetmap.org/search';
          options. params = {
              format: "xml",
              limit: this.maxFeatures,
//              lon: center.lon,
//              lat: center.lat,
              q: this.query,
              addressdetails: 1
          };
//          this.resolution = this.layer.map.getResolution();
          this.triggerRead(options);
        }
      }
    }
  },
  triggerRead: function(options) {
    if (this.response && !(options && options.noAbort === true)) {
        this.layer.protocol.abort(this.response);
        this.layer.events.triggerEvent("loadend");
    }
    var evt = {filter: this.createFilter()};
    this.layer.events.triggerEvent("loadstart", evt);
    this.response = this.layer.protocol.read(
        OpenLayers.Util.applyDefaults({
            callback: this.merge,
            scope: this
    }, options));
},

  CLASS_NAME : "NominatimStrategy"
}
);
