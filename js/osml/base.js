/**
 * Base namespace for the OsmLayers library.  Checks to see osml is already
 * defined in the current scope before assigning to prevent clobbering if
 * base.js is loaded more than once.
 */

var /**
 * @author Gertjan Idema <mail@gertjanidema.nl>
 *
 */
/**
 * @author Gertjan Idema <mail@gertjanidema.nl>
 *
 */
osml = osml || {};

/**
 * Create a new OsmLayers site
 */
osml.init = function(options) {
    osml.site = new osml.Site(options);
};

/**
 * 'Classes'
 */
osml.LayerDef = OpenLayers.Class({
    id : null,
    name : null,
    filter : null,
    marker : null,

    initialize : function LayerDef(id, name, query, marker) {
        this.id = id;
        this.name = name;
        this.query = query;
        this.filter = this.createFilter(query);
        this.marker = marker;
    },

    createFilter : function(query) {
        var f = "(";
        var parts = query.split(",");
        if (parts.length > 1) {
            $.each(parts, function(index, value) {
                f += "node" + value + "(bbox);way" + value + "(bbox);rel"
                        + value + "(bbox);";
            });
            return f + ");(._;>;);out center;";
        }
        return "(node[" + query + "](bbox);way[" + query + "](bbox);rel["
                + query + "](bbox););(._;>;);out center;";
    }

});

osml.LayerGroup = OpenLayers.Class({
    id : null,
    name : null,
    layers : null,

    initialize : function(site, id, name, layerIds) {
        this.id = id;
        this.name = name;
        this.layers = [];
        layerIds.forEach(function(id) {
            var layer = site.layers[id];
            if (layer) {
                this.layers.push(layer);
            } else {
                alert("Unknown layer: " + id);
            }
        }, this);
    }
});

/**
 * Utility functions
 */


/**
 * Create html code for a link
 * 
 * @param {String} href The target url
 * @param {String} text
 * @param {boolean | undefined} newPage Open the link on a new page if true or undefined
 * 
 * @returns {String} The html code
 */
osml.makeLink = function(href, text, newPage) {
    var html = "<a ";
    if (typeof newPage == 'undefined' || newPage === true)
        html += 'target="_blank" ';
    if (href.indexOf(":") == -1) {
        return html + 'href=//"' + href + '">' + text + "</a>";
    }
    return html + 'href="' + href + '">' + text + "</a>";
};

osml.formatString = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {       
      var reg = new RegExp('\\{' + i + '\\}', 'gm');             
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

osml.formatUrl = function(url, params) {
    var u = url;
    var first = true;
    for (var key in params) {
        if (first === true) {
            u = u + '?';
            first = false;
        }
        else {
            u = u + '&';
        }
        u = u + key + '=' + params[key];
    }
    return u;
};
