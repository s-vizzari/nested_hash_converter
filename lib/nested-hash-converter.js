/*global module*/
var removeFromArray = function removeFromArray(array, item) {
  for (var i=0, len=array.length; i<len; i++) {
    if (array[i] === item) {
      array.splice(i, 1);
      return;
    }
  }
};

var flatten = function flatten(children, path, delim) {
  var opts = [],
      label;

  var setNestedLabel = function setNestedLabel(opt) {
    if (path.length === 0) return;
    var pth = path.slice();
    pth.push(opt.label);
    opt.nestedLabel = pth.join(delim);
  };

  path = path || [];

  (children || []).forEach(function(opt) {
    label = opt.label;
    setNestedLabel(opt);
    opts.push(opt);
    if (typeof opt.children !== 'undefined') {
      path.push(label);
      opts.push.apply(opts, flatten(opt.children, path, delim));
    }
  });

  return opts;
};

var NestedHashConverter = function(delim) {
  this.leaves = {};
  this.tree = {root: {children: []}};
  this.delim = delim || '::';
};

NestedHashConverter.prototype = {
  add: function(label, value, type) {
    var t = this.tree,
        curHash = '',
        parentHash = 'root',
        curPartialHash,
        leaf,
        partialHashes = label.split(this.delim),
        curHashChildren;

    for (var i=0, partialHashesLen=partialHashes.length; i<partialHashesLen; i++) {

      curPartialHash = partialHashes[i];
      curHash = parentHash + this.delim + curPartialHash;

      // node is a leaf
      // ------------------------------------------------
      if (i === partialHashesLen - 1) {
        leaf = {
          label: curPartialHash,
          id:    value,
          type:  type
        };

        // and if there is a non-leaf node at level curHash
        // (t holds only non-leaf nodes with children)
        if (t[curHash]) {

          // then we add the leaf to the children at level curHash.
          // The insertion index is stored in order to preserve the proper order
          // of the leaf nodes in the children's array of their parent
          curHashChildren = t[curHash].children;

          if (curHashChildren._sameLabelLeafInsertionIndex == null) {
            curHashChildren._sameLabelLeafInsertionIndex = 0;
          }

          curHashChildren.splice(curHashChildren._sameLabelLeafInsertionIndex, 0, leaf);
          curHashChildren._sameLabelLeafInsertionIndex++;

        // else (there are no non-leaf nodes at level curHash)
        } else {

          // and if there are leaves registered at level curHash
          if (this.leaves[curHash]) {
            // and if there is more than one node (i.e. array)
            if (Object.prototype.toString.call(this.leaves[curHash]) === "[object Array]") {
              // it is added to the others (array)
              this.leaves[curHash].push(leaf);
            // else there is just one node there
            } else {
              // and the leaf is added to the existing node and registered as an array
              this.leaves[curHash] = [this.leaves[curHash], leaf];
            }
          // else there are no leaves at level curHash
          } else {
            // and the leaf is registered at curHash level
            this.leaves[curHash] = leaf;
          }

          // the leaf is added to the parent's children array
          t[parentHash].children.push(leaf);
        }

      // node has children (i.e. non-leaf)
      // ------------------------------------------------
      } else {

        // and if there is no node at level curHash
        // (t holds only non-leaf nodes with children)
        if (!t[curHash]) {

          // but if there are leaf nodes at level curHash
          if (this.leaves[curHash]) {

            // non-leaf node is registered at level curHash
            t[curHash] = {
              label:    curPartialHash,
              // and all leaf nodes at level curHash are added as children
              children: [].concat(this.leaves[curHash])
            };

            // and the leaf nodes are removed from their parent's children array
            for (var j=0, childrenLen=t[curHash].children.length; j<childrenLen; j++) {
              removeFromArray(t[parentHash].children, t[curHash].children[j]);
            }

          // else there are no leaf nodes at level curHash
          } else {
            // non-leaf node is registered at level curHash
            t[curHash] = {
              label:    curPartialHash,
              children: []
            };
          }
          // and the non-leaf node at curHash is added to the parent's children.
          // Only newly created non-leaf nodes at level curHash are added.
          t[parentHash].children.push(t[curHash]);
        }
      }
      parentHash = parentHash + this.delim + curPartialHash;
    }
    return this;
  },

  toList: function() {
    return this.tree.root.children;
  },

  toFlattenedList: function() {
    return flatten(this.tree.root.children, null, this.delim);
  }
};

module.exports = NestedHashConverter;
