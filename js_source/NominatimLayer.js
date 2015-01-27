Openlayers.Layer.OsmNominatim = OpenLayers.Class(OpenLayers.Layer.Vector, {
    baseUrl: 'http://nominatim.openstreetmap.org/search?' +
    'format=json&json_callback={callback}&limit={limit}&addressdetails=0&q={query}',

    initialize: function(name, options) {
      var opts = {
          styleMap:  new OpenLayers.StyleMap( {
              externalGraphic: 'img/markers/university.png',
              graphicWidth: 20,
              graphicHeight: 24,
              graphicYOffset: -24,
              class: "osmUniversity",
              fillColor: "#888888"}),
          strategies : [new ZoomLimitedBBOXStrategy(12)],
          protocol :  new OpenLayers.Protocol.HTTP( {
              url : this.baseUrl + "?data=" + layerDef.filter,
              format :  new OpenLayers.Format.OSMExtended( {
                  checkTags : true,
                  areaTags : ["area", "building", "amenity", "leisure"]
              })
          }),
          visibility : false,
          projection :  new OpenLayers.Projection("EPSG:4326"),
          cssClass : "anId"
      };
      opts = OpenLayers.Util.extend(opt, options);
      OpenLayers.Layer.Vector.prototype.initialize.apply(this, name, opts);
      this.events.register("loadstart", layer, osmLayers.loadStart);
      this.events.register("loadend", layer, osmLayers.loadEnd);
    }
});
