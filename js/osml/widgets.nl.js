/**
 * Widgets for the Netherlands
 */

/**
 * Link to bagviewer. A website for viewing Dutch buildings and addresses.
 */
osml.widgets.ViewBagViewer = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.bagId = data.tags['ref:bag'];
        this.pc = data.tags['addr:postcode'];
        this.housenr = data.tags['addr:housenumber'];
        if (this.bagId) {
            this.useTags(data, ['ref:bag']);
            this.setActive();
        }
        else if (this.pc && this.pc.match('^[0-9]{4}[A-Z]{2}$') && this.housenr) {
            this.setActive();
        }
        else {
            return;
        };
        var params = {};
        if (this.bagId) {
            params.searchQuery = OpenLayers.Number.zeroPad(this.bagId, 16);
        } else {
            params.searchQuery = this.pc.substr(0, 4) + '+' + this.pc.substr(4, 2) + '+' + this.housenr;
        };
        var url = osml.formatUrl('https://bagviewer.kadaster.nl/lvbag/bag-viewer/index.html#/', params);
        this.setHtml(osml.makeLink(url, 'BAG Viewer: ' + params.searchQuery));
    }
});

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
osml.widgets.Bustimes = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var cxx = data.tags['cxx:code'];
        if (cxx && !isNaN(cxx)) {
            this.setActive();
            // Fetch the first code in case of multiple codes.
            cxx = cxx.split(';')[0];
            // Convert the code to a number to prevent JavaScript injection
            this.cxx = new Number(cxx);
            this.useTags(data, ['cxx:code']);
        }
    },
    render : function(parent) {
        var div = document.createElement('div');
        div.id ='bustimesbutton';
        div.setAttribute('class', 'buttonclass');
        parent.appendChild(div);
        var button = document.createElement('button');
        button.innerHTML = 'Bus times';
        div.appendChild(button);
        var self = this;
        button.addEventListener("click", function(event) {
            self.onClick(event);
        });
    },
    onClick : function(event) {
        var self = this;
        var url = 'http://v0.ovapi.nl/tpc/' + this.cxx;
        $.getJSON(url, function(data, status) {
            if (status == 'success') {
                var stop = null;
                for (var id in data) { // Get the first (only) stop
                    stop = data[id];
                    break;
                };
                var html = self.getDeparturesHtml(stop);
                var map = osml.site.map;
                var popup = new OpenLayers.Popup('bustimes', map.getCenter(), OpenLayers.Size(300, 200), html, true, null);
                popup.border = null;
                map.addPopup(popup);
            };
        });
    },
    // TODO Create departures Popup
    getDeparturesHtml : function(data) {
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
    }
});