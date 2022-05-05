import { b2AABB } from './b2AABB';
import { b2DynamicTreeNode } from './b2DynamicTreeNode';
import { b2Vec2 } from '../Common/Math';
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
export declare class b2DynamicTree {
    /**
     * Constructing the tree initializes the node pool.
     */
    constructor();
    /**
     * Create a proxy. Provide a tight fitting AABB and a userData.
     */
    CreateProxy(aabb: b2AABB, userData: any): b2DynamicTreeNode;
    /**
     * Destroy a proxy. This asserts if the id is invalid.
     */
    DestroyProxy(proxy: b2DynamicTreeNode): void;
    /**
     * Move a proxy with a swept AABB. If the proxy has moved outside of its fattened AABB,
     * then the proxy is removed from the tree and re-inserted. Otherwise
     * the function returns immediately.
     */
    MoveProxy(proxy: b2DynamicTreeNode, aabb: b2AABB, displacement: b2Vec2): boolean;
    /**
     * Perform some iterations to re-balance the tree.
     */
    Rebalance(iterations: number /** int */): void;
    GetFatAABB(proxy: b2DynamicTreeNode): b2AABB;
    /**
     * Get user data from a proxy. Returns null if the proxy is invalid.
     */
    GetUserData(proxy: b2DynamicTreeNode): any;
    /**
     * Query an AABB for overlapping proxies. The callback
     * is called for each proxy that overlaps the supplied AABB.
     * The callback should match function signature
     * <code>fuction callback(proxy:b2DynamicTreeNode):boolean</code>
     * and should return false to trigger premature termination.
     */
    Query(callback: Function, aabb: b2AABB): void;
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
    RayCast(callback: Function, input: b2RayCastInput): void;
    private AllocateNode;
    private FreeNode;
    private InsertLeaf;
    private RemoveLeaf;
    private m_root;
    private m_freeList;
    /** This is used for incrementally traverse the tree for rebalancing */
    private m_path;
    private m_insertionCount;
}
//# sourceMappingURL=b2DynamicTree.d.ts.map