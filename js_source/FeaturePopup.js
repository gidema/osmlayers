window.osml = window.osml || {};
/**
 * FeaturePopup The FeaturePopup class creates the Popup window for the info
 * about the selected OSM feature
 */
osml.FeaturePopup = OpenLayers.Class(OpenLayers.Popup, {
            xy : null, // map projection coordinates
            lonlat : null, // WGS84 coordinates 
            zoom : 18, // Zoom level for viewing on other sites

            // Constructor
            initialize : function(event, map) {
                this.xy = event.feature.geometry.getBounds().getCenterLonLat();
                this.lonlat = this.xy.clone().transform(map.projection,
                        map.displayProjection); // WGS84 coordinaten
                OpenLayers.Popup.prototype.initialize.apply(this, 
                        ['location_info', this.xy, new OpenLayers.Size(350, 250), '', true]);
                this.closeOnMove = false;
                this.autoSize = false;
                this.panMapIfOutOfView = true;
                this.opacity = null;
                this.processFeature(event.feature);
            },
            /*
             * Create the div element for a single feature
             */
            processFeature : function(feature) {
                var fid = feature.fid.split(".");
                return this.processElement({
                    type : fid[0],
                    id : fid[1],
                    tags : feature.attributes,
                    usedTags : {},
                    lonlat : this.lonlat,
                    lon : this.lonlat.lon,
                    lat : this.lonlat.lat,
                    zoom : this.zoom
                });
            },

            /*
             * Create the popup content
             */
            processElement : function(data) {
                this.contentDiv.innerHTML = '<ul></ul>';
                this.addMainTab(data);
                this.addDetailTab(data);
                this.addViewTab(data);
                this.addEditTab(data);
                $(this.contentDiv).tabs();
                // a bit of a hack to prevent the parent class from overwriting the content.
                this.contentHTML = this.contentDiv.innerHTML;
            },

            addTab : function(id, name, html) {
                var li = document.createElement('li');
                li.innerHTML = '<a href="#' + id + '">' + name + '</a>';
                this.contentDiv.firstChild.appendChild(li);
                var tab = document.createElement('div');
                tab.id = id;
                tab.innerHTML = html;
                this.contentDiv.appendChild(tab);
            },

            addMainTab : function(data) {
                var widgets = [
                    new osml.widgets.Title(data),
                    new osml.widgets.Bustimes(data),
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
                    new osml.widgets.ViewDeHollandseMolen(data),
                    new osml.widgets.ViewMolendatabase(data),
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
