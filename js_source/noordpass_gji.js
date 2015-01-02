// Deze versie is van dinsdag 23 december 2014 
// Aangepast door Noordfiets op mijn verzoek om de querystrings te laten bepalen aan de hand van het keuzemenu
// Zoek naar string NIEUW om de gewijzigde code te vinden.

// In deze versie het zoomniveau op 12 gezet (13 is standaard).

// Toegevoegd de code om een website (indien aanwezig op een node) als link in het popupvenster te zetten.

var zoomlevel = 12;   // In de code is dit duidelijk herkenbaar
var popUpZoom = 12;  // dit is het minimale zoomniveau (-1) voor het popupvenster, waarbij het begint te werken.

/**
OpenLayers.Control.Click = OpenLayers.Class(
  OpenLayers.Control, 
  {
    genericUrl : "", 
    parameters : {},
    tolerance : 0.0,
    map : "",
    defaultHandlerOptions : {
      'single' : true,
      'double' : false,
      'pixelTolerance' : 0,
      'stopSingle' : false,
      'stopDouble' : false
    },

    initialize : function (url, tolerance, map) {
      this.genericUrl = url;
      this.tolerance = tolerance;
      this.map = map;
      this.handlerOptions = OpenLayers.Util.extend( {}, this.defaultHandlerOptions);
      OpenLayers.Control.prototype.initialize.apply(this, arguments);
      this.handler =  new OpenLayers.Handler.Click(this, {'click' : this.trigger}, this.handlerOptions);
    },
    
    
    trigger : function (evt) {
      //  map.removePopup(popup);
      var lonlat = map.getLonLatFromPixel(evt.xy).transform(new OpenLayers.Projection("EPSG:900913"),  new OpenLayers.Projection("EPSG:4326"));
      var popup =  new OpenLayers.Popup("location_info",  new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(new OpenLayers.Projection("EPSG:4326"),  new OpenLayers.Projection("EPSG:900913")), null, lonlat, true );
      popup.setBackgroundColor("#fefdd5"); // achtergrondkleur van het popup venster
      popup.closeOnMove = false;
      popup.autoSize = true;
      popup.maxSize =  new OpenLayers.Size(250, 300);
      popup.panMapIfOutOfView = true;
      popup.opacity = 1.0;
      popup.setBorder("2px solid"); //mz: Border aan de buitenkant 
      if (browser == "ie9") {
        var marge =  new OpenLayers.Bounds(0, 0, 0, 0);
      }
      else {
        var marge =  new OpenLayers.Bounds(4, 4, 4, 4); // Aangepast door mz. De inhoud van het popupvenster staat nu wat vrijer van de kantlijn.
      }
      popup.padding = marge;
      var link = popuplinks(lonlat);
      //alert(link); //debug
      popup.contentHTML = link + "<br><img src='img/zuurstok.gif'>";
      map.addPopup(popup,true);
      var rel_tolerance = this.tolerance * map.getScale();
      if (rel_tolerance > 0.00008) rel_tolerance = 0.00008;

      // Hier wordt opgegeven vanaf welke zoomwaarde (= popUpZoom) de data kan worden opgehaald.
      // Ik merk visueel geen enkel verschil als ik hier andere waarden invul.
      // Het lijkt erop dat altijd hetzelfde gebied wordt gebruikt als een bepaalde onderdrempel is ingesteld.
      // zoomlevel - popUpZoom
      if (map.getZoom() > popUpZoom) {
        var oURL = this.genericUrl + "&bbox=" +  (lonlat.lon - rel_tolerance) + "," + (lonlat.lat - rel_tolerance) + "," + (lonlat.lon + rel_tolerance) + "," + (lonlat.lat + rel_tolerance);
        //alert(oURL);
        var html = "";
        var json = $.get(oURL, [], function(data) {
          html = processPois(data.elements);
        }, "json")
        .done(function() {
          popup.contentHTML = link + html;
          popup.draw();
        })
        .fail(function() {
          popup.contentHTML = link + "Could not read overpass data;";
        });
      }
      else {
        link = link + "<span style=\"font-size: 8pt; color: red;\">" + "(Zoom in for tag info) </span>";
        map.removePopup(popup);
        popup.contentHTML = link;
        map.addPopup(popup);
      }
    }
  }
  );

  // Process tags
  function processPois(elements) {
    var html = '<div class="pois">\n';
    jQuery.each( elements, function( index, value ) {
      if (value.tags) {
         html += processPoi(value.type, value.id, value.tags);
      }
    });
    html += "</div>\n";
    return html;
  }

  function processPoi(type, id, tags) {
    var html = '<div class="poi">\n';
    var name = tags.name;
    if (name) {
      html += '<h3>' + name + '</h3>\n';
    }
    var address = processAddress(tags);
    if (address) html += address;
    // process the open streetmap link
    html += '<strong><a target = "_blank" href="http://www.openstreetmap.org/browse/' + type + "/" + id +
      '">' + type + " " + id + "</a></strong><br ?>\n";
    // process the rest of the tags
    $.each( tags, function(key, val) {
      var tagHtml = processTag(key, val, address);
      if (tagHtml) {
        html += key + ": " + tagHtml + "<br />\n";
      }
    });
    html += '</div>';
    return html;
  }

  //
  function processTag(key, value, address) {
    switch (key) {
      case "website":
      case "url":
        return makeLink(value, value, true);
      case "wikipedia":
        var parts = value.split(':');
        if (parts.length = 2) {
          var href = "http://" + parts[0] + ".wikipedia.org/wiki/" + parts[1];
          return makeLink(href, value, true);
        }
        return value; 
      case "twitter":
        return makeLink("https://twitter.com/" + value, value, true);
      case "email":
        return makeLink("mailto:" + value, value, true);
      case "phone":
        return makeLink("tel:" + value, value, true);
      case "addr:street":
      case "addr:housenumber":
      case "addr:postcode":
      case "addr:city":
        return (address ? null : value);
      default:
        return value;
      }
  }

  function processAddress(tags) {
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
  }

  function makeLink(href, text, newPage) {
    var html = "<a ";
    if (newPage) html += 'target="_blank" ';
    html += 'href="' + href + '">' + text + "</a>";
    return html;
  }
*/
  // ----------------------------------------------------------------------------
  function setStatusText(text) {
    var html_node = document.getElementById("statusline");
    if (html_node != null) {
      //var div = html_node.firstChild;
      //div.deleteData(0, div.nodeValue.length);
      //div.appendData(text);
      html_node.innerHTML = text;
      if (text != "") {
        html_node.style.visibility = "visible";
      }
      else {
        html_node.style.visibility = "hidden";
      }
    }
  }
  var zoom_valid = true;
  var load_counter = 0;
  function make_features_added_closure() {
    return function (evt) {
      setStatusText("");
      if (zoom_valid) {
        --load_counter;
        if (load_counter <= 0) setStatusText("");
      }
    };
  }

