/**
 * FeaturePopup
 * The FeaturePopup class creates the Popup window for the info about the selected OSM feature
 */
FeaturePopup = OpenLayers.Class({
  genericUrl : null,
  map : null,
  
  // Constructor
  initialize : function(url, map) {
    this.genericUrl = url;
    this.map = map;
  },
  
  // Click event
  click : function(event) {
    var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
    var popup =  new OpenLayers.Popup("location_info", lonlat, null, "", true );
    popup.setBackgroundColor("#fefdd5"); // achtergrondkleur van het popup venster
    popup.closeOnMove = false;
    popup.autoSize = true;
    popup.maxSize =  new OpenLayers.Size(250, 300);
    popup.panMapIfOutOfView = true;
    popup.opacity = 1.0;
    popup.setBorder("2px solid"); //mz: Border aan de buitenkant 
    popup.padding = new OpenLayers.Bounds(4, 4, 4, 4);
//    var links = popuplinks(lonlat.clone().transform("EPSG:900913", "EPSG:4326"));
    //alert(link); //debug
    popup.contentHTML = "<br><img src='img/zuurstok.gif'>";
    this.map.addPopup(popup, true);
//    var rel_tolerance = this.tolerance * this.map.getScale();
//    if (rel_tolerance > 0.00008) rel_tolerance = 0.00008;
  
    var oURL = this.genericUrl + "?data=[out:json];" + event.feature.fid.replace(".", "(") + ");out;";
    var html = "";
    var self = this;
    $.get(oURL, [], function(data) {
      html = self.processFeatures(data.elements);
    }, "json")
    .done(function() {
      popup.contentHTML = html;
      popup.draw();
    })
    .fail(function() {
      popup.contentHTML = links + "Could not read overpass data;";
    });
  },
   
  /* 
   * Create the div element containing the information about the selected features
   * Handling multiple features is supported.
   */
  processFeatures : function(elements) {
    var html = '<div class="pois">\n';
    var self = this;
    jQuery.each( elements, function( index, value ) {
      if (value.tags) {
         html += self.processFeature(value.type, value.id, value.tags);
      }
    });
    html += "</div>\n";
    return html;
  },

  /*
   * Create the div element for a single feature
   */
  processFeature : function(type, id, tags) {
    var html = '<div class="poi">\n';
    var name = tags.name;
    if (name) {
      html += '<h3>' + name + '</h3>\n';
    }
    var address = this.processAddress(tags);
    if (address) html += address;
    // process the open streetmap link
    html += '<strong><a target = "_blank" href="http://www.openstreetmap.org/browse/' + type + "/" + id +
      '">' + type + " " + id + "</a></strong><br ?>\n";
    // process the rest of the tags
    var self = this;
    $.each( tags, function(key, val) {
      var tagHtml = self.processTag(key, val, address);
      if (tagHtml) {
        html += key + ": " + tagHtml + "<br />\n";
      }
    });
    html += '</div>';
    return html;
  },

  /*
   * Create the html for a single tag
   */
  processTag : function(key, value, address) {
    switch (key) {
    case "website":
    case "url":
      return this.makeLink(value, value, true);
    case "wikipedia":
      var parts = value.split(':');
      if (parts.length = 2) {
        var href = "http://" + parts[0] + ".wikipedia.org/wiki/" + parts[1];
        return this.makeLink(href, value, true);
      }
      return value; 
    case "twitter":
      return this.makeLink("https://twitter.com/" + value, value, true);
    case "facebook":
      if (value.startsWith("http") || value.startsWith("www") || value.startsWith("facebook")) {
        return this.makeLink(value, value, true);
      }
      return this.makeLink("https://www.facebook.com/" + value, value, true);
    case "email":
      return this.makeLink("mailto:" + value, value, true);
    case "phone":
      return this.makeLink("tel:" + value, value, true);
    case "addr:street":
    case "addr:housenumber":
    case "addr:postcode":
    case "addr:city":
      return (address ? null : value);
    case "name":
      // Ignore the name tag because we show it in the header
      return null;
    default:
      return value;
    }
  },
  /*
   * Create the html for a nicely formatted address.
   */
  processAddress : function(tags) {
    var street = tags["addr:street"];
    var number = tags["addr:housenumber"];
    if (!(street && number)) return null;
    var postcode = tags["addr:postcode"];
    var city = tags["addr:city"];
    var html = street + " " + number + "<br />\n";
    if (postcode) html += postcode;
    if (postcode && city) html += "  ";
    if (city) html += city;
    if (postcode || city) html += "<br />\n";
    return html;
  },

  /*
   * Create the html for a link
   */
  makeLink : function(href, text, newPage) {
    var html = "<a ";
    if (newPage) html += 'target="_blank" ';
    html += 'href="' + href + '">' + text + "</a>";
    return html;
  },
  CLASS_NAME : "FeaturePopup"
});
