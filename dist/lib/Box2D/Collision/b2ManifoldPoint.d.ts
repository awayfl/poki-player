import { b2Vec2 } from '../Common/Math';
import { b2ContactID } from './b2ContactID';
/**
 * A manifold point is a contact point belonging to a contact
 * manifold. It holds details related to the geometry and dynamics
 * of the contact points.
 * The local point usage depends on the manifold type:
 * -e_circles: the local center of circleB
 * -e_faceA: the local center of cirlceB or the clip point of polygonB
 * -e_faceB: the clip point of polygonA
 * This structure is stored across time steps, so we keep it small.
 * Note: the impulses are used for internal caching and may not
 * provide reliable contact forces, especially for high speed collisions.
 */
export declare class b2ManifoldPoint {
    readonly __fast__ = true;
    constructor();
    Reset(): void;
    Set(m: b2ManifoldPoint): void;
    m_localPoint: b2Vec2;
    m_normalImpulse: number;
    m_tangentImpulse: number;
    m_id: b2ContactID;
}
//# sourceMappingURL=b2ManifoldPoint.d.ts.map