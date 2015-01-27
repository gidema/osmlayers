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
    popup.closeOnMove = false;
    popup.autoSize = true;
    popup.maxSize =  new OpenLayers.Size(250, 300);
    popup.panMapIfOutOfView = true;
    popup.opacity = null;
    popup.contentHTML = this.processFeature(event.feature);
    this.map.addPopup(popup, true);
  },
   
  /*
   * Create the div element for a single feature
   */
  processFeature: function(feature) {
    var fid = feature.fid.split(".");
    return this.processElement(fid[0], fid[1], feature.attributes);
  },

  /* 
   * Create the div element containing the information about the selected features
   * Handling multiple features is supported.
   */
  processElements : function(elements) {
    var html = '<div class="pois">\n';
    var self = this;
    jQuery.each( elements, function( index, value ) {
      if (value.tags) {
         html += self.processElement(value.type, value.id, value.tags);
      }
    });
    html += "</div>\n";
    return html;
  },

  /*
   * Create the div element for a single feature
   */
  processElement : function(type, id, tags) {
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
    var k = key.split(":");
    switch (k[0]) {
    case "website":
    case "twitter":
    case "facebook":
    case "email":
    case "phone":
    case "fax":
    case "url": 
      return this.processContactTag(k[0], value);
    case "contact":
      if (k.length > 1) {
        return this.processContactTag(k[1], value);
      }
      return key;
    case "wikipedia":
      if (k.length == 2) {
        var lang = k[1] + ".";
      }
      else {
        lang = "";
      }
      var s = value.split(':'); //Subject
      if (s.length == 2) {
        lang = s[0] + ".";
        subject = s[1];
      }
      else {
        subject = value;
      }
      var href = "http://" + lang + "wikipedia.org/wiki/" + subject;
      return this.makeLink(href, value, true);
    case "addr":
      return (address ? null : value);
    case "name":
      // Ignore the name tag because we show it in the header
      return null;
    default:
      return value;
    }
  },
  
  processContactTag : function(key, value) {
    switch (key) {
    case "website":
    case "url":
      return this.makeLink(value, value, true);
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
    case "fax":
      return this.makeLink("fax:" + value, value, true);
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
    if (href.indexOf(":") == -1) {
      return html + 'href=//"' + href + '">' + text + "</a>";
    }
    return html + 'href="' + href + '">' + text + "</a>";
  },
  CLASS_NAME : "FeaturePopup"
});
