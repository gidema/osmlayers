/**
 * osml.widgets namespace
 */
osml.widgets = osml.widgets || {};

/**
 * Basic widget. This is the base class for all widgets
 */
osml.widgets.Widget = OpenLayers.Class({
    initialize: function() {
        this.html = '';
        this.active = false;
    },
    prepare: function(data) {
        return;
    },
    check: function() {
        return this.active;
    },
    render: function(parent) {
        parent.innerHTML += this.html;
    },
    useTags: function(data, tags) {
        for (var i=0; i<tags.length; i++) {
            data.usedTags[tags[i]] = true;
        }
    },
    setActive: function() {
        this.active = true;
    },
    setHtml: function(html) {
        this.html = html;
        this.active = true;
    }
});

/**
 * HtmlWidget. Simple widget using plain HTML code
 */
osml.widgets.HtmlWidget = OpenLayers.Class(osml.widgets.Widget, {
    initialize: function(html) {
        this.setHtml(html);
    }
});

/**
 * 
 * @param data
 * @returns {osml.widgets.Title}
 */

osml.widgets.Title = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.title = data.tags.name;
        if (this.title) {
            this.useTags(data, ['name']);
            this.active = true;
            this.setHtml('<h2 class="title">' + this.title + '</h2>\n');
        }
    }
});

osml.widgets.Address = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var tags = data.tags;
        this.street = tags['addr:street'];
        this.number = tags['addr:housenumber'];
        if (this.street) {
            this.postcode = tags['addr:postcode'];
            this.city = tags['addr:city'];
            this.country = tags['addr:country'];
            this.useTags(data, ['addr:street', 'addr:housenumber',
                 'addr:postcode', 'addr:city', 'addr:country']);
            this.setHtml(this.toHtml());
        };
    },
    toHtml : function() {
        var html = this.street + '&nbsp;' + this.number + '<br />\n' +
            (this.postcode ? this.postcode + '&nbsp;&nbsp;' : '') +
            (this.city ? this.city : '') +
            (this.postcode || this.city ? '<br />\n' : '');
            (this.country ? this.country + '<br />\n' : '');
        return '<div class="address">' + html + '</div>';
    }
});

osml.widgets.Website = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(type) {
        this.type = type;
    },
    prepare : function(data) {
        this.site = data.tags[this.type];
        if (this.site) {
            this.useTags(data, [this.type]);
            var link = osml.makeLink(this.site, this.type, true);
            this.setHtml('<div class="website">' + link + '</div>');
        };
    }
});

osml.widgets.Phone = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.phone = data.tags.phone;
        if (this.phone) {
            this.useTags(data, ['phone']);
            var link = osml.makeLink("tel:" + this.phone, this.phone, true);
            this.setHtml('<div class="phone">' + link + '</div>');
        }
    }
});

osml.widgets.Email = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.email = data.tags.email;
        if (this.email) {
            this.useTags(data, ['email']);
            var link = osml.makeLink("mailto:" + this.email, this.email, true);
            this.setHtml('<div class="email">' + link + '</div>');
        }
    }
});

osml.widgets.Fax = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.fax = data.tags.fax;
        if (this.fax) {
            this.useTags(data, ['fax']);
            var link = osml.makeLink("fax:" + this.fax, this.fax, true);
            this.setHtml('<div class="fax">Fax:&nbsp;' + link + '</div>');
        }
    }
});

osml.widgets.Twitter = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.twitter = data.tags.twitter;
        if (this.twitter) {
            this.useTags(data, ['twitter']);
            var link = osml.makeLink('https://twitter.com/' + this.twitter, '@' + this.twitter);
            this.setHtml('<div class="twitter">Twitter:&nbsp;' + link + '</div>');
        }
    }
});

osml.widgets.Facebook = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.fb = data.tags.facebook;
        if (this.fb) {
            this.useTags(data, ['facebook']);
            var link = '';
            if (this.fb.startsWith('http') || this.fb.startsWith('www')
                || this.fb.startsWith('facebook')) {
                link = osml.makeLink(this.fb, this.fb, true);
            }
            else {
                link = osml.makeLink('https://www.facebook.com/' + this.fb, this.fb);
            };
            this.setHtml('<div class="facebook">Facebook:&nbsp;' + link + '</div>');
        }
    }
});

