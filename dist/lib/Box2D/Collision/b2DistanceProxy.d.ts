import { b2Shape } from './Shapes/b2Shape';
import { b2Vec2 } from '../Common/Math';
/**
 * A distance proxy is used by the GJK algorithm.
 * It encapsulates any shape.
 */
export declare class b2DistanceProxy {
    __fast__: boolean;
    /**
     * Initialize the proxy using the given shape. The shape
     * must remain in scope while the proxy is in use.
     */
    Set(shape: b2Shape): void;
    /**
     * Get the supporting vertex index in the given direction.
     */
    GetSupport(d: b2Vec2): number;
    /**
     * Get the supporting vertex in the given direction.
     */
    GetSupportVertex(d: b2Vec2): b2Vec2;
    /**
     * Get the vertex count.
     */
    GetVertexCount(): number /** int */;
    /**
     * Get a vertex by index. Used by b2Distance.
     */
    GetVertex(index: number /** int */): b2Vec2;
    m_vertices: b2Vec2[];
    m_count: number /** int */;
    m_radius: number;
}
//# sourceMappingURL=b2DistanceProxy.d.ts.map