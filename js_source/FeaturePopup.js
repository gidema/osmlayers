/**
 * FeaturePopup The FeaturePopup class creates the Popup window for the info
 * about the selected OSM feature
 */
FeaturePopup = OpenLayers.Class({
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
                    usedTags : {},
                    lonlat : lonlat,
                    lon : lonlat.lon,
                    lat : lonlat.lat,
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
                var widgets = [
                    new osml.widgets.Title(data),
                    new osml.widgets.Address(data),
                    new osml.widgets.Phone(data),
                    new osml.widgets.Email(data),
                    new osml.widgets.Website(data, 'www'),
                    new osml.widgets.Twitter(data, 'url'),
                    new osml.widgets.Facebook(data),
                    new osml.widgets.Wikipedia(data)
                ];
                var widget = new osml.widgets.WidgetGroup(data, widgets, 'plain');
                widget.check();
                var html = widget.toHtml();
                this.addTab('popup-main', 'General', html);
            },

            addDetailTab : function(data) {
                var widgets = [
                    new osml.widgets.BrowseOsm(data),
                    new osml.widgets.UnusedTags(data)
                ];
                var widget = new osml.widgets.WidgetGroup(data, widgets, 'plain');
                widget.check();
                var html = widget.toHtml();
                this.addTab('popup-detail', 'Detail', html);
            },
            
            addViewTab : function(data) {
                var widgets = [
                    new osml.widgets.ViewOsm(data),
                    new osml.widgets.ViewGoogle(data),
                    new osml.widgets.ViewBing(data),
                    new osml.widgets.ViewMtM(data),
                    new osml.widgets.ViewMapillary(data),
                    new osml.widgets.ViewBagViewer(data),
                    new osml.widgets.ViewOpenKvk(data),
                    new osml.widgets.ViewKvk(data)
                ];
                var widget = new osml.widgets.WidgetGroup(data, widgets, 'ul');
                var html = '';
                if (widget.check()) {
                    html += widget.toHtml();
                }
                this.addTab('popup-view', 'View', html);
            },
            addEditTab : function(data) {
                var widgets = [
                    new osml.widgets.EditJosm(data),
                    new osml.widgets.EditOnline(data, 'id'),
                    new osml.widgets.EditOnline(data, 'potlatch')
                ];
                var html = '<h2>Edit area with:</h2>';
                html += '<ul>';
                for (var i = 0; i<widgets.length; i++) {
                    var widget = widgets[i];
                    html += '<li>' + widget.toHtml() + '</li>\n';
                };
                html += '</ul>';
                this.addTab('popup-edit', 'Edit', html);
            },
            CLASS_NAME : "FeaturePopup"
        });

String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {       
      var reg = new RegExp('\\{" + i + "\\}', 'gm');             
      s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};