osml.widgets.Wikipedia = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        this.wiki = {};
        this.lang = '';
        var tags = data.tags;
        for (var key in tags) {
            if (key.substr(0, 9) == 'wikipedia') {
                this.wiki[key] = tags[key];
                this.useTags(data, [key]);
            };
        };
        if (this.wiki.length > 0) {
            var html = '';
            for (var key in this.wiki) {
                html = this.wikiToHtml(key);
            }
            this.setHtml(html);
        }
    },
    wikiToHtml : function(key) {
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
    }
});

osml.widgets.BrowseOsm = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var url = osml.formatString('http://www.openstreetmap.org/browse/{0}/{1}/', data.type, data.id);
        var label = data.type + " " + data.id;
        this.setHtml(osml.makeLink(url, label));
    }
});

osml.widgets.UnusedTags = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(format) {
        this.format = format ? format : 'dl';
    },
    prepare : function(data) {
        if (this.format === 'table') {
            this.setHtml(this.formatTable(data));
        }
        else {
            this.setHtml(this.formatDl(data));
        }
    },
    formatDl : function(data) {
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
    },
    formatTable : function(data) {
        var html = '<table>';
        $.each(data.tags, function(key, val) {
            if (!data.usedTags[key]) {
                var url = osml.formatString("http://wiki.openstreetmap.org/wiki/Key:{0}", key);
                var link = osml.makeLink(url, key);
                html += osml.formatString('<tr><td>{0}</td><td>{1}</td></tr>\n', link, val);
            }
        });
        html += '</table>';
        return html;
    }
});

/**
 * 
 * @param data
 * @returns {osml.widgets.ViewOsm}
 */
osml.widgets.ViewOsm = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var params = {
            lat : data.lat,
            lon : data.lon,
            zoom : data.zoom
        };
        var url = osml.formatUrl('http://www.openstreetmap.org', params);
        this.setHtml(osml.makeLink(url, '<img src="img/osm.gif">OSM'));
    }
});

osml.widgets.ViewGoogle = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var params = {
            ll : data.lat + ',' + data.lon,
            zoom : data.zoom,
            t : 'h'
        };
        var url = osml.formatUrl('https://maps.google.nl/maps', params);
        this.setHtml(osml.makeLink(url, '<img src="img/google.gif">Google'));
    }
});

osml.widgets.ViewBing =  OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var params = {
            v : '2',
            cp : data.lat + '~' + data.lon,
            lvl : data.zoom,
            dir : '0',
            sty : 'h',
            form : 'LMLTCC'
        };
        var url = osml.formatUrl('http://www.bing.com/maps/', params);
        this.setHtml(osml.makeLink(url, '<img src="img/bing.gif">Bing'));
    }
});

osml.widgets.ViewMtM = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var params = {
            map : 'roads',
            zoom : data.zoom,
            lat : data.lat,
            lon : data.lon,
            layers : 'B000000FFFFFFFFFFFFTFF'
        };
        var url = osml.formatUrl('http://mijndev.openstreetmap.nl/~allroads/mtm/', params);
        this.setHtml(osml.makeLink(url, '<img src="img/osm.gif">MtM'));
    }
});

osml.widgets.ViewMapillary = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
        var lat = data.lat;
        var lon = data.lon;
        var url = osml.formatString('http://www.mapillary.com/map/im/bbox/{0}/{1}/{2}/{3}',
            (lat - 0.005), (lat + 0.005), (lon - 0.005), (lon + 0.005));
        this.setHtml(osml.makeLink(url, '<img src="img/mapillary.png">Mapillary'));
    }
});

osml.widgets.EditJosm = OpenLayers.Class(osml.widgets.Widget, {
    prepare : function(data) {
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
        var url = osml.formatUrl('http://localhost:8111/load_and_zoom', params);
        this.setHtml(osml.makeLink(url, 'JOSM', this.getIFrame()));
    },
    getIFrame : function() {
        var iFrame = document.body.querySelector("iframe[name='josm_frame']"); 
        if (!iFrame) {
            iFrame = document.createElement('iframe');
            iFrame.setAttribute('class', 'hidden');
            iFrame.setAttribute('height', '0');
            iFrame.setAttribute('width', '0');
            iFrame.setAttribute('name', 'josm_frame');
            document.body.appendChild(iFrame);
        };
        return 'josm_frame';
    }
});

