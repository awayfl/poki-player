import { b2AABB } from './b2AABB';
/**
 * A node in the dynamic tree. The client does not interact with this directly.
 * @private
 */
export declare class b2DynamicTreeNode {
    IsLeaf(): boolean;
    userData: any;
    aabb: b2AABB;
    parent: b2DynamicTreeNode;
    child1: b2DynamicTreeNode;
    child2: b2DynamicTreeNode;
}
//# sourceMappingURL=b2DynamicTreeNode.d.ts.map