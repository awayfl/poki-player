import { __extends } from "tslib";
import { b2Shape } from './b2Shape';
import { b2Settings } from '../../Common/b2Settings';
import { b2Vec2, b2Math } from '../../Common/Math';
/**
 * An edge shape.
 * @private
 * @see b2EdgeChainDef
 */
var b2EdgeShape = /** @class */ (function (_super) {
    __extends(b2EdgeShape, _super);
    //--------------- Internals Below -------------------
    /**
    * @private
    */
    function b2EdgeShape(v1, v2) {
        var _this = _super.call(this) || this;
        _this.__fast__ = true;
        _this.s_supportVec = new b2Vec2();
        _this.m_v1 = new b2Vec2();
        _this.m_v2 = new b2Vec2();
        _this.m_coreV1 = new b2Vec2();
        _this.m_coreV2 = new b2Vec2();
        _this.m_normal = new b2Vec2();
        _this.m_direction = new b2Vec2();
        _this.m_cornerDir1 = new b2Vec2();
        _this.m_cornerDir2 = new b2Vec2();
        _this.m_type = b2Shape.e_edgeShape;
        _this.m_prevEdge = null;
        _this.m_nextEdge = null;
        _this.m_v1 = v1;
        _this.m_v2 = v2;
        _this.m_direction.Set(_this.m_v2.x - _this.m_v1.x, _this.m_v2.y - _this.m_v1.y);
        _this.m_length = _this.m_direction.Normalize();
        _this.m_normal.Set(_this.m_direction.y, -_this.m_direction.x);
        _this.m_coreV1.Set(-b2Settings.b2_toiSlop * (_this.m_normal.x - _this.m_direction.x) + _this.m_v1.x, -b2Settings.b2_toiSlop * (_this.m_normal.y - _this.m_direction.y) + _this.m_v1.y);
        _this.m_coreV2.Set(-b2Settings.b2_toiSlop * (_this.m_normal.x + _this.m_direction.x) + _this.m_v2.x, -b2Settings.b2_toiSlop * (_this.m_normal.y + _this.m_direction.y) + _this.m_v2.y);
        _this.m_cornerDir1 = _this.m_normal;
        _this.m_cornerDir2.Set(-_this.m_normal.x, -_this.m_normal.y);
        return _this;
    }
    /**
    * Returns false. Edges cannot contain points.
    */
    b2EdgeShape.prototype.TestPoint = function (transform, p) {
        return false;
    };
    /**
    * @inheritDoc
    */
    b2EdgeShape.prototype.RayCast = function (output, input, transform) {
        var tMat;
        var rX = input.p2.x - input.p1.x;
        var rY = input.p2.y - input.p1.y;
        //b2Vec2 v1 = b2Mul(transform, this.m_v1);
        tMat = transform.R;
        var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
        var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
        //b2Vec2 n = b2Cross(d, 1.0);
        var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
        var nY = -(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X);
        var k_slop = 100.0 * Number.MIN_VALUE;
        var denom = -(rX * nX + rY * nY);
        // Cull back facing collision and ignore parallel segments.
        if (denom > k_slop) {
            // Does the segment intersect the infinite line associated with this segment?
            var bX = input.p1.x - v1X;
            var bY = input.p1.y - v1Y;
            var a = (bX * nX + bY * nY);
            if (0.0 <= a && a <= input.maxFraction * denom) {
                var mu2 = -rX * bY + rY * bX;
                // Does the segment intersect this segment?
                if (-k_slop * denom <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
                    a /= denom;
                    output.fraction = a;
                    var nLen = Math.sqrt(nX * nX + nY * nY);
                    output.normal.x = nX / nLen;
                    output.normal.y = nY / nLen;
                    return true;
                }
            }
        }
        return false;
    };
    /**
    * @inheritDoc
    */
    b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
        var tMat = transform.R;
        //b2Vec2 v1 = b2Mul(transform, this.m_v1);
        var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
        var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
        //b2Vec2 v2 = b2Mul(transform, this.m_v2);
        var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
        var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
        if (v1X < v2X) {
            aabb.lowerBound.x = v1X;
            aabb.upperBound.x = v2X;
        }
        else {
            aabb.lowerBound.x = v2X;
            aabb.upperBound.x = v1X;
        }
        if (v1Y < v2Y) {
            aabb.lowerBound.y = v1Y;
            aabb.upperBound.y = v2Y;
        }
        else {
            aabb.lowerBound.y = v2Y;
            aabb.upperBound.y = v1Y;
        }
    };
    /**
    * @inheritDoc
    */
    b2EdgeShape.prototype.ComputeMass = function (massData, density) {
        massData.mass = 0;
        massData.center.SetV(this.m_v1);
        massData.I = 0;
    };
    /**
    * @inheritDoc
    */
    b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        // Note that v0 is independant of any details of the specific edge
        // We are relying on v0 being consistent between multiple edges of the same body
        //b2Vec2 v0 = offset * normal;
        var v0 = new b2Vec2(normal.x * offset, normal.y * offset);
        var v1 = b2Math.MulX(xf, this.m_v1);
        var v2 = b2Math.MulX(xf, this.m_v2);
        var d1 = b2Math.Dot(normal, v1) - offset;
        var d2 = b2Math.Dot(normal, v2) - offset;
        if (d1 > 0) {
            if (d2 > 0) {
                return 0;
            }
            else {
                //v1 = -d2 / (d1 - d2) * v1 + d1 / (d1 - d2) * v2;
                v1.x = -d2 / (d1 - d2) * v1.x + d1 / (d1 - d2) * v2.x;
                v1.y = -d2 / (d1 - d2) * v1.y + d1 / (d1 - d2) * v2.y;
            }
        }
        else {
            if (d2 > 0) {
                //v2 = -d2 / (d1 - d2) * v1 + d1 / (d1 - d2) * v2;
                v2.x = -d2 / (d1 - d2) * v1.x + d1 / (d1 - d2) * v2.x;
                v2.y = -d2 / (d1 - d2) * v1.y + d1 / (d1 - d2) * v2.y;
            }
            else {
                // Nothing
            }
        }
        // v0,v1,v2 represents a fully submerged triangle
        // Area weighted centroid
        c.x = (v0.x + v1.x + v2.x) / 3;
        c.y = (v0.y + v1.y + v2.y) / 3;
        //b2Vec2 e1 = v1 - v0;
        //b2Vec2 e2 = v2 - v0;
        //return 0.5f * b2Cross(e1, e2);
        return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
    };
    /**
    * Get the distance from vertex1 to vertex2.
    */
    b2EdgeShape.prototype.GetLength = function () {
        return this.m_length;
    };
    /**
    * Get the local position of vertex1 in parent body.
    */
    b2EdgeShape.prototype.GetVertex1 = function () {
        return this.m_v1;
    };
    /**
    * Get the local position of vertex2 in parent body.
    */
    b2EdgeShape.prototype.GetVertex2 = function () {
        return this.m_v2;
    };
    /**
    * Get a core vertex in local coordinates. These vertices
    * represent a smaller edge that is used for time of impact
    * computations.
    */
    b2EdgeShape.prototype.GetCoreVertex1 = function () {
        return this.m_coreV1;
    };
    /**
    * Get a core vertex in local coordinates. These vertices
    * represent a smaller edge that is used for time of impact
    * computations.
    */
    b2EdgeShape.prototype.GetCoreVertex2 = function () {
        return this.m_coreV2;
    };
    /**
    * Get a perpendicular unit vector, pointing
    * from the solid side to the empty side.
    */
    b2EdgeShape.prototype.GetNormalVector = function () {
        return this.m_normal;
    };
    /**
    * Get a parallel unit vector, pointing
    * from vertex1 to vertex2.
    */
    b2EdgeShape.prototype.GetDirectionVector = function () {
        return this.m_direction;
    };
    /**
    * Returns a unit vector halfway between
    * m_direction and m_prevEdge.m_direction.
    */
    b2EdgeShape.prototype.GetCorner1Vector = function () {
        return this.m_cornerDir1;
    };
    /**
    * Returns a unit vector halfway between
    * m_direction and m_nextEdge.m_direction.
    */
    b2EdgeShape.prototype.GetCorner2Vector = function () {
        return this.m_cornerDir2;
    };
    /**
    * Returns true if the first corner of this edge
    * bends towards the solid side.
    */
    b2EdgeShape.prototype.Corner1IsConvex = function () {
        return this.m_cornerConvex1;
    };
    /**
    * Returns true if the second corner of this edge
    * bends towards the solid side.
    */
    b2EdgeShape.prototype.Corner2IsConvex = function () {
        return this.m_cornerConvex2;
    };
    /**
    * Get the first vertex and apply the supplied transform.
    */
    b2EdgeShape.prototype.GetFirstVertex = function (xf) {
        //return b2Mul(xf, m_coreV1);
        var tMat = xf.R;
        return new b2Vec2(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
    };
    /**
    * Get the next edge in the chain.
    */
    b2EdgeShape.prototype.GetNextEdge = function () {
        return this.m_nextEdge;
    };
    /**
    * Get the previous edge in the chain.
    */
    b2EdgeShape.prototype.GetPrevEdge = function () {
        return this.m_prevEdge;
    };
    /**
    * Get the support point in the given world direction.
    * Use the supplied transform.
    */
    b2EdgeShape.prototype.Support = function (xf, dX, dY) {
        var tMat = xf.R;
        //b2Vec2 v1 = b2Mul(xf, m_coreV1);
        var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
        var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
        //b2Vec2 v2 = b2Mul(xf, m_coreV2);
        var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
        var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
        if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
            this.s_supportVec.x = v1X;
            this.s_supportVec.y = v1Y;
        }
        else {
            this.s_supportVec.x = v2X;
            this.s_supportVec.y = v2Y;
        }
        return this.s_supportVec;
    };
    /**
    * @private
    */
    b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
        this.m_prevEdge = edge;
        this.m_coreV1 = core;
        this.m_cornerDir1 = cornerDir;
        this.m_cornerConvex1 = convex;
    };
    /**
    * @private
    */
    b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
        this.m_nextEdge = edge;
        this.m_coreV2 = core;
        this.m_cornerDir2 = cornerDir;
        this.m_cornerConvex2 = convex;
    };
    return b2EdgeShape;
}(b2Shape));
export { b2EdgeShape };