//zoomlevel
  ZoomLimitedBBOXStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
    zoom_data_limit : zoomlevel, 
    initialize : function (zoom_data_limit) {
      this.zoom_data_limit = zoom_data_limit;
    //alert(zoom_data_limit);
    },
    update : function (options) {
      var mapBounds = this.getMapBounds();
      if (this.layer && this.layer.map && this.layer.map.getZoom() < this.zoom_data_limit) {
        if (this.layer.visibility == true) {
          setStatusText(" Please zoom in to view data! ");
          zoom_valid = false;
          this.bounds = null;
        }
      }
      else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
        if (this.layer.visibility == true) {
          ++load_counter;
          setStatusText("<img src='img/zuurstok.gif'>");
          zoom_valid = true;
          this.calculateBounds(mapBounds);
          this.resolution = this.layer.map.getResolution();
          this.triggerRead(options);
        }
      }
    },
    CLASS_NAME : "ZoomLimitedBBOXStrategy"
  }
  );
// ------------------------- originele layer -----------------------------------------------------------------------
// make_layer roept make_large_layer aan.

/**
  function make_large_layer(data_url, color, name, zoom, size, visible, dash, opacity, radius, radopacity) {
    var styleMap =  new OpenLayers.StyleMap( {
      strokeColor : color, strokeOpacity : opacity, strokeWidth : size, strokeLinecap : "square", strokeDashstyle : dash, pointRadius : radius, fillColor : "white", fillOpacity : radopacity
    });
    var layer =  new OpenLayers.Layer.Vector(name, {
      strategies : [new ZoomLimitedBBOXStrategy(zoomlevel)],
      protocol :  new OpenLayers.Protocol.HTTP( {
        url : data_url,
        format :  new OpenLayers.Format.OSM( {
          'checkTags' : true
        })
      }),
      styleMap : styleMap,
      visibility : visible,
      projection :  new OpenLayers.Projection("EPSG:4326")
    });
    layer.events.register("loadend", layer, make_features_added_closure());
    return layer;
  }
  
  function make_layer(data_url, color, name, size, visible, dash) {
    // ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
    if (dash != undefined) {
      dashalfa = dash.split("@");
      dash = dashalfa[0];
      if (dashalfa[1] == undefined) {
        opacity = 0.75;
      }
      else {
        opacity = parseFloat(dashalfa[1]);
      }
    }
    else {
      dash = "solid";
      opacity = 0.75;
    }
    //calculate seperate radius if given  
    var radius = (size - Math.floor(size)) * 10;
    if (radius <= 0) {
      radius = size;
      radopacity = 0.0;
    }
    else {
      radopacity = opacity;
    }
    //---- add an image if specified by  placehoder in name, placeholders are #l# > single line, #dl#>line line,#d#>dotted 
    //  alert(name);
    name = name.replace("#l#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/line.gif'>&nbsp");
    name = name.replace("#dl#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/lineline.gif'>&nbsp");
    name = name.replace("#d#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/dots.gif'>&nbsp");
    name = name.replace("#c#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle-geel.gif'>&nbsp");
    //zoomlevel
    return make_large_layer(data_url, color, name, 13, size, visible, dash, opacity, radius, radopacity);
  }
*/  
  //--- dit blok is nieuw -----------------------------
  function make_label(feature) {
    if (feature != undefined) {
      feature.attributes.display = "";
      //knooppunten
      if (feature.attributes.name != undefined) {
      feature.attributes.display = feature.attributes.name;
      }
      if (feature.attributes.rhn_ref != undefined) {
        feature.attributes.display = feature.attributes.rhn_ref;
      }
      if (feature.attributes.rwn_ref != undefined) {
        feature.attributes.display = feature.attributes.rwn_ref;
      }
      if (feature.attributes.rcn_ref != undefined) {
        feature.attributes.display = feature.attributes.rcn_ref;
      }
      //fietswinkels cafes etc
      else if (feature.attributes.ref != undefined) {
        feature.attributes.display = feature.attributes.ref;
      }
    }
  }

  function make_a_large_layer(data_url, color, name, zoom, size, visible, dash, opacity, radius, radopacity) {
    // TODO move this to the css
    var localstyle =  new OpenLayers.Style( {
      strokeColor : color,
      strokeOpacity : opacity,
      strokeWidth : size,
      strokeLinecap : "square",
      strokeDashstyle : dash,
      pointRadius : radius + 2,
      fillColor : color,
      fillOpacity : 1,
      fontColor : "white",
      fontSize : "10px",
      fontFamily : "Arial",
      fontWeight : "bold",
      labelOutlineColor : "black",
      labelOutlineWidth : 3,
      label : "${display}"
    })
    switch (browser) {
    case "ie10":
      localstyle.fontColor = "black";
      localstyle.labelYOffset = -5;
      break;
    case "ie9":
      localstyle.fontColor = "black";
      localstyle.labelXOffset = -1;
      break;
    }
    //zoomlevel
    var layer =  new OpenLayers.Layer.Vector(name, {
        strategies : [new ZoomLimitedBBOXStrategy(zoomlevel)], protocol :  new OpenLayers.Protocol.HTTP( {
          url : data_url, format :  new OpenLayers.Format.OSM( {
            checkTags : true
          })
        }), 
        styleMap :  new OpenLayers.StyleMap(localstyle),
        visibility : visible,
        projection :  new OpenLayers.Projection("EPSG:4326")
      }
    );
    layer.events.register("featuresadded", layer, make_features_added_closure());
    // Hier wordt het naamlabel toegevoegd
    // Hoe het precies werkt weet ik nog niet...
    layer.preFeatureInsert = make_label;
    //alert(layer.name);
    return layer;
  }
  
