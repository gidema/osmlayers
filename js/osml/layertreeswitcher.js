/**
 * Class: LayerTreeSwitcher
 * The LayerTreeSwitcher control displays a table of contents for the map. This
 * allows the user interface to switch between BaseLayers and to show or hide
 * Overlays.
 *
 * To create the LayerSwitcher outside of the map, pass the Id of a html div
 * as the first argument to the constructor.
 *
 * This class requires the jsTree and jQuery libraries to be installed.
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 */
osml.LayerTreeSwitcher = OpenLayers.Class(OpenLayers.Control, {

    /**  
     * Property: layerStates 
     * {Array(Object)} Basically a copy of the "state" of the map's layers 
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    site: null,
    layerStates: null,
    tree: null,
    jsTree: null,

    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(site, options) {
        this.site = site;
        OpenLayers.Control.prototype.initialize.apply(this, options);
        var treeData = this.buildTree(options.layerGroups);
        $(options.div).jstree({
          plugins:['ui', 'state', 'checkbox'],
          checkbox: {
            override_ui: true,
            tie_selection: true
          },
          'core':treeData
        })
        .bind("select_node.jstree", this.select_node)
        .bind("deselect_node.jstree", this.deselect_node);
        this.jsTree = $(options.div).jstree();
    },
    
    destroy: function() {
      this.jsTree.destroy();
    },
    /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     *
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call.
     */
    _checkRedraw: function() {
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            return true;
        }

        for (var i = 0, len = this.layerStates.length; i < len; i++) {
            var layerState = this.layerStates[i];
            var layer = this.map.layers[i];
            if ( (layerState.name != layer.name) ||
                 (layerState.inRange != layer.inRange) ||
                 (layerState.id != layer.id) ||
                 (layerState.visibility != layer.visibility) ) {
                return true;
            }
        }

        return false;
    },

    /**
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    redraw: function() {
      this.jsTree.redraw(true);
        return this.div;
    },
    buildTree: function(groups) {
      var data = [];
      $.each(groups, function(id, group) {
        var treeGroup = {
          osmlType : 'group',
          text : group.name,
          children : [],
          li_attr: {class: id}
        };
        $.each(group.layers, function(id, layer) {
          treeGroup.children.push({
            osmlType : 'layer',
            text: layer.name,
            li_attr: {class: layer.cssClass}
          });
        });
        data.push(treeGroup);
      });
      return {
        'data' : data
      };
    },
    select_node: function(e, data) {
        var id = data.node.li_attr.class;
        if (data.node.original.osmlType == 'layer') {
            var layer = osml.site.getLayer(id);
            layer.display(true);
            layer.setVisibility(true);
        }
        else {
            var group = osml.site.getGroup(id);
            $.each(group.layers, function (index, layer) {
                layer.display(true);
                layer.setVisibility(true);
            });
        }
    },
    deselect_node: function(e, data) {
        var id = data.node.li_attr.class;
        if (data.node.original.osmlType == 'layer') {
            var layer = osml.site.getLayer(id);
            layer.display(false);
            layer.setVisibility(false);
        }
        else {
            var group = osml.site.getGroup(id);
            $.each(group.layers, function (index, layer) {
                layer.display(false);
                layer.setVisibility(false);
            });
        }
    },

    CLASS_NAME: 'osml.LayerTreeSwitcher'
});
