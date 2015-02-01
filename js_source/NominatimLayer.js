'use strict';
OsmLayers.OsmNominatimLayer = OpenLayers.Class(OpenLayers.Layer.Vector, {
    baseUrl: 'http://nominatim.openstreetmap.org/search',
    strategy: new OsmLayers.NominatimStrategy(12, 50),
    protocol: new OpenLayers.Protocol.HTTP( {
      url : this.baseUrl,
      format :  new OpenLayers.Format.OsmNominatim({})
    }),
    textBox: null,
    lastQuery: '', // Remember the last query to see if it changed

    initialize: function(name, textBox, options) {
       var opts = {
          styleMap:  new OpenLayers.StyleMap( {
              externalGraphic: 'img/markers/university.png',
              graphicWidth: 20,
              graphicHeight: 24,
              graphicYOffset: -24,
              fillColor: "#EEEEEE"}),
          strategies : [this.strategy],
          protocol : this.protocol,
          visibility : false,
          projection :  new OpenLayers.Projection("EPSG:4326"),
          cssClass : "anId"
      };
      opts = OpenLayers.Util.extend(opts, options);
      
      OpenLayers.Layer.Vector.prototype.initialize.apply(this, [name, opts]);
      
      /** Initialize the text box */
      this.textBox = textBox;
      textBox.setListener(this);

    },
    
    textChanged: function(text) {
      this.strategy.query = text;
      var force = false;
      if (text != this.lasQuery) {
        this.removeAllFeatures();
        force = true;
      }
      if (text.length && text.length > 0) {
        this.setVisibility(true);
        this.display(true);
//        this.refresh({force : force});
      }
      else {
        this.setVisibility(false);
        this.display(false);
      }
    }
});
