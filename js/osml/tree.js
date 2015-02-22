osml.Node = OpenLayers.Class({
    initialize : function(parent) {
        this.parent_ = parent;
        this.children_ = [];
    },
    getParent : function() {
        return this.parent_;
    },
    getChildren : function() {
        return this.children_;
    },
    addChild : function(child) {
        this.children_.push(child);
    },
    isLeaf : function() {
        return this.children_.length == 0;
    },
    isRoot : function() {
        return this.parent_ == null;
    },
    getRoot : function() {
        var node = this;
        while (!node.isRoot()) {
            node = node.getParent();
        };
        return node;
    }
});

osml.Tree = OpenLayers.Class(osml.Node, {
    initialize : function() {
        osml.Node.prototype.initialize.apply(this, [null]);
        this.index_ = [];
    },
    /**
     * Re-index the tree using a pre-order indexing algorithm
     * 
     * @param {null | osml.Node} node
     */
    reIndex : function(node) {
        if (!node) {
            node = this;
            this.index_ = [];
        };
        this.index_ = [];
        this.index_.push();
        for (var i = 0; i < node.getChildren().length; i++) {
            this.reIndex(node.getChildren()[i]);
        }
    },
    getNode : function(index) {
        return index_[index];
    }
});
