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
var b2ManifoldPoint = /** @class */ (function () {
    function b2ManifoldPoint() {
        this.__fast__ = true;
        this.m_localPoint = new b2Vec2();
        this.m_id = new b2ContactID();
        this.Reset();
    }
    b2ManifoldPoint.prototype.Reset = function () {
        this.m_localPoint.SetZero();
        this.m_normalImpulse = 0.0;
        this.m_tangentImpulse = 0.0;
        this.m_id.key = 0;
    };
    b2ManifoldPoint.prototype.Set = function (m) {
        this.m_localPoint.SetV(m.m_localPoint);
        this.m_normalImpulse = m.m_normalImpulse;
        this.m_tangentImpulse = m.m_tangentImpulse;
        this.m_id.Set(m.m_id);
    };
    return b2ManifoldPoint;
}());
export { b2ManifoldPoint };
