import { b2AABB } from './b2AABB';
import { b2DynamicTreeNode } from './b2DynamicTreeNode';
import { b2Math } from '../Common/Math';
import { b2Settings } from '../Common/b2Settings';
import { b2RayCastInput } from './b2RayCastInput';
/**
 * A dynamic tree arranges data in a binary tree to accelerate
 * queries such as volume queries and ray casts. Leafs are proxies
 * with an AABB. In the tree we expand the proxy AABB by b2_fatAABBFactor
 * so that the proxy AABB is bigger than the client object. This allows the client
 * object to move by small amounts without triggering a tree update.
 *
 * Nodes are pooled.
 */
var b2DynamicTree = /** @class */ (function () {
    /**
     * Constructing the tree initializes the node pool.
     */
    function b2DynamicTree() {
        this.m_root = null;
        // TODO: Maybe allocate some free nodes?
        this.m_freeList = null;
        this.m_path = 0;
        this.m_insertionCount = 0;
    }
    /*
    public Dump(node:b2DynamicTreeNode=null, depth:number=0):void
    {
        if (!node)
        {
            node = m_root;
        }
        if (!node) return;
        for (var i:number = 0; i < depth; i++) s += " ";
        if (node.userData)
        {
            var ud:* = (node.userData as b2Fixture).GetBody().GetUserData();
            trace(s + ud);
        }else {
            trace(s + "-");
        }
        if (node.child1)
            Dump(node.child1, depth + 1);
        if (node.child2)
            Dump(node.child2, depth + 1);
    }
    */
    /**
     * Create a proxy. Provide a tight fitting AABB and a userData.
     */
    b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
        var node = this.AllocateNode();
        // Fatten the aabb.
        var extendX = b2Settings.b2_aabbExtension;
        var extendY = b2Settings.b2_aabbExtension;
        node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
        node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
        node.aabb.upperBound.x = aabb.upperBound.x + extendX;
        node.aabb.upperBound.y = aabb.upperBound.y + extendY;
        node.userData = userData;
        this.InsertLeaf(node);
        return node;
    };
    /**
     * Destroy a proxy. This asserts if the id is invalid.
     */
    b2DynamicTree.prototype.DestroyProxy = function (proxy) {
        //b2Settings.b2Assert(proxy.IsLeaf());
        this.RemoveLeaf(proxy);
        this.FreeNode(proxy);
    };
    /**
     * Move a proxy with a swept AABB. If the proxy has moved outside of its fattened AABB,
     * then the proxy is removed from the tree and re-inserted. Otherwise
     * the function returns immediately.
     */
    b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
        b2Settings.b2Assert(proxy.IsLeaf());
        if (proxy.aabb.Contains(aabb)) {
            return false;
        }
        this.RemoveLeaf(proxy);
        // Extend AABB
        var extendX = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : -displacement.x);
        var extendY = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : -displacement.y);
        proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
        proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
        proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
        proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
        this.InsertLeaf(proxy);
        return true;
    };
    /**
     * Perform some iterations to re-balance the tree.
     */
    b2DynamicTree.prototype.Rebalance = function (iterations /** int */) {
        if (this.m_root == null)
            return;
        for (var i = 0; i < iterations; i++) {
            var node = this.m_root;
            var bit = 0;
            while (node.IsLeaf() == false) {
                node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
                bit = (bit + 1) & 31; // 0-31 bits in a uint
            }
            ++this.m_path;
            this.RemoveLeaf(node);
            this.InsertLeaf(node);
        }
    };
    b2DynamicTree.prototype.GetFatAABB = function (proxy) {
        return proxy.aabb;
    };
    /**
     * Get user data from a proxy. Returns null if the proxy is invalid.
     */
    b2DynamicTree.prototype.GetUserData = function (proxy) {
        return proxy.userData;
    };
    /**
     * Query an AABB for overlapping proxies. The callback
     * is called for each proxy that overlaps the supplied AABB.
     * The callback should match function signature
     * <code>fuction callback(proxy:b2DynamicTreeNode):boolean</code>
     * and should return false to trigger premature termination.
     */
    b2DynamicTree.prototype.Query = function (callback, aabb) {
        if (this.m_root == null)
            return;
        var stack = new Array();
        var count = 0;
        stack[count++] = this.m_root;
        while (count > 0) {
            var node = stack[--count];
            if (node.aabb.TestOverlap(aabb)) {
                if (node.IsLeaf()) {
                    var proceed = callback(node);
                    if (!proceed)
                        return;
                }
                else {
                    // No stack limit, so no assert
                    stack[count++] = node.child1;
                    stack[count++] = node.child2;
                }
            }
        }
    };
    /**
     * Ray-cast against the proxies in the tree. This relies on the callback
     * to perform a exact ray-cast in the case were the proxy contains a shape.
     * The callback also performs the any collision filtering. This has performance
     * roughly equal to k * log(n), where k is the number of collisions and n is the
     * number of proxies in the tree.
     * @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
     * @param callback a callback class that is called for each proxy that is hit by the ray.
     * It should be of signature:
     * <code>function callback(input:b2RayCastInput, proxy:*):void</code>
     */
    b2DynamicTree.prototype.RayCast = function (callback, input) {
        if (this.m_root == null)
            return;
        var p1 = input.p1;
        var p2 = input.p2;
        var r = b2Math.SubtractVV(p1, p2);
        //b2Settings.b2Assert(r.LengthSquared() > 0.0);
        r.Normalize();
        // v is perpendicular to the segment
        var v = b2Math.CrossFV(1.0, r);
        var abs_v = b2Math.AbsV(v);
        var maxFraction = input.maxFraction;
        // Build a bounding box for the segment
        var segmentAABB = new b2AABB();
        var tX;
        var tY;
        {
            tX = p1.x + maxFraction * (p2.x - p1.x);
            tY = p1.y + maxFraction * (p2.y - p1.y);
            segmentAABB.lowerBound.x = Math.min(p1.x, tX);
            segmentAABB.lowerBound.y = Math.min(p1.y, tY);
            segmentAABB.upperBound.x = Math.max(p1.x, tX);
            segmentAABB.upperBound.y = Math.max(p1.y, tY);
        }
        var stack = new Array();
        var count = 0;
        stack[count++] = this.m_root;
        while (count > 0) {
            var node = stack[--count];
            if (node.aabb.TestOverlap(segmentAABB) == false) {
                continue;
            }
            // Separating axis for segment (Gino, p80)
            // |dot(v, p1 - c)| > dot(|v|,h)
            var c = node.aabb.GetCenter();
            var h = node.aabb.GetExtents();
            var separation = Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y))
                - abs_v.x * h.x - abs_v.y * h.y;
            if (separation > 0.0)
                continue;
            if (node.IsLeaf()) {
                var subInput = new b2RayCastInput();
                subInput.p1 = input.p1;
                subInput.p2 = input.p2;
                subInput.maxFraction = input.maxFraction;
                maxFraction = callback(subInput, node);
                if (maxFraction == 0.0)
                    return;
                //Update the segment bounding box
                {
                    tX = p1.x + maxFraction * (p2.x - p1.x);
                    tY = p1.y + maxFraction * (p2.y - p1.y);
                    segmentAABB.lowerBound.x = Math.min(p1.x, tX);
                    segmentAABB.lowerBound.y = Math.min(p1.y, tY);
                    segmentAABB.upperBound.x = Math.max(p1.x, tX);
                    segmentAABB.upperBound.y = Math.max(p1.y, tY);
                }
            }
            else {
                // No stack limit, so no assert
                stack[count++] = node.child1;
                stack[count++] = node.child2;
            }
        }
    };
    b2DynamicTree.prototype.AllocateNode = function () {
        // Peel a node off the free list
        if (this.m_freeList) {
            var node = this.m_freeList;
            this.m_freeList = node.parent;
            node.parent = null;
            node.child1 = null;
            node.child2 = null;
            return node;
        }
        // Ignore length pool expansion and relocation found in the C++
        // As we are using heap allocation
        return new b2DynamicTreeNode();
    };
    b2DynamicTree.prototype.FreeNode = function (node) {
        node.parent = this.m_freeList;
        this.m_freeList = node;
    };
    b2DynamicTree.prototype.InsertLeaf = function (leaf) {
        ++this.m_insertionCount;
        if (this.m_root == null) {
            this.m_root = leaf;
            this.m_root.parent = null;
            return;
        }
        var center = leaf.aabb.GetCenter();
        var sibling = this.m_root;
        if (sibling.IsLeaf() == false) {
            do {
                var child1 = sibling.child1;
                var child2 = sibling.child2;
                //b2Vec2 delta1 = b2Abs(m_nodes[child1].aabb.GetCenter() - center);
                //b2Vec2 delta2 = b2Abs(m_nodes[child2].aabb.GetCenter() - center);
                //float32 norm1 = delta1.x + delta1.y;
                //float32 norm2 = delta2.x + delta2.y;
                var norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x)
                    + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y);
                var norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x)
                    + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
                if (norm1 < norm2) {
                    sibling = child1;
                }
                else {
                    sibling = child2;
                }
            } while (sibling.IsLeaf() == false);
        }
        // Create a parent for the siblings
        var node1 = sibling.parent;
        var node2 = this.AllocateNode();
        node2.parent = node1;
        node2.userData = null;
        node2.aabb.Combine(leaf.aabb, sibling.aabb);
        if (node1) {
            if (sibling.parent.child1 == sibling) {
                node1.child1 = node2;
            }
            else {
                node1.child2 = node2;
            }
            node2.child1 = sibling;
            node2.child2 = leaf;
            sibling.parent = node2;
            leaf.parent = node2;
            do {
                if (node1.aabb.Contains(node2.aabb))
                    break;
                node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
                node2 = node1;
                node1 = node1.parent;
            } while (node1);
        }
        else {
            node2.child1 = sibling;
            node2.child2 = leaf;
            sibling.parent = node2;
            leaf.parent = node2;
            this.m_root = node2;
        }
    };
    b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
        if (leaf == this.m_root) {
            this.m_root = null;
            return;
        }
        var node2 = leaf.parent;
        var node1 = node2.parent;
        var sibling;
        if (node2.child1 == leaf) {
            sibling = node2.child2;
        }
        else {
            sibling = node2.child1;
        }
        if (node1) {
            // Destroy node2 and connect node1 to sibling
            if (node1.child1 == node2) {
                node1.child1 = sibling;
            }
            else {
                node1.child2 = sibling;
            }
            sibling.parent = node1;
            this.FreeNode(node2);
            // Adjust the ancestor bounds
            while (node1) {
                var oldAABB = node1.aabb;
                node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
                if (oldAABB.Contains(node1.aabb))
                    break;
                node1 = node1.parent;
            }
        }
        else {
            this.m_root = sibling;
            sibling.parent = null;
            this.FreeNode(node2);
        }
    };
    return b2DynamicTree;
}());
export { b2DynamicTree };
