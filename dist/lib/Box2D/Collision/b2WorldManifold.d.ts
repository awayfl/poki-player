import { b2Manifold } from './b2Manifold';
import { b2Transform, b2Vec2 } from '../Common/Math';
/**
 * This is used to compute the current state of a contact manifold.
 */
export declare class b2WorldManifold {
    constructor();
    /**
     * Evaluate the manifold with supplied transforms. This assumes
     * modest motion from the original state. This does not change the
     * point count, impulses, etc. The radii must come from the shapes
     * that generated the manifold.
     */
    Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: number, xfB: b2Transform, radiusB: number): void;
    /**
     * world vector pointing from A to B
     */
    m_normal: b2Vec2;
    /**
     * world contact point (point of intersection)
     */
    m_points: Array<b2Vec2>;
}
//# sourceMappingURL=b2WorldManifold.d.ts.map