import { b2AABB } from './b2AABB';
/**
 * A node in the dynamic tree. The client does not interact with this directly.
 * @private
 */
var b2DynamicTreeNode = /** @class */ (function () {
    function b2DynamicTreeNode() {
        this.aabb = new b2AABB();
    }
    b2DynamicTreeNode.prototype.IsLeaf = function () {
        return this.child1 == null;
    };
    return b2DynamicTreeNode;
}());
export { b2DynamicTreeNode };
