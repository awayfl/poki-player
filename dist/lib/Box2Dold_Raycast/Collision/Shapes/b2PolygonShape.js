/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { __extends } from "tslib";
import { b2Shape } from './b2Shape';
import { b2Vec2, b2Mat22, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2AABB } from '../b2AABB';
import { b2OBB } from '../b2OBB';
/// Convex polygon. The vertices must be in CCW order for a right-handed
/// coordinate system with the z-axis coming out of the screen.
var b2PolygonShape = /** @class */ (function (_super) {
    __extends(b2PolygonShape, _super);
    //--------------- Internals Below -------------------
    function b2PolygonShape(def) {
        var _this = _super.call(this, def) || this;
        /// Get the support point in the given world direction.
        /// Use the supplied transform.
        _this.s_supportVec = new b2Vec2();
        _this.m_obb = new b2OBB();
        _this.m_vertices = new Array(b2Settings.b2_maxPolygonVertices);
        _this.m_normals = new Array(b2Settings.b2_maxPolygonVertices);
        _this.m_coreVertices = new Array(b2Settings.b2_maxPolygonVertices);
        //b2Settings.b2Assert(def.type == e_polygonShape);
        _this.m_type = b2PolygonShape.e_polygonShape;
        var poly = def;
        // Get the vertices transformed into the body frame.
        _this.m_vertexCount = poly.vertexCount;
        //b2Settings.b2Assert(3 <= this.m_vertexCount && this.m_vertexCount <= b2_maxPolygonVertices);
        var i = 0;
        var i1 = i;
        var i2 = i;
        // AWAY fix, beacuse it can be ASArray
        var v_arr = poly.vertices;
        if (!v_arr) {
            console.error('[B2D] Try create polygon shape from def', def);
            return _this;
        }
        if (typeof v_arr['traits'] !== 'undefined') {
            v_arr = v_arr['value'];
        }
        // Copy vertices.
        for (i = 0; i < _this.m_vertexCount; ++i) {
            _this.m_vertices[i] = v_arr[i].Copy();
        }
        // Compute normals. Ensure the edges have non-zero length.
        for (i = 0; i < _this.m_vertexCount; ++i) {
            i1 = i;
            i2 = i + 1 < _this.m_vertexCount ? i + 1 : 0;
            //b2Vec2 edge = this.m_vertices[i2] - this.m_vertices[i1];
            var edgeX = _this.m_vertices[i2].x - _this.m_vertices[i1].x;
            var edgeY = _this.m_vertices[i2].y - _this.m_vertices[i1].y;
            //b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE * Number.MIN_VALUE);
            //this.m_normals[i] = b2Cross(edge, 1.0f); ^^
            var len = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
            //this.m_normals[i].Normalize();
            _this.m_normals[i] = new b2Vec2(edgeY / len, -edgeX / len);
        }
        /*#ifdef _DEBUG
        // Ensure the polygon is convex.
        for (int32 i = 0; i < this.m_vertexCount; ++i)
        {
            for (int32 j = 0; j < this.m_vertexCount; ++j)
            {
                // Don't check vertices on the current edge.
                if (j == i || j == (i + 1) % this.m_vertexCount)
                {
                    continue;
                }

                // Your polygon is non-convex (it has an indentation).
                // Or your polygon is too skinny.
                float32 s = b2Dot(this.m_normals[i], this.m_vertices[j] - this.m_vertices[i]);
                b2Assert(s < -b2_linearSlop);
            }
        }

        // Ensure the polygon is counter-clockwise.
        for (i = 1; i < this.m_vertexCount; ++i)
        {
            var cross:number = b2Math.b2CrossVV(this.m_normals[int(i-1)], this.m_normals[i]);

            // Keep asinf happy.
            cross = b2Math.b2Clamp(cross, -1.0, 1.0);

            // You have consecutive edges that are almost parallel on your polygon.
            var angle:number = Math.asin(cross);
            //b2Assert(angle > b2_angularSlop);
            trace(angle > b2Settings.b2_angularSlop);
        }
        #endif*/
        // Compute the polygon centroid.
        _this.m_centroid = b2PolygonShape.ComputeCentroid(v_arr, poly.vertexCount);
        // Compute the oriented bounding box.
        b2PolygonShape.ComputeOBB(_this.m_obb, _this.m_vertices, _this.m_vertexCount);
        // Create core polygon shape by shifting edges inward.
        // Also compute the min/max radius for CCD.
        for (i = 0; i < _this.m_vertexCount; ++i) {
            i1 = i - 1 >= 0 ? i - 1 : _this.m_vertexCount - 1;
            i2 = i;
            //b2Vec2 n1 = this.m_normals[i1];
            var n1X = _this.m_normals[i1].x;
            var n1Y = _this.m_normals[i1].y;
            //b2Vec2 n2 = this.m_normals[i2];
            var n2X = _this.m_normals[i2].x;
            var n2Y = _this.m_normals[i2].y;
            //b2Vec2 v = this.m_vertices[i] - this.m_centroid;
            var vX = _this.m_vertices[i].x - _this.m_centroid.x;
            var vY = _this.m_vertices[i].y - _this.m_centroid.y;
            //b2Vec2 d;
            var dX = (n1X * vX + n1Y * vY) - b2Settings.b2_toiSlop;
            var dY = (n2X * vX + n2Y * vY) - b2Settings.b2_toiSlop;
            // Shifting the edge inward by b2_toiSlop should
            // not cause the plane to pass the centroid.
            // Your shape has a radius/extent less than b2_toiSlop.
            //b2Settings.b2Assert(d.x >= 0.0);
            //b2Settings.b2Assert(d.y >= 0.0);
            //var A:b2Mat22;
            //A.col1.x = n1.x; A.col2.x = n1.y;
            //A.col1.y = n2.x; A.col2.y = n2.y;
            //this.m_coreVertices[i] = A.Solve(d) + this.m_centroid;
            //float32 det = a11 * a22 - a12 * a21;
            var det = 1.0 / (n1X * n2Y - n1Y * n2X);
            //det = 1.0 / det;
            _this.m_coreVertices[i] = new b2Vec2(det * (n2Y * dX - n1Y * dY) + _this.m_centroid.x, det * (n1X * dY - n2X * dX) + _this.m_centroid.y);
        }
        return _this;
    }
    /// @see b2Shape::TestPoint
    b2PolygonShape.prototype.TestPoint = function (xf, p) {
        var tVec;
        //b2Vec2 pLocal = b2MulT(xf.R, p - xf.position);
        var tMat = xf.R;
        var tX = p.x - xf.position.x;
        var tY = p.y - xf.position.y;
        var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
        var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
        for (var i = 0; i < this.m_vertexCount; ++i) {
            //float32 dot = b2Dot(m_normals[i], pLocal - m_vertices[i]);
            tVec = this.m_vertices[i];
            tX = pLocalX - tVec.x;
            tY = pLocalY - tVec.y;
            tVec = this.m_normals[i];
            var dot = (tVec.x * tX + tVec.y * tY);
            if (dot > 0.0) {
                return false;
            }
        }
        return true;
    };
    /// @see b2Shape::TestSegment
    b2PolygonShape.prototype.TestSegment = function (xf, lambda, // float ptr
    normal, // ptr
    segment, maxLambda) {
        var lower = 0.0;
        var upper = maxLambda;
        var tX;
        var tY;
        var tMat;
        var tVec;
        //b2Vec2 p1 = b2MulT(xf.R, segment.p1 - xf.position);
        tX = segment.p1.x - xf.position.x;
        tY = segment.p1.y - xf.position.y;
        tMat = xf.R;
        var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
        var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
        //b2Vec2 p2 = b2MulT(xf.R, segment.p2 - xf.position);
        tX = segment.p2.x - xf.position.x;
        tY = segment.p2.y - xf.position.y;
        tMat = xf.R;
        var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
        var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
        //b2Vec2 d = p2 - p1;
        var dX = p2X - p1X;
        var dY = p2Y - p1Y;
        var index = -1;
        for (var i = 0; i < this.m_vertexCount; ++i) {
            // p = p1 + a * d
            // dot(normal, p - v) = 0
            // dot(normal, p1 - v) + a * dot(normal, d) = 0
            //float32 numerator = b2Dot(this.m_normals[i], this.m_vertices[i] - p1);
            tVec = this.m_vertices[i];
            tX = tVec.x - p1X;
            tY = tVec.y - p1Y;
            tVec = this.m_normals[i];
            var numerator = (tVec.x * tX + tVec.y * tY);
            //float32 denominator = b2Dot(this.m_normals[i], d);
            var denominator = (tVec.x * dX + tVec.y * dY);
            // Note: we want this predicate without division:
            // lower < numerator / denominator, where denominator < 0
            // Since denominator < 0, we have to flip the inequality:
            // lower < numerator / denominator <==> denominator * lower > numerator.
            if (denominator == 0.0) {
                if (numerator < 0.0) {
                    return b2Shape.e_missCollide;
                }
            }
            else {
                if (denominator < 0.0 && numerator < lower * denominator) {
                    // Increase lower.
                    // The segment enters this half-space.
                    lower = numerator / denominator;
                    index = i;
                }
                else if (denominator > 0.0 && numerator < upper * denominator) {
                    // Decrease upper.
                    // The segment exits this half-space.
                    upper = numerator / denominator;
                }
                if (upper < lower) {
                    return b2Shape.e_missCollide;
                }
            }
        }
        //b2Settings.b2Assert(0.0 <= lower && lower <= maxLambda);
        if (index >= 0) {
            //*lambda = lower;
            lambda[0] = lower;
            //*normal = b2Mul(xf.R, this.m_normals[index]);
            tMat = xf.R;
            tVec = this.m_normals[index];
            normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            return b2Shape.e_hitCollide;
        }
        lambda[0] = 0;
        return b2Shape.e_startsInsideCollide;
    };
    //
    b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
        var tMat;
        var tVec;
        var R = b2PolygonShape.s_computeMat;
        //b2Mat22 R = b2Mul(xf.R, this.m_obb.R);
        tMat = xf.R;
        tVec = this.m_obb.R.col1;
        //R.col1 = b2MulMV(A, B.col1)
        R.col1.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        R.col1.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //
        tVec = this.m_obb.R.col2;
        //R.col1 = b2MulMV(A, B.col2)
        R.col2.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        R.col2.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //b2Mat22 absR = b2Abs(R);
        R.Abs();
        var absR = R;
        //b2Vec2 h = b2Mul(absR, this.m_obb.extents);
        tVec = this.m_obb.extents;
        var hX = (absR.col1.x * tVec.x + absR.col2.x * tVec.y);
        var hY = (absR.col1.y * tVec.x + absR.col2.y * tVec.y);
        //b2Vec2 position = xf.position + b2Mul(xf.R, this.m_obb.center);
        tMat = xf.R;
        tVec = this.m_obb.center;
        var positionX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var positionY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //aabb->lowerBound = position - h;
        aabb.lowerBound.Set(positionX - hX, positionY - hY);
        //aabb->upperBound = position + h;
        aabb.upperBound.Set(positionX + hX, positionY + hY);
    };
    //
    b2PolygonShape.prototype.ComputeSweptAABB = function (aabb, transform1, transform2) {
        //b2AABB aabb1, aabb2;
        var aabb1 = b2PolygonShape.s_sweptAABB1;
        var aabb2 = b2PolygonShape.s_sweptAABB2;
        this.ComputeAABB(aabb1, transform1);
        this.ComputeAABB(aabb2, transform2);
        //aabb.lowerBound = b2Min(aabb1.lowerBound, aabb2.lowerBound);
        aabb.lowerBound.Set((aabb1.lowerBound.x < aabb2.lowerBound.x ? aabb1.lowerBound.x : aabb2.lowerBound.x), (aabb1.lowerBound.y < aabb2.lowerBound.y ? aabb1.lowerBound.y : aabb2.lowerBound.y));
        //aabb.upperBound = b2Max(aabb1.upperBound, aabb2.upperBound);
        aabb.upperBound.Set((aabb1.upperBound.x > aabb2.upperBound.x ? aabb1.upperBound.x : aabb2.upperBound.x), (aabb1.upperBound.y > aabb2.upperBound.y ? aabb1.upperBound.y : aabb2.upperBound.y));
    };
    /// @see b2Shape::ComputeMass
    //
    //
    b2PolygonShape.prototype.ComputeMass = function (massData) {
        // Polygon mass, centroid, and inertia.
        // Let rho be the polygon density in mass per unit area.
        // Then:
        // mass = rho * int(dA)
        // centroid.x = (1/mass) * rho * int(x * dA)
        // centroid.y = (1/mass) * rho * int(y * dA)
        // I = rho * int((x*x + y*y) * dA)
        //
        // We can compute these integrals by summing all the integrals
        // for each triangle of the polygon. To evaluate the integral
        // for a single triangle, we make a change of variables to
        // the (u,v) coordinates of the triangle:
        // x = x0 + e1x * u + e2x * v
        // y = y0 + e1y * u + e2y * v
        // where 0 <= u && 0 <= v && u + v <= 1.
        //
        // We integrate u from [0,1-v] and then v from [0,1].
        // We also need to use the Jacobian of the transformation:
        // D = cross(e1, e2)
        //
        // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
        //
        // The rest of the derivation is handled by computer algebra.
        //b2Settings.b2Assert(this.m_vertexCount >= 3);
        //b2Vec2 center; center.Set(0.0f, 0.0f);
        var centerX = 0.0;
        var centerY = 0.0;
        var area = 0.0;
        var I = 0.0;
        // pRef is the reference point for forming triangles.
        // It's location doesn't change the result (except for rounding error).
        //b2Vec2 pRef(0.0f, 0.0f);
        var p1X = 0.0;
        var p1Y = 0.0;
        /*#if 0
        // This code would put the reference point inside the polygon.
        for (int32 i = 0; i < this.m_vertexCount; ++i)
        {
            pRef += this.m_vertices[i];
        }
        pRef *= 1.0f / count;
        #endif*/
        var k_inv3 = 1.0 / 3.0;
        for (var i = 0; i < this.m_vertexCount; ++i) {
            // Triangle vertices.
            //b2Vec2 p1 = pRef;
            //
            //b2Vec2 p2 = this.m_vertices[i];
            var p2 = this.m_vertices[i];
            //b2Vec2 p3 = i + 1 < this.m_vertexCount ? this.m_vertices[i+1] : this.m_vertices[0];
            var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[i + 1] : this.m_vertices[0];
            //b2Vec2 e1 = p2 - p1;
            var e1X = p2.x - p1X;
            var e1Y = p2.y - p1Y;
            //b2Vec2 e2 = p3 - p1;
            var e2X = p3.x - p1X;
            var e2Y = p3.y - p1Y;
            //float32 D = b2Cross(e1, e2);
            var D = e1X * e2Y - e1Y * e2X;
            //float32 triangleArea = 0.5f * D;
            var triangleArea = 0.5 * D;
            area += triangleArea;
            // Area weighted centroid
            //center += triangleArea * k_inv3 * (p1 + p2 + p3);
            centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
            centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
            //float32 px = p1.x, py = p1.y;
            var px = p1X;
            var py = p1Y;
            //float32 ex1 = e1.x, ey1 = e1.y;
            var ex1 = e1X;
            var ey1 = e1Y;
            //float32 ex2 = e2.x, ey2 = e2.y;
            var ex2 = e2X;
            var ey2 = e2Y;
            //float32 intx2 = k_inv3 * (0.25f * (ex1*ex1 + ex2*ex1 + ex2*ex2) + (px*ex1 + px*ex2)) + 0.5f*px*px;
            var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
            //float32 inty2 = k_inv3 * (0.25f * (ey1*ey1 + ey2*ey1 + ey2*ey2) + (py*ey1 + py*ey2)) + 0.5f*py*py;
            var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
            I += D * (intx2 + inty2);
        }
        // Total mass
        massData.mass = this.m_density * area;
        // Center of mass
        //b2Settings.b2Assert(area > Number.MIN_VALUE);
        //center *= 1.0f / area;
        centerX *= 1.0 / area;
        centerY *= 1.0 / area;
        //massData->center = center;
        massData.center.Set(centerX, centerY);
        // Inertia tensor relative to the local origin.
        massData.I = this.m_density * I;
    };
    /// Get the oriented bounding box relative to the parent body.
    b2PolygonShape.prototype.GetOBB = function () {
        return this.m_obb;
    };
    /// Get local centroid relative to the parent body.
    b2PolygonShape.prototype.GetCentroid = function () {
        return this.m_centroid;
    };
    /// Get the vertex count.
    b2PolygonShape.prototype.GetVertexCount = function () {
        return this.m_vertexCount;
    };
    /// Get the vertices in local coordinates.
    b2PolygonShape.prototype.GetVertices = function () {
        return this.m_vertices;
    };
    /// Get the core vertices in local coordinates. These vertices
    /// represent a smaller polygon that is used for time of impact
    /// computations.
    b2PolygonShape.prototype.GetCoreVertices = function () {
        return this.m_coreVertices;
    };
    /// Get the edge normal vectors. There is one for each vertex.
    b2PolygonShape.prototype.GetNormals = function () {
        return this.m_normals;
    };
    /// Get the first vertex and apply the supplied transform.
    b2PolygonShape.prototype.GetFirstVertex = function (xf) {
        return b2Math.b2MulX(xf, this.m_coreVertices[0]);
    };
    /// Get the centroid and apply the supplied transform.
    b2PolygonShape.prototype.Centroid = function (xf) {
        return b2Math.b2MulX(xf, this.m_centroid);
    };
    b2PolygonShape.prototype.Support = function (xf, dX, dY) {
        var tVec;
        var tMat;
        //b2Vec2 dLocal = b2MulT(xf.R, d);
        tMat = xf.R;
        var dLocalX = (dX * tMat.col1.x + dY * tMat.col1.y);
        var dLocalY = (dX * tMat.col2.x + dY * tMat.col2.y);
        var bestIndex = 0;
        //var bestValue:number = b2Dot(this.m_coreVertices[0], dLocal);
        tVec = this.m_coreVertices[0];
        var bestValue = (tVec.x * dLocalX + tVec.y * dLocalY);
        for (var i = 1; i < this.m_vertexCount; ++i) {
            //var value:number = b2Dot(this.m_coreVertices[i], dLocal);
            tVec = this.m_coreVertices[i];
            var value = (tVec.x * dLocalX + tVec.y * dLocalY);
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        //return b2Math.b2MulX(xf, this.m_coreVertices[bestIndex]);
        tMat = xf.R;
        tVec = this.m_coreVertices[bestIndex];
        this.s_supportVec.x = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        this.s_supportVec.y = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        return this.s_supportVec;
    };
    b2PolygonShape.prototype.UpdateSweepRadius = function (center) {
        var tVec;
        // Update the sweep radius (maximum radius) as measured from
        // a local center point.
        this.m_sweepRadius = 0.0;
        for (var i = 0; i < this.m_vertexCount; ++i) {
            //b2Vec2 d = this.m_coreVertices[i] - center;
            tVec = this.m_coreVertices[i];
            var dX = tVec.x - center.x;
            var dY = tVec.y - center.y;
            dX = Math.sqrt(dX * dX + dY * dY);
            //this.m_sweepRadius = b2Max(this.m_sweepRadius, d.Length());
            if (dX > this.m_sweepRadius)
                this.m_sweepRadius = dX;
        }
    };
    b2PolygonShape.ComputeCentroid = function (vs, count /** int */) {
        //b2Settings.b2Assert(count >= 3);
        //b2Vec2 c; c.Set(0.0f, 0.0f);
        var c = new b2Vec2();
        var area = 0.0;
        // pRef is the reference point for forming triangles.
        // It's location doesn't change the result (except for rounding error).
        //b2Vec2 pRef(0.0f, 0.0f);
        var p1X = 0.0;
        var p1Y = 0.0;
        /*#if 0
        // This code would put the reference point inside the polygon.
        for (int32 i = 0; i < count; ++i)
        {
            pRef += vs[i];
        }
        pRef *= 1.0f / count;
    #endif*/
        var inv3 = 1.0 / 3.0;
        for (var i = 0; i < count; ++i) {
            // Triangle vertices.
            //b2Vec2 p1 = pRef;
            // 0.0, 0.0
            //b2Vec2 p2 = vs[i];
            var p2 = vs[i];
            //b2Vec2 p3 = i + 1 < count ? vs[i+1] : vs[0];
            var p3 = i + 1 < count ? vs[i + 1] : vs[0];
            //b2Vec2 e1 = p2 - p1;
            var e1X = p2.x - p1X;
            var e1Y = p2.y - p1Y;
            //b2Vec2 e2 = p3 - p1;
            var e2X = p3.x - p1X;
            var e2Y = p3.y - p1Y;
            //float32 D = b2Cross(e1, e2);
            var D = (e1X * e2Y - e1Y * e2X);
            //float32 triangleArea = 0.5f * D;
            var triangleArea = 0.5 * D;
            area += triangleArea;
            // Area weighted centroid
            //c += triangleArea * inv3 * (p1 + p2 + p3);
            c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
            c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
        }
        // Centroid
        //beSettings.b2Assert(area > Number.MIN_VALUE);
        //c *= 1.0 / area;
        c.x *= 1.0 / area;
        c.y *= 1.0 / area;
        return c;
    };
    // http://www.geometrictools.com/Documentation/MinimumAreaRectangle.pdf
    b2PolygonShape.ComputeOBB = function (obb, vs, count /** int */) {
        var i /** int */;
        //b2Settings.b2Assert(count <= b2Settings.b2_maxPolygonVertices);
        var p = new Array(b2Settings.b2_maxPolygonVertices + 1);
        for (i = 0; i < count; ++i) {
            p[i] = vs[i];
        }
        p[count] = p[0];
        var minArea = Number.MAX_VALUE;
        for (i = 1; i <= count; ++i) {
            var root = p[i - 1];
            //b2Vec2 ux = p[i] - root;
            var uxX = p[i].x - root.x;
            var uxY = p[i].y - root.y;
            //var length:number = ux.Normalize();
            var length_1 = Math.sqrt(uxX * uxX + uxY * uxY);
            uxX /= length_1;
            uxY /= length_1;
            //b2Settings.b2Assert(length > Number.MIN_VALUE);
            //b2Vec2 uy(-ux.y, ux.x);
            var uyX = -uxY;
            var uyY = uxX;
            //b2Vec2 lower(FLT_MAX, FLT_MAX);
            var lowerX = Number.MAX_VALUE;
            var lowerY = Number.MAX_VALUE;
            //b2Vec2 upper(-FLT_MAX, -FLT_MAX);
            var upperX = -Number.MAX_VALUE;
            var upperY = -Number.MAX_VALUE;
            for (var j = 0; j < count; ++j) {
                //b2Vec2 d = p[j] - root;
                var dX = p[j].x - root.x;
                var dY = p[j].y - root.y;
                //b2Vec2 r;
                //var rX:number = b2Dot(ux, d);
                var rX = (uxX * dX + uxY * dY);
                //var rY:number = b2Dot(uy, d);
                var rY = (uyX * dX + uyY * dY);
                //lower = b2Min(lower, r);
                if (rX < lowerX)
                    lowerX = rX;
                if (rY < lowerY)
                    lowerY = rY;
                //upper = b2Max(upper, r);
                if (rX > upperX)
                    upperX = rX;
                if (rY > upperY)
                    upperY = rY;
            }
            var area = (upperX - lowerX) * (upperY - lowerY);
            if (area < 0.95 * minArea) {
                minArea = area;
                //obb->R.col1 = ux;
                obb.R.col1.x = uxX;
                obb.R.col1.y = uxY;
                //obb->R.col2 = uy;
                obb.R.col2.x = uyX;
                obb.R.col2.y = uyY;
                //b2Vec2 center = 0.5f * (lower + upper);
                var centerX = 0.5 * (lowerX + upperX);
                var centerY = 0.5 * (lowerY + upperY);
                //obb->center = root + b2Mul(obb->R, center);
                var tMat = obb.R;
                obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
                obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
                //obb->extents = 0.5f * (upper - lower);
                obb.extents.x = 0.5 * (upperX - lowerX);
                obb.extents.y = 0.5 * (upperY - lowerY);
            }
        }
        //b2Settings.b2Assert(minArea < Number.MAX_VALUE);
    };
    /// @see b2Shape::ComputeAABB
    //
    b2PolygonShape.s_computeMat = new b2Mat22();
    /// @see b2Shape::ComputeSweptAABB
    //
    b2PolygonShape.s_sweptAABB1 = new b2AABB();
    b2PolygonShape.s_sweptAABB2 = new b2AABB();
    return b2PolygonShape;
}(b2Shape));
export { b2PolygonShape };
