import { b2Manifold } from './b2Manifold';
import { b2Vec2 } from '../Common/Math';
import { b2Settings } from '../Common/b2Settings';
/**
 * This is used to compute the current state of a contact manifold.
 */
var b2WorldManifold = /** @class */ (function () {
    function b2WorldManifold() {
        /**
         * world vector pointing from A to B
         */
        this.m_normal = new b2Vec2();
        this.m_points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.m_points[i] = new b2Vec2();
        }
    }
    /**
     * Evaluate the manifold with supplied transforms. This assumes
     * modest motion from the original state. This does not change the
     * point count, impulses, etc. The radii must come from the shapes
     * that generated the manifold.
     */
    b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
        if (manifold.m_pointCount == 0) {
            return;
        }
        var i /** int */;
        var tVec;
        var tMat;
        var normalX;
        var normalY;
        var planePointX;
        var planePointY;
        var clipPointX;
        var clipPointY;
        switch (manifold.m_type) {
            case b2Manifold.e_circles:
                {
                    //var pointA:b2Vec2 = b2Math.b2MulX(xfA, manifold.m_localPoint);
                    tMat = xfA.R;
                    tVec = manifold.m_localPoint;
                    var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    //var pointB:b2Vec2 = b2Math.b2MulX(xfB, manifold.m_points[0].m_localPoint);
                    tMat = xfB.R;
                    tVec = manifold.m_points[0].m_localPoint;
                    var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    var dX = pointBX - pointAX;
                    var dY = pointBY - pointAY;
                    var d2 = dX * dX + dY * dY;
                    if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
                        var d = Math.sqrt(d2);
                        this.m_normal.x = dX / d;
                        this.m_normal.y = dY / d;
                    }
                    else {
                        this.m_normal.x = 1;
                        this.m_normal.y = 0;
                    }
                    //b2Vec2 cA = pointA + radiusA * m_normal;
                    var cAX = pointAX + radiusA * this.m_normal.x;
                    var cAY = pointAY + radiusA * this.m_normal.y;
                    //b2Vec2 cB = pointB - radiusB * m_normal;
                    var cBX = pointBX - radiusB * this.m_normal.x;
                    var cBY = pointBY - radiusB * this.m_normal.y;
                    this.m_points[0].x = 0.5 * (cAX + cBX);
                    this.m_points[0].y = 0.5 * (cAY + cBY);
                }
                break;
            case b2Manifold.e_faceA:
                {
                    //normal = b2Math.b2MulMV(xfA.R, manifold.m_localPlaneNormal);
                    tMat = xfA.R;
                    tVec = manifold.m_localPlaneNormal;
                    normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    //planePoint = b2Math.b2MulX(xfA, manifold.m_localPoint);
                    tMat = xfA.R;
                    tVec = manifold.m_localPoint;
                    planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    // Ensure normal points from A to B
                    this.m_normal.x = normalX;
                    this.m_normal.y = normalY;
                    for (i = 0; i < manifold.m_pointCount; i++) {
                        //clipPoint = b2Math.b2MulX(xfB, manifold.m_points[i].m_localPoint);
                        tMat = xfB.R;
                        tVec = manifold.m_points[i].m_localPoint;
                        clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                        clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                        //b2Vec2 cA = clipPoint + (radiusA - b2Dot(clipPoint - planePoint, normal)) * normal;
                        //b2Vec2 cB = clipPoint - radiusB * normal;
                        //m_points[i] = 0.5f * (cA + cB);
                        this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
                        this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
                    }
                }
                break;
            case b2Manifold.e_faceB:
                {
                    //normal = b2Math.b2MulMV(xfB.R, manifold.m_localPlaneNormal);
                    tMat = xfB.R;
                    tVec = manifold.m_localPlaneNormal;
                    normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    //planePoint = b2Math.b2MulX(xfB, manifold.m_localPoint);
                    tMat = xfB.R;
                    tVec = manifold.m_localPoint;
                    planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    // Ensure normal points from A to B
                    this.m_normal.x = -normalX;
                    this.m_normal.y = -normalY;
                    for (i = 0; i < manifold.m_pointCount; i++) {
                        //clipPoint = b2Math.b2MulX(xfA, manifold.m_points[i].m_localPoint);
                        tMat = xfA.R;
                        tVec = manifold.m_points[i].m_localPoint;
                        clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                        clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                        //b2Vec2 cA = clipPoint - radiusA * normal;
                        //b2Vec2 cB = clipPoint + (radiusB - b2Dot(clipPoint - planePoint, normal)) * normal;
                        //m_points[i] = 0.5f * (cA + cB);
                        this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
                        this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
                    }
                }
                break;
        }
    };
    return b2WorldManifold;
}());
export { b2WorldManifold };