// Onderstaande functie presenteert de data op het scherm met de naam erbij.
// make_a_layer roept make_a_large_layer aan en daarin is weer de aanroep naar make_label
  
  function make_a_layer(data_url, color, name, size, visible, dash) {
    // ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
    if (dash != undefined) {
      dashalfa = dash.split("@");
      dash = dashalfa[0];
      if (dashalfa[1] == undefined) {
        opacity = 0.75;
      }
      else {
        opacity = parseFloat(dashalfa[1]);
      }
    }
    else {
      dash = "solid";
      opacity = 0.75;
    }
    //calculate seperate radius if given  
    var radius = (size - Math.floor(size)) * 10;
    if (radius <= 0) {
      radius = size;
      radopacity = 0.0;
    }
    else {
      radopacity = opacity;
    }
    //---- add an image if specified by  placehoder in name, placeholders are #l# > single line, #dl#>line line,#d#>dotted 
    //  alert(name);
    name = name.replace("#l#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/line.gif'>&nbsp");
    name = name.replace("#dl#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/lineline.gif'>&nbsp");
    name = name.replace("#d#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/dots.gif'>&nbsp");
    name = name.replace("#c#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle-geel.gif'>&nbsp");
    name = name.replace("#co#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle.gif'>&nbsp");
    //zoomlevel
    return make_a_large_layer(data_url, color, name, zoomlevel, size, visible, dash, opacity, radius, radopacity);
  }
  
