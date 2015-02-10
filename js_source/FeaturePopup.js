/**
 * FeaturePopup The FeaturePopup class creates the Popup window for the info
 * about the selected OSM feature
 */
FeaturePopup = OpenLayers
        .Class({
            genericUrl : null,
            map : null,
            popup : null,

            // Constructor
            initialize : function(url, map) {
                this.genericUrl = url;
                this.map = map;
            },

            // Click event
            click : function(event) {
                var xy = event.feature.geometry.getBounds().getCenterLonLat();
                var lonlat = xy.clone().transform(this.map.projection,
                        this.map.displayProjection); // WGS84 coordinaten
                // (EPSG:4326)
                this.popup = new OpenLayers.Popup("location_info", xy, null, "",
                        true);
                this.popup.closeOnMove = false;
                this.popup.autoSize = false;
                this.popup.size = new OpenLayers.Size(300, 400);
                this.popup.panMapIfOutOfView = true;
                this.popup.opacity = null;
                this.popup.contentHTML = this.processFeature(event.feature, lonlat,
                        18);
                this.map.addPopup(this.popup, true);
                $("#popup-tabs").tabs();
            },

            /*
             * Create the div element for a single feature
             */
            processFeature : function(feature, lonlat, zoom) {
                var fid = feature.fid.split(".");
                return this.processElement({
                    type : fid[0],
                    id : fid[1],
                    tags : feature.attributes,
                    lonlat : lonlat,
                    zoom : zoom
                });
            },

            /*
             * Create the popup content
             */
            processElement : function(data) {
                var div = this.popup.contentDiv;
                div.innerHTML = '<div id="popup-tabs"><ul></ul></div>';
                this.tabs = div.firstChild;
                this.addMainTab(data);
                this.addDetailTab(data);
                this.addViewTab(data);
                this.addEditTab(data);
            },

            addTab : function(id, name, html) {
                var li = document.createElement('li');
                li.innerHTML = '<a href="#' + id + '">' + name + '</a>';
                this.tabs.firstChild.appendChild(li);
                var tab = document.createElement('div');
                tab.id = id;
                tab.innerHTML = html;
                this.tabs.appendChild(tab);
            },

            addMainTab : function(data) {
                var html = '<div class="poi">\n';
                var name = data.tags.name;
                if (name) {
                    html += '<h3>' + name + '</h3>\n';
                }
                var address = this.processAddress(data.tags);
                if (address)
                    html += address;
                // process the rest of the tags
                var self = this;
                $.each(data.tags, function(key, val) {
                    var tagHtml = self.processTag(key, val, address);
                    if (tagHtml) {
                        html += key + ": " + tagHtml + "<br />\n";
                    }
                });
                html += '</div>';
                this.addTab('popup-main', 'General', html);
            },

            addDetailTab : function(data) {
                // process the open streetmap link
                html = '<strong><a target = "_blank" href="http://www.openstreetmap.org/browse/'
                        + data.type
                        + "/"
                        + data.id
                        + '">'
                        + data.type
                        + " "
                        + data.id + "</a></strong><br ?>\n";
                this.addTab('popup-detail', 'Detail', html);
            },
            
            addViewTab : function(data) {
                var lon = data.lonlat.lon;
                var lat = data.lonlat.lat;
                var zoom = data.zoom;
                var html = '<ul>' +
                    '<li>' + this.viewOsm(lon, lat, zoom) + '</li>\n' +
                    '<li>' + this.viewGoogle(lon, lat, zoom) + '</li>\n' +
                    '<li>' + this.viewBing(lon, lat, zoom) + '</li>\n' +
                    '<li>' + this.viewMtM(lon, lat, zoom) + '</li>\n' +
                    '<li>' + this.viewMapillary(lon, lat, zoom) + '</li>\n' +
                  '</ul>';
                this.addTab('popup-view', 'View', html);
            },
            addEditTab : function(data) {
                // Hoe wordt de te bewerken oppervlakte berekend voor JOSM?
                // var area = 0.01 // oorspronkelijke waarde
                // mz: Gegevensset kleiner gemaakt voor josm

                var lon = data.lonlat.lon;
                var lat = data.lonlat.lat;
                var zoom = data.zoom;
                var area = 0.005; // was 0.01
                var ctop = lat + area;
                var cbottom = ctop - (2 * area);
                var cleft = lon - area;
                var cright = cleft + (2 * area);

                var html = '<b>Edit area with:</b><br><a href="http://localhost:8111/load_and_zoom?top='
                        + ctop
                        + '&bottom='
                        + cbottom
                        + '&left='
                        + cleft
                        + '&right='
                        + cright
                        + '" target="josm_frame">JOSM</a>&nbsp&nbsp';
                html += '<a href="http://www.openstreetmap.org/edit?editor=id&lat='
                        + lat + '&lon=' + lon + '&zoom=' + zoom
                        + '" target="_blank">ID&nbsp;editor</a>&nbsp&nbsp';
                html += '<a href="http://www.openstreetmap.org/edit?editor=potlatch2&lat='
                        + lat + '&lon=' + lon + '&zoom=' + zoom
                        + '" target="_blank">Potlatch&nbsp;2</a>&nbsp&nbsp';
                html += '</div>'; 
                this.addTab('popup-edit', 'Edit', html);
            },

            viewOsm : function(lon, lat, zoom) {
                var url = String.format('http://www.openstreetmap.org?lat={0}&lon={1}&zoom={2}', lat, lon, zoom);
                return String.format('<a href="{0}" target="_blank\"><img src="img/osm.gif">OSM</a>', url);
            },
            viewGoogle : function(lon, lat, zoom) {
                var url = String.format('https://maps.google.nl/maps?ll={0},{1}&t=h&z={2}', lat, lon, zoom);
                return String.format('<a href="{0}" target="_blank"><img src="img/google.gif">Google</a>', url);
            },
            viewBing : function(lon, lat, zoom) {
                var url = String.format('http://www.bing.com/maps/?v=2&cp={0}~{1}&lvl={2}&dir=0&sty=h&form=LMLTCC', 
                     lat, lon, zoom);
                return String.format('<a href="{0}" target="_blank"><img src="img/bing.gif">Bing</a>', url);
            },
            viewMtM : function(lon, lat, zoom) {
                var url = String.format('http://mijndev.openstreetmap.nl/~allroads/mtm/?map=roads' +
                        '&zoom={0}&lat={1}&lon={2}&layers=B000000FFFFFFFFFFFFTFF', zoom, lat, lon);
                return String.format('<a href="{0}" target="_blank\"><img src="img/osm.gif">MtM</a>', url);
            },
            viewMapillary : function(lon, lat, zoom) {
                var url = String.format('http://www.mapillary.com/map/im/bbox/' +
                    '{0}/{1}/{2}/{3}', (lat - 0.005), (lat + 0.005), (lon - 0.005), (lon + 0.005));
                return String.format('<a href="{0}" target="_blank\"><img src="img/mapillary.png">Mapillary</a>', url);
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
                    } else {
                        lang = "";
                    }
                    var s = value.split(':'); // Subject
                    if (s.length == 2) {
                        lang = s[0] + ".";
                        subject = s[1];
                    } else {
                        subject = value;
                    }
                    var href = "http://" + lang + "wikipedia.org/wiki/"
                            + subject;
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
                    return this.makeLink("https://twitter.com/" + value, value,
                            true);
                case "facebook":
                    if (value.startsWith("http") || value.startsWith("www")
                            || value.startsWith("facebook")) {
                        return this.makeLink(value, value, true);
                    }
                    return this.makeLink("https://www.facebook.com/" + value,
                            value, true);
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
                if (!(street && number))
                    return null;
                var postcode = tags["addr:postcode"];
                var city = tags["addr:city"];
                var html = street + " " + number + "<br />\n";
                if (postcode)
                    html += postcode;
                if (postcode && city)
                    html += "  ";
                if (city)
                    html += city;
                if (postcode || city)
                    html += "<br />\n";
                return html;
            },

            /*
             * Create the html for a link
             */
            makeLink : function(href, text, newPage) {
                var html = "<a ";
                if (newPage)
                    html += 'target="_blank" ';
                if (href.indexOf(":") == -1) {
                    return html + 'href=//"' + href + '">' + text + "</a>";
                }
                return html + 'href="' + href + '">' + text + "</a>";
            },
            CLASS_NAME : "FeaturePopup"
        });

String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {       
      var reg = new RegExp("\\{" + i + "\\}", "gm");             
      s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};