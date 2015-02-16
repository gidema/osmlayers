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
