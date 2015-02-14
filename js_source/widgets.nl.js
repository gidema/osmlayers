/**
 * Widgets for the Netherlands
 */

/**
 * Link to bagviewer. A website for viewing Dutch buildings and addresses.
 */
osml.widgets.ViewBagViewer = function(data) {
    var bagId = data.tags['ref:bag'];
    
    this.check = function() {
        if (bagId) {
            data.usedTags['ref:bag'] = true;
            return true;
        }
    };
    
    this.toHtml = function() {
        var id = OpenLayers.Number.zeroPad(bagId, 16);
        var params = {
            searchQuery : id
        };
        var url = osml.formatUrl('https://bagviewer.kadaster.nl/lvbag/bag-viewer/index.html#/', params);
        return osml.makeLink(url, 'BAG Viewer: ' + id);
    };
};

/**
 * Link to Openkvk.nl. A Dutch open-source site for viewing chamber of commerce data.
 * Selection is currently only supported on postcode level. 
 */
osml.widgets.ViewOpenKvk = function(data) {
    var postcode = data.tags['addr:postcode'];
    
    this.check = function() {
        if (postcode && postcode.match('^[0-9]{4}[A-Z]{2}$')) {
            return true;
        }
    };
    
    this.toHtml = function() {
        var url = 'https://openkvk.nl/zoeken/' + postcode;
        return osml.makeLink(url, 'Open KvK (Chambre of commerce)');
    };
};

/**
 * Link to the Dutch KvK (Chamber of commerce) site.
 * selection is based on postcode and housenumber
 * 
 * @param data
 * @returns {osml.widgets.ViewKvk}
 */
osml.widgets.ViewKvk = function(data) {
    var postcode = data.tags['addr:postcode'];
    var housenr = data.tags['addr:housenumber'];
    
    this.check = function() {
        if (postcode && postcode.match('^[0-9]{4}[A-Z]{2}$')) {
            return true;
        }
    };
    
    this.toHtml = function() {
        var params = {
            q : postcode + (housenr ? ' ' + housenr : '')
        };
        var url = osml.formatUrl('http://www.kvk.nl/orderstraat/', params);
        return osml.makeLink(url, 'KvK (Chambre of commerce)');
    };
};

/**
 * Link to the (wind)mill site 'De hollandse Molen'
 * 
 * @param data
 * @returns {osml.widgets.ViewKvk}
 */
osml.widgets.ViewDeHollandseMolen = function(data) {
    var dhm_id = data.tags['dhm_id'];
    
    this.check = function() {
        if (dhm_id) {
            data.usedTags['dhm_id'] = true;
            return true;
        }
    };
    
    this.toHtml = function() {
        var params = {
            v : '1',
            mid : dhm_id,
            molenid : dhm_id
        };
        var url = osml.formatUrl('http://www.molens.nl/site/dbase/molen.php', params);
        return osml.makeLink(url, 'De Hollandsche Molen');
    };
};

osml.widgets.ViewMolendatabase = function(data) {
    var mdb_id = data.tags['mdb_id'];
    
    this.check = function() {
        if (mdb_id) {
            data.usedTags['mdb_id'] = true;
            return true;
        }
    };
    
    this.toHtml = function() {
        var params = {
            nummer : mdb_id
        };
        var url = osml.formatUrl('http://www.molendatabase.nl/nederland/molen.php', params);
        return osml.makeLink(url, 'Molendatabase');
    };
};
