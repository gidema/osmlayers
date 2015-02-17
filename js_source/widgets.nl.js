/**
 * Widgets for the Netherlands
 */

/**
 * Link to bagviewer. A website for viewing Dutch buildings and addresses.
 */
osml.widgets.ViewBagViewer = function(data) {
    var bagId = data.tags['ref:bag'];
    var pc = data.tags['addr:postcode'];
    var housenr = data.tags['addr:housenumber'];
    
    this.check = function() {
        if (bagId) {
            data.usedTags['ref:bag'] = true;
            return true;
        }
        if (pc && pc.match('^[0-9]{4}[A-Z]{2}$') && housenr) {
            return true;
        }
    };
    
    this.toHtml = function() {
        var params = {};
        if (bagId) {
            params.searchQuery = OpenLayers.Number.zeroPad(bagId, 16);
        } else {
            params.searchQuery = pc.substr(0, 4) + '+' + pc.substr(4, 2) + '+' + housenr;
        };
        var url = osml.formatUrl('https://bagviewer.kadaster.nl/lvbag/bag-viewer/index.html#/', params);
        return osml.makeLink(url, 'BAG Viewer: ' + params.searchQuery);
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
osml.widgets.Bustimes = function(data) {
    var cxx = data.tags['cxx:code'];
    
    this.check = function() {
        if (cxx) {
            data.usedTags['cxx:code'] = true;
            return true;
        }
    };
    
    this.toHtml = function() {
        return '<div id="bustimesbutton" class="buttonclass">' +
            '<button onclick="osml.widgets.Bustimes.showBustimes(' + cxx +')">Bus times</button>' +
            '</div>';
    };
};
osml.widgets.Bustimes.showBustimes = function(userStopCode) {
    var url = 'http://v0.ovapi.nl/tpc/' + userStopCode;
    $.getJSON(url, function(data, status) {
        if (status == 'success') {
            var stop = null;
            for (var id in data) { // Get the first (only) stop
                stop = data[id];
                break;
            };
            var html = osml.widgets.Bustimes.getHtml(stop);
            var popup = new OpenLayers.Popup('bustimes', osmLayers.map.getCenter(), OpenLayers.Size(300, 200), html, true, null);
            osmLayers.map.addPopup(popup);
        }
    });
};
osml.widgets.Bustimes.getHtml = function(data) {
    var html = '<h3>' + data.Stop.TimingPointName + ' (' + data.Stop.TimingPointCode + ')</h3>' +
        '<table class="bustimes">' +
        '<tr><th>Direction</th><th>Line</th><th>Departure</th></tr>';
    var timeTable = [];
    for (var key in data.Passes) {
        var pass = data.Passes[key];
        timeTable.push({
            destination : pass.DestinationName50,
            lineNumber : pass.LinePublicNumber,
            departure : new Date(pass.ExpectedDepartureTime)
        });
    };
    // Sort the timeTable
    timeTable.sort(function(a, b) {
        if (a.departure == b.departure) return 0;
        return (a.departure < b.departure ? -1 : 1);
    });
    for (var i=0; i<timeTable.length; i++) {
        var row = timeTable[i];
        html += '<tr>';
        html += '<td>' + row.destination + '</td>';
        html += '<td>' + row.lineNumber + '</td>';
        html += '<td>' + row.departure.toLocaleTimeString() + '</td>';
        html += '</tr>';
    };
    html += '</table>';
    return html;
};