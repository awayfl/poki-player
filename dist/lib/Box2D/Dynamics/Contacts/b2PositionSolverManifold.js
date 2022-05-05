import { b2Vec2 } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2Manifold } from '../../Collision/b2Manifold';
var b2PositionSolverManifold = /** @class */ (function () {
    function b2PositionSolverManifold() {
        this.m_normal = new b2Vec2();
        this.m_separations = new Array(b2Settings.b2_maxManifoldPoints);
        this.m_points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.m_points[i] = new b2Vec2();
        }
    }
    b2PositionSolverManifold.prototype.Initialize = function (cc) {
        b2Settings.b2Assert(cc.pointCount > 0);
        var i /** int */;
        var clipPointX;
        var clipPointY;
        var tMat;
        var tVec;
        var planePointX;
        var planePointY;
        switch (cc.type) {
            case b2Manifold.e_circles:
                {
                    //var pointA:b2Vec2 = cc.bodyA.GetWorldPoint(cc.localPoint);
                    tMat = cc.bodyA.m_xf.R;
                    tVec = cc.localPoint;
                    var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                    var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                    //var pointB:b2Vec2 = cc.bodyB.GetWorldPoint(cc.points[0].localPoint);
                    tMat = cc.bodyB.m_xf.R;
                    tVec = cc.points[0].localPoint;
                    var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                    var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                    var dX = pointBX - pointAX;
                    var dY = pointBY - pointAY;
                    var d2 = dX * dX + dY * dY;
                    if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
                        var d = Math.sqrt(d2);
                        this.m_normal.x = dX / d;
                        this.m_normal.y = dY / d;
                    }
                    else {
                        this.m_normal.x = 1.0;
                        this.m_normal.y = 0.0;
                    }
                    this.m_points[0].x = 0.5 * (pointAX + pointBX);
                    this.m_points[0].y = 0.5 * (pointAY + pointBY);
                    this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
                }
                break;
            case b2Manifold.e_faceA:
                {
                    //m_normal = cc.bodyA.GetWorldVector(cc.localPlaneNormal);
                    tMat = cc.bodyA.m_xf.R;
                    tVec = cc.localPlaneNormal;
                    this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    //planePoint = cc.bodyA.GetWorldPoint(cc.localPoint);
                    tMat = cc.bodyA.m_xf.R;
                    tVec = cc.localPoint;
                    planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                    planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                    tMat = cc.bodyB.m_xf.R;
                    for (i = 0; i < cc.pointCount; ++i) {
                        //clipPoint = cc.bodyB.GetWorldPoint(cc.points[i].localPoint);
                        tVec = cc.points[i].localPoint;
                        clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                        clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                        this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
                        this.m_points[i].x = clipPointX;
                        this.m_points[i].y = clipPointY;
                    }
                }
                break;
            case b2Manifold.e_faceB:
                {
                    //m_normal = cc.bodyB.GetWorldVector(cc.localPlaneNormal);
                    tMat = cc.bodyB.m_xf.R;
                    tVec = cc.localPlaneNormal;
                    this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
                    this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
                    //planePoint = cc.bodyB.GetWorldPoint(cc.localPoint);
                    tMat = cc.bodyB.m_xf.R;
                    tVec = cc.localPoint;
                    planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                    planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                    tMat = cc.bodyA.m_xf.R;
                    for (i = 0; i < cc.pointCount; ++i) {
                        //clipPoint = cc.bodyA.GetWorldPoint(cc.points[i].localPoint);
                        tVec = cc.points[i].localPoint;
                        clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                        clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                        this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
                        this.m_points[i].Set(clipPointX, clipPointY);
                    }
                    // Ensure normal points from A to B
                    this.m_normal.x *= -1;
                    this.m_normal.y *= -1;
                }
                break;
        }
    };
    b2PositionSolverManifold.circlePointA = new b2Vec2();
    b2PositionSolverManifold.circlePointB = new b2Vec2();
    return b2PositionSolverManifold;
}());
export { b2PositionSolverManifold };
