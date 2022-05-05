import { b2Vec2 } from '../Common/Math';
import { b2ManifoldPoint } from './b2ManifoldPoint';
import { b2Settings } from '../Common/b2Settings';
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
var b2Manifold = /** @class */ (function () {
    function b2Manifold() {
        this.__fast__ = true;
        /** The number of manifold points */
        this.m_pointCount = 0;
        this.m_points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.m_points[i] = new b2ManifoldPoint();
        }
        this.m_localPlaneNormal = new b2Vec2();
        this.m_localPoint = new b2Vec2();
    }
    b2Manifold.prototype.Reset = function () {
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.m_points[i].Reset();
        }
        this.m_localPlaneNormal.SetZero();
        this.m_localPoint.SetZero();
        this.m_type = 0;
        this.m_pointCount = 0;
    };
    b2Manifold.prototype.Set = function (m) {
        this.m_pointCount = m.m_pointCount;
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.m_points[i].Set(m.m_points[i]);
        }
        this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
        this.m_localPoint.SetV(m.m_localPoint);
        this.m_type = m.m_type;
    };
    b2Manifold.prototype.Copy = function () {
        var copy = new b2Manifold();
        copy.Set(this);
        return copy;
    };
    //enum Type
    b2Manifold.e_circles = 0x0001;
    b2Manifold.e_faceA = 0x0002;
    b2Manifold.e_faceB = 0x0004;
    return b2Manifold;
}());
export { b2Manifold };
