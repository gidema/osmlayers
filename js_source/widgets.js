// Temporarily define the osml namespace here.
window.osml = window.osml || {};
window.osml.widgets = window.osml.widgets || {};

osml.widgets.Title = function(data) {
    var title = '';
    this.check = function() {
        var tags = data.tags;
        title = tags.name;
        if (!title) return false;
        data.usedTags.name = true;
        return true;
    };
    this.toHtml = function() {
        return '<h2 class="title">' + title + '</h2>\n';
    };
};

osml.widgets.Address = function(data) {
    this.street = '';
    this.number = '';
    this.postcode = '';
    this.city = '';
    this.check = function() {
        var tags = data.tags;
        this.street = tags['addr:street'];
        this.number = tags['addr:housenumber'];
        if (!this.street || !this.number) {
            return false;
        };
        this.postcode = tags['addr:postcode'];
        this.city = tags['addr:city'];
        data.usedTags['addr:street'] = true;
        data.usedTags['addr:housenumber'] = true;
        data.usedTags['addr:postcode'] = true;
        data.usedTags['addr:city'] = true;
        return true;
    };
    
    this.toHtml = function() {
        var html = this.street + '&nbsp;' + this.number + '<br />\n' +
            (this.postcode ? this.postcode + '&nbsp;&nbsp;' : '') +
            (this.city ? this.city : '') +
            (this.postcode || this.city ? '<br />\n' : '');
        return '<div class="address">' + html + '</div>';
    };
};

osml.widgets.Website = function(data, type) {
    var site = '';
    this.check = function() {
        site = data.tags.website;
        if (!site) return false;
        data.usedTags.website = true;
        return true;
    };
    this.toHtml = function() {
        var link = osml.makeLink(site, site, true);
        return '<div class="website">' + link + '</div>';
    };
};

osml.widgets.Phone = function(data) {
    var phone = '';
    this.check = function() {
        phone = data.tags.phone;
        if (!phone) return false;
        data.usedTags.phone = true;
        return true;
    };
    this.toHtml = function() {
        var link = osml.makeLink("tel:" + phone, phone, true);
        return '<div class="phone">' + link + '</div>';

    };
};

osml.widgets.Email = function(data) {
    var email = data.tags.email;
    this.check = function() {
        if (!email) return false;
        data.usedTags.email = true;
        return true;
    };
    this.toHtml = function() {
        var link = osml.makeLink("mailto:" + email, email, true);
        return '<div class="email">' + link + '</div>';
    };
};
osml.widgets.Fax = function(data) {
    var fax = data.tags.fax;
    this.check = function() {
        if (!fax) return false;
        data.usedTags.fax = true;
        return true;
    };
    this.toHtml = function() {
        var link = osml.makeLink("fax:" + fax, fax, true);
        return '<div class="fax">Fax:&nbsp;' + link + '</div>';
    };
};
osml.widgets.Twitter = function(data) {
    var twitter = data.tags.twitter;
    this.check = function() {
        if (!twitter) return false;
        data.usedTags.twitter = true;
        return true;
    };
    this.toHtml = function() {
        var link = osml.makeLink('https://twitter.com/' + twitter, '@' + twitter, true);
        return '<div class="twitter">Twitter:&nbsp;' + link + '</div>';
    };
};

osml.widgets.Facebook = function(data) {
    var value = data.tags.facebook;
    this.check = function() {
        if (!value) return false;
        data.usedTags.facebook = true;
        return true;
    };
    this.toHtml = function() {
        var link = '';
        if (value.startsWith('http') || value.startsWith('www')
                || value.startsWith('facebook')) {
            link = osml.makeLink(value, value, true);
        }
        else {
            link = osml.makeLink('https://www.facebook.com/' + value, value, true);
        };
        return '<div class="facebook">Facebook:&nbsp;' + link + '</div>';
    };
};

osml.widgets.Wikipedia = function(data) {
    this.wiki = {};
    this.lang = '';
    
    this.check = function() {
        var tags = data.tags;
        for (var key in tags) {
            if (key.substr(0, 9) == 'wikipedia') {
                this.wiki[key] = tags[key];
                data.usedTags[key] = true;
            };
        };
        if (this.wiki.length == 0) return false;
        return true;
    };
    
    this.toHtml = function() {
        var html = '';
        for (var key in this.wiki) {
            html = this.wikiToHtml(key);
        }
        return html;
    };
    
    this.wikiToHtml = function(key) {
        k = key.split(':');
        if (k.length == 2) {
            this.lang = k[1] + '.';
        }
        var value = this.wiki[key];
        var s = value.split(':'); // Subject
        if (s.length == 2) {
            this.lang = s[0] + '.';
            this.subject = s[1];
        } else {
            this.subject = value;
        }
        var href = 'http://' + this.lang + 'wikipedia.org/wiki/'
                + this.subject;
        return '<div class="wikipedia">' + osml.makeLink(href, 'Wikipedia', true) + '</div>';
    };
};