// ------------ eind van het nieuwe blok

// ----------------------------- switchtab code-- 
function switchtab(newtab, activetab) { // was switchlayers(newlayer,active)

  // this destroys all layers that are not baselayers 
  // and construct a list of visable layers in the current view

  tabtype[activetab] = "";

  for (i = map.layers.length - 1; i > 1; i--) { // store visibility and than destroy layer
    if (map.layers[i].isBaseLayer == false) {
      if (map.layers[i].visibility == true){
        tabtype[activetab] = "1" + tabtype[activetab];  // tabtype[activetab] > "00101100001" where last character is last layer
      }
      else{
        tabtype[activetab] = "0" + tabtype[activetab];
      }
      map.layers[i].destroy();
    }
  }

  //set the new layer, retrieve mapvis if it exists and apply

  layerdef(newtab);

  if (tabtype[newtab] !== undefined){
    offset = map.layers.length - tabtype[newtab].length;
    for (i = offset ;  i < map.layers.length; i++) {
      if ( tabtype[newtab].charAt(i-offset) == "1"){
        map.layers[i].setVisibility(true);
      }
      else{
        map.layers[i].setVisibility(false);
      }
    }
  }

  //update layout and global vars and permalink
  document.getElementById(activetab).className = "dorment";
  document.getElementById(newtab).className = "choice";
  tabtype.name =  newtab;


  //===================MARC======================
  //=================NIEUW=======================
  // hier wordt de querystring aangepast
   if (Qstring[tabtype.name] !== undefined){
    click.genericUrl = Qstring[tabtype.name];
    }
   else{
    click.genericUrl = Qstring["default"];
    }
  //==============================================
  //==============================================

  plink.base = "?" + "map=" +  newtab;
  plink.updateLink();

//alert(click.genericUrl); // test of de query goed is gezet

// done!
}


  // update zoomindicatie
  function showZoom(zoom) {
    document.getElementById("zoom").innerHTML = map.Getzoom();
  }

  function showPosition(position){
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), 13);
    };
      
  function getPos(){
    if (navigator.geolocation) {
      //var geo_options = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};
      var my_geo_options = {enableHighAccuracy: true};
      navigator.geolocation.getCurrentPosition(showPosition,noPos,my_geo_options);
      //navigator.geolocation.getCurrentPosition(showPosition, null, geo_options);
      };
    };
      
  function noPos(ercode) {
    alert("Unable to get location");
    //map.setCenter(new window.OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), zoom);
  };
    
