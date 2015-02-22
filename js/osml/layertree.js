osml.LayerTree = OpenLayers.Class(osml.Tree, {
    initialize : function(layerData, treeData) {
        osml.Tree.prototype.initialize.apply(this);
        this.layers = {};
        this.nodes = {};
        this.initializeLayers(layerData);
        this.initializeTree(treeData);
        
    },
    initializeLayers : function(layerData) {
        var self = this;
        $.each(layerData, function(id, l) {
            var layerDef = new osml.LayerDef(id, l.name, l.query, l.icon);
            var layer = new osml.OverpassLayer(layerDef);
            self.layers[id] = layer;
        });
    },
    initializeTree : function(treeData) {
        var root = this.getRoot();
        $.each(treeData, function(id, n) {
            var node = new osml.LayerTreeNode(root, id, n);
            root.addChild(node);
            root.nodes[id] = node;
        });
        this.reIndex();
    },
    getLayer : function(id) {
        return this.layers[id];
    }
});


osml.LayerTreeNode = OpenLayers.Class(osml.Node, {
    initialize : function(parent, id, nodeData) {
        osml.Node.prototype.initialize.apply(this, [parent]);
        this.id = id;
        this.layers = [];
        this.name = nodeData.name;
        var children = nodeData.children;
        if (children) {
            var self = this;
            var root = this.getRoot();
            $.each(children, function(id, n) {
                var childNode = new osml.LayerTreeNode(self, id, n);
                self.addChild(childNode);
                root.nodes[id] = childNode;
            });
        };
        var layers = nodeData.layers;
        if (layers) {
            var self = this;
            var root = this.getRoot();
            $.each(layers, function(index, l) {
                var layer = root.getLayer(l);
                if (layer) {
                    self.layers.push(layer);
                }
                else {
                    alert('Layer ' + l + ' doesn\'t exist');
                };
            });
        };
    },
    showAll : function() {
        $.each(this.getChildren(), function(id, child) {
            child.showAll();
        });
        $.each(this.layers, function(id, layer) {
            layer.display(true);
            layer.setVisibility(true);
        });
    },
    hideAll : function() {
        $.each(this.getChildren(), function(id, child) {
            child.hideAll();
        });
        $.each(this.layers, function(id, layer) {
            layer.display(false);
            layer.setVisibility(false);
        });
    }
});
