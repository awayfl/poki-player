import { b2Vec2 } from '../Common/Math';
import { b2ManifoldPoint } from './b2ManifoldPoint';
/**
 * A manifold for two touching convex shapes.
 * Box2D supports multiple types of contact:
 * - clip point versus plane with radius
 * - point versus point with radius (circles)
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleA
 * -e_faceA: the center of faceA
 * -e_faceB: the center of faceB
 * Similarly the local normal usage:
 * -e_circles: not used
 * -e_faceA: the normal on polygonA
 * -e_faceB: the normal on polygonB
 * We store contacts in this way so that position correction can
 * account for movement, which is critical for continuous physics.
 * All contact scenarios must be expressed in one of these types.
 * This structure is stored across time steps, so we keep it small.
 */
export declare class b2Manifold {
    readonly __fast__ = true;
    constructor();
    Reset(): void;
    Set(m: b2Manifold): void;
    Copy(): b2Manifold;
    /** The points of contact */
    m_points: Array<b2ManifoldPoint>;
    /** Not used for Type e_points*/
    m_localPlaneNormal: b2Vec2;
    /** Usage depends on manifold type */
    m_localPoint: b2Vec2;
    m_type: number /** int */;
    /** The number of manifold points */
    m_pointCount: number /** int */;
    static readonly e_circles: number /** int */;
    static readonly e_faceA: number /** int */;
    static readonly e_faceB: number /** int */;
}
//# sourceMappingURL=b2Manifold.d.ts.map