osml.widgets.BrowseOsm = function(data) {
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatString('http://www.openstreetmap.org/browse/{0}/{1}/', data.type, data.id);
        var label = data.type + " " + data.id;
        return osml.makeLink(url, label);
    };
};

osml.widgets.UnusedTags = function(data) {
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var html = '<dl>';
        $.each(data.tags, function(key, val) {
            if (!data.usedTags[key]) {
                var url = osml.formatString("http://wiki.openstreetmap.org/wiki/Key:{0}", key);
                var link = osml.makeLink(url, key);
                html += osml.formatString('<dt>{0}</dt><dd>{1}</dd>\n', link, val);
            }
        });
        html += '</dl>';
        return html;
    };
};

/**
 * 
 * @param data
 * @returns {osml.widgets.ViewOsm}
 */
osml.widgets.ViewOsm = function(data) {
    var params = {
        lat : data.lat,
        lon : data.lon,
        zoom : data.zoom
    };
    
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatUrl('http://www.openstreetmap.org', params);
        return osml.makeLink(url, '<img src="img/osm.gif">OSM');
    };
};

osml.widgets.ViewGoogle = function(data) {
    var params = {
        ll : data.lat + ',' + data.lon,
        zoom : data.zoom,
        t : 'h'
    };
    
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatUrl('https://maps.google.nl/maps', params);
        return osml.makeLink(url, '<img src="img/google.gif">Google');
    };
};

osml.widgets.ViewBing = function(data) {
    var params = {
        v : '2',
        cp : data.lat + '~' + data.lon,
        lvl : data.zoom,
        dir : '0',
        sty : 'h',
        form : 'LMLTCC'
    };
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatUrl('http://www.bing.com/maps/', params);
        return osml.makeLink(url, '<img src="img/bing.gif">Bing');
    };
};

osml.widgets.ViewMtM = function(data) {
    var params = {
        map : 'roads',
        zoom : data.zoom,
        lat : data.lat,
        lon : data.lon,
        layers : 'B000000FFFFFFFFFFFFTFF'
    };
    
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatUrl('http://mijndev.openstreetmap.nl/~allroads/mtm/', params);
        return osml.makeLink(url, '<img src="img/osm.gif">MtM');
    };
};
osml.widgets.ViewMapillary = function(data) {
    var lat = data.lat;
    var lon = data.lon;
    
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var url = osml.formatString('http://www.mapillary.com/map/im/bbox/{0}/{1}/{2}/{3}',
            (lat - 0.005), (lat + 0.005), (lon - 0.005), (lon + 0.005));
        return osml.makeLink(url, '<img src="img/mapillary.png">Mapillary');
    };
};

osml.widgets.EditJosm = function(data) {
    var area = 0.002; // was 0.01
    var top = data.lat + area;
    var left = data.lon - area;
    var params = {
        top : top,
        bottom : top - (2 * area),
        left : left,
        right : left + (2 * area),
        select : data.type + data.id
    };
    
    this.check = function() {
        return true;
    };

    this.toHtml = function() {
        var url = osml.formatUrl('http://localhost:8111/load_and_zoom', params);
        return osml.makeLink(url, 'JOSM');

    };
};

osml.widgets.EditOnline = function(data, type) {
    var params = {
            editor : type,
            lon : data.lon,
            lat : data.lat,
            zoom : data.zoom
    };
    
    this.check = function() {
        return true;
    };
    
    this.toHtml = function() {
        var name = (type == 'id' ? 'ID&nbsp;editor' : 'Potlatch&nbsp2');
        var url = osml.formatUrl('http://www.openstreetmap.org/edit', params);
        return osml.makeLink(url, name);
    };
};

osml.widgets.WidgetGroup = function(data, widgets, format) {
    this.check = function() {
        var check = false;
        for (var i = 0; i<widgets.length; i++) {
            check = check || widgets[i].check();
        }
        return check;
    };
    
    this.toHtml = function() {
        switch (format) {
        case 'plain':
            return this.toHtmlPlain();
        case 'ul':
            return this.toHtmlUl();
        }
    };
    
    this.toHtmlPlain = function() {
        var html = '';
        for (var i = 0; i<widgets.length; i++) {
            var widget = widgets[i];
            if (widget.check()) {
                html += widget.toHtml() + '\n';
            };
        };
        return html;
    };
    
    this.toHtmlUl = function() {
        var html = '<ul>';
        for (var i = 0; i<widgets.length; i++) {
            var widget = widgets[i];
            if (widget.check()) {
                html += '<li>' + widget.toHtml() + '</li>\n';
            };
        };
        html += '</ul>';
        return html;
    };
};

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


