/* ======================================================================
    OpenLayers/Format/OSMExtended.js
   ====================================================================== */

/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
/*
 * Extended with an option to show the center of an area as a node
 */

/**
 * @requires OpenLayers/Format/XML.js
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/LineString.js
 * @requires OpenLayers/Geometry/Polygon.js
 * @requires OpenLayers/Projection.js
 */

/**  
 * Class: OpenLayers.Format.OSM
 * OSM parser. Create a new instance with the 
 *     <OpenLayers.Format.OSM> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 */
OpenLayers.Format.OSMExtended = OpenLayers.Class(OpenLayers.Format.XML, {
    /**
     * Constructor: OpenLayers.Format.OSM
     * Create a new parser for OSM.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        layer_defaults = OpenLayers.Util.extend(layer_defaults, options);
        
        // OSM coordinates are always in longlat WGS84
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");
        
//        OpenLayers.Format.XML.prototype.initialize.apply(this, [layer_defaults]);
    },
    
    /**
     * APIMethod: read
     * Return a list of features from a Nominatim xml response
     
     * Parameters:
     * doc - {Element} 
     *
     * Returns:
     * Array({<OpenLayers.Feature.Vector>})
     */
    read: function(doc) {
        if (typeof doc == "string") { 
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }

        var pois = this.getPois(doc);
        var feat_list = [];
        
        for (var i = 0; i < pois.length; i++) {
            var poi = pois[i];
            var feat = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(poi['lon'], poi['lat']),
                poi.tags);
            if (this.internalProjection && this.externalProjection) {
                feat.geometry.transform(this.externalProjection, 
                    this.internalProjection);
            }
            feat.osm_id = parseInt(poi.id);
            feat.fid = poi.type + "." + poi.osm_id;
            feat_list.push(feat);
        }
      return feat_list;
    },

    /**
     * Method: getPlaces
     * Return the place items from a doc.  
     *
     * Parameters:
     * doc - {DOMElement} node to parse places from
     */
    getPois: function(doc) {
        var node_list = doc.getElementsByTagName("place");
        var pois = {};
        for (var i = 0; i < node_list.length; i++) {
            var node = node_list[i];
            var id = node.getAttribute("id");
            pois[id] = {
                lat: node.getAttribute("lat"),
                lon: node.getAttribute("lon"),
                node: node,
                type: node.getAttribute("osm_type"),
                osm_id: node.getAttribute("osm_id"),
                tagKey: node.getAttribute("class"),
                tagValue: node.getAttribute("type"),
                tags: getTags(node)
            };
        }
        return pois;
    },

    
    /**
     * Method: getTags
     * Return the tags list attached to a specific DOM element.
     *
     * Parameters:
     * dom_node - {DOMElement} node to parse tags from
     * interesting_tags - {Boolean} whether the return from this function should
     *    return a boolean indicating that it has 'interesting tags' -- 
     *    tags like attribution and source are ignored. (To change the list
     *    of tags, see interestingTagsExclude)
     * 
     * Returns:
     * tags - {Object} hash of tags
     * interesting - {Boolean} if interesting_tags is passed, returns
     *     whether there are any interesting tags on this element.
     */
    getTags: function(dom_node) {
        var children = dom_node.getElementsByTagName("*");
        var tags = {};
        for (var j = 0; j < tag_list.length; j++) {
            var child = children;
            tags[child.tagName] = child.innerHtml;
        }  
        return tags;
    },
    CLASS_NAME: "OpenLayers.Format.OSMNominatim" 
});     
