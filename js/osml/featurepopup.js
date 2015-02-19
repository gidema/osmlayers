window.osml = window.osml || {};
/**
 * FeaturePopup The FeaturePopup class creates the Popup window for the info
 * about the selected OSM feature
 */
osml.FeaturePopup = OpenLayers.Class(OpenLayers.Popup, {
            zoom : 18, // Zoom level for viewing on other sites

            // Constructor
            initialize : function(event, map) {
                var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
                OpenLayers.Popup.prototype.initialize.apply(this, 
                        ['location_info', lonlat, new OpenLayers.Size(350, 250), '', true]);
                this.lonlatWgs84 = lonlat.clone().transform(map.projection,
                        map.displayProjection); // WGS84 coordinaten
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
                    lonlat : this.lonlatWgs84,
                    lon : this.lonlatWgs84.lon,
                    lat : this.lonlatWgs84.lat,
                    zoom : this.zoom
                });
            },

            /*
             * Create the popup content
             */
            processElement : function(data) {
                var tabPane = new osml.widgets.TabPane([
                    {
                        id : 'popup-main',
                        name : 'General',
                        widget : this.createMainTab()
                    },
                    {
                        id : 'popup-detail',
                        name : 'Detail',
                        widget : this.createDetailTab()
                    },
                    {
                        id : 'popup-view',
                        name : 'View',
                        widget : this.createViewTab()
                    },
                    {
                        id : 'popup-edit',
                        name : 'Edit',
                        widget : this.createEditTab()
                    }]);
                tabPane.prepare(data);
                if (tabPane.check()) {
                    tabPane.render(this.contentDiv);
                }
//                this.addDetailTab(data);
//                this.addViewTab(data);
//                this.addEditTab(data);
                $(this.contentDiv).tabs();
                // a bit of a hack to prevent the parent class from overwriting the content.
                this.contentHTML = this.contentDiv.innerHTML;
            },
            createMainTab : function() {
                var widgets = [
                        'osml.widgets.Title',
                        'osml.widgets.Bustimes',
                        'osml.widgets.Address',
                        'osml.widgets.Phone',
                        'osml.widgets.Email',
                        new Array('osml.widgets.Website', 'website'),
                        new Array('osml.widgets.Website', 'url'),
                        'osml.widgets.Twitter',
                        'osml.widgets.Facebook',
                        'osml.widgets.Wikipedia'
                    ];
                return new osml.widgets.WidgetGroup(widgets, 'plain');
            },
            createDetailTab : function() {
                var widgets = [
                    'osml.widgets.BrowseOsm',
                    'osml.widgets.UnusedTags'
                ];
                return new osml.widgets.WidgetGroup(widgets, 'plain');
            },
            createViewTab : function() {
                var widgets = [
                    'osml.widgets.ViewOsm',
                    'osml.widgets.ViewGoogle',
                    'osml.widgets.ViewBing',
                    'osml.widgets.ViewMtM',
                    'osml.widgets.ViewMapillary'//,
//                    'osml.widgets.ViewDeHollandseMolen',
//                    'osml.widgets.ViewMolendatabase',
//                    'osml.widgets.ViewBagViewer',
//                    'osml.widgets.ViewOpenKvk',
//                    'osml.widgets.ViewKvk'
                ];
                return new osml.widgets.WidgetGroup(widgets, 'ul');
            },
            createEditTab : function() {
                var widgets = [
                    new Array('osml.widgets.HtmlWidget', '<h2>Edit area with:</h2>'),
                    'osml.widgets.EditJosm',
                    new Array('osml.widgets.EditOnline', 'id'),
                    new Array('osml.widgets.EditOnline', 'potlatch')
                ];
                return new osml.widgets.WidgetGroup(widgets, 'ul');
            },
            CLASS_NAME : 'osml.FeaturePopup'
        });
