/**
 * Class: LayerTreeControl
 * The LayerTreeControl displays a table of contents for the map. This
 * allows the user interface to switch between BaseLayers and to show or hide
 * Overlays.
 *
 * To create the Control outside of the map, pass the Id of a html div
 * as the div property in the options.
 *
 * This class requires the jsTree and jQuery libraries to be installed.
 * 
 * Inherits from:
 *  - <OpenLayers.Control>
 */
osml.LayerTreeControl = OpenLayers.Class(OpenLayers.Control, {

    /**  
     * Property: layerStates 
     * {Array(Object)} Basically a copy of the "state" of the map's layers 
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    layerTree: null,
    jsTree: null,

    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(layerTree, options) {
        this.layerTree = layerTree;
        OpenLayers.Control.prototype.initialize.apply(this, options);
        var treeData = this.buildTree(layerTree);
        $(options.div).jstree({
          plugins:['ui', 'state', 'checkbox'],
          checkbox: {
            override_ui: true,
            tie_selection: true
          },
          'core':treeData
        })
        .on("select_node.jstree", this, this.select_node)
        .on("deselect_node.jstree", this, this.deselect_node);
        this.jsTree = $(options.div).jstree();
    },
    
    destroy: function() {
      this.jsTree.destroy();
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
    buildTree: function(treeData) {
      var data = [];
      var self = this;
      $.each(treeData.getChildren(), function(index, nodeData) {
        data.push(self.buildNode(nodeData));
      });
      return {
        'data' : data
      };
    },
    buildNode: function(nodeData) {
        var children = [];
        var self = this;
        $.each(nodeData.getChildren(), function(index, childNodeData) {
            children.push(self.buildNode(childNodeData));
        });
        $.each(nodeData.layers, function(id, layer) {
            children.push({
                text: layer.name,
                li_attr: {class: layer.cssClass}
            });
        });
        return {
            text : nodeData.name,
            children : children,
            li_attr: {class: nodeData.id}
        };
    },
    select_node: function(e, data) {
        var self = e.data;
        var id = data.node.li_attr.class;
        if (data.node.children.length == 0) {
            var layer = self.layerTree.layers[id];
            layer.display(true);
            layer.setVisibility(true);
        }
        else {
            var node = self.layerTree.nodes[id];
            node.showAll();
        }
    },
    deselect_node: function(e, data) {
        var self = e.data;
        var id = data.node.li_attr.class;
        if (data.node.children.length == 0) {
            var layer = self.layerTree.layers[id];
            layer.display(false);
            layer.setVisibility(false);
        }
        else {
            var node = self.layerTree.nodes[id];
            node.hideAll();
        }
    },

    CLASS_NAME: 'osml.LayerTreeControl'
});