osml.widgets.EditOnline = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(type) {
        this.type = type;
    },
    prepare : function(data) {
        var params = {
                editor : this.type,
                lon : data.lon,
                lat : data.lat,
                zoom : data.zoom
        };
        var name = (this.type == 'id' ? 'ID&nbsp;editor' : 'Potlatch&nbsp2');
        var url = osml.formatUrl('http://www.openstreetmap.org/edit', params);
        this.setHtml(osml.makeLink(url, name));
    }
});

osml.widgets.TabPane = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(tabData) {
        this.tabs = [];
        for (var i=0; i<tabData.length; i++) {
            this.tabs.push(new osml.widgets.Tab(tabData[i]));
        };
    },
    prepare : function(data) {
        for (var i = 0; i<this.tabs.length; i++) {
            this.tabs[i].prepare(data);
        }
    },
    check : function() {
        var check = false;
        for (var i = 0; i<this.tabs.length; i++) {
            check = check || this.tabs[i].check();
        };
        return check;
    },
    render : function(parent) {
        var ul = document.createElement('ul');
        parent.appendChild(ul);
        for (var i = 0; i<this.tabs.length; i++) {
            var tab = this.tabs[i];
            if (tab.check()) {
                var li = document.createElement('li');
                li.innerHTML = '<a href="#' + tab.id + '">' + tab.name + '</a>';
                parent.firstChild.appendChild(li);
                var tabDiv = document.createElement('div');
                tabDiv.id = tab.id;
                tab.render(tabDiv);
                parent.appendChild(tabDiv);
            }
        }
    },
});

osml.widgets.Tab = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(tabData) {
        this.id = tabData.id;
        this.name = tabData.name,
        this.contentWidget = tabData.widget;
    },
    prepare : function(data) {
        this.contentWidget.prepare(data);
    },
    check : function() {
        return this.contentWidget.check();
    },
    render : function(parent) {
        this.contentWidget.render(parent);
    }
});

osml.widgets.WidgetGroup = OpenLayers.Class(osml.widgets.Widget, {
    initialize : function(widgetData, format) {
        this.format = format;
        this.widgets = [];
        for (var i=0; i<widgetData.length; i++) {
            this.widgets.push(osml.widgets.createWidget(widgetData[i]));
        };
    },
    prepare : function(data) {
        for (var i = 0; i<this.widgets.length; i++) {
            this.widgets[i].prepare(data);
        }
    },
    check : function() {
        var check = false;
        for (var i = 0; i<this.widgets.length; i++) {
            check = check || this.widgets[i].check();
        }
        return check;
    },
    render : function(parent) {
        switch (this.format) {
        case 'plain':
            this.renderPlain(parent);
            break;
        case 'ul':
            this.renderUl(parent);
            break;
        }
    },
    renderPlain : function(parent) {
        for (var i = 0; i<this.widgets.length; i++) {
            var widget = this.widgets[i];
            if (widget.check()) {
                widget.render(parent);
            };
        };
    },
    renderUl : function(parent) {
        var ul = document.createElement('ul');
        parent.appendChild(ul);
        for (var i = 0; i<this.widgets.length; i++) {
            var widget = this.widgets[i];
            if (widget.check()) {
                var li = document.createElement('li');
                widget.render(li);
                ul.appendChild(li);
            };
        };
    }
});

osml.widgets.createWidget = function(widgetData) {
    var params = null;
    var widgetName = '';
    if ($.isArray(widgetData)) {
        params = widgetData.slice(1);
        widgetName = widgetData[0];
    }
    else {
        widgetName = widgetData;
    };
    var path = widgetName.split('.');
    var fx = window;
    for (var i=0; i<path.length; i++) {
        fx = fx[path[i]];
        if (!fx) {
            var html = '<div>Missing widget: ' + widgetName +'</div>';
            return new osml.widgets.HtmlWidget(html);
        }
    };
    if (params) {
        return new fx(params);
    }
    return new fx();
};