import { __extends } from "tslib";
import { b2Shape } from './b2Shape';
import { b2Vec2, b2Math, b2Mat22, b2Transform } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2MassData } from './b2MassData';
var b2PolygonShape = /** @class */ (function (_super) {
    __extends(b2PolygonShape, _super);
    //--------------- Internals Below -------------------
    /**
     * @private
     */
    function b2PolygonShape() {
        var _this = _super.call(this) || this;
        _this.__fast__ = true;
        //b2Settings.b2Assert(def.type == e_polygonShape);
        _this.m_type = b2Shape.e_polygonShape;
        _this.m_centroid = new b2Vec2();
        _this.m_vertices = new Array();
        _this.m_normals = new Array();
        return _this;
    }
    b2PolygonShape.prototype.Copy = function () {
        var s = new b2PolygonShape();
        s.Set(this);
        return s;
    };
    b2PolygonShape.prototype.Set = function (other) {
        _super.prototype.Set.call(this, other);
        if (other instanceof b2PolygonShape) {
            var other2 = other;
            this.m_centroid.SetV(other2.m_centroid);
            this.m_vertexCount = other2.m_vertexCount;
            this.Reserve(this.m_vertexCount);
            for (var i = 0; i < this.m_vertexCount; i++) {
                this.m_vertices[i].SetV(other2.m_vertices[i]);
                this.m_normals[i].SetV(other2.m_normals[i]);
            }
        }
    };
    /**
     * Copy vertices. This assumes the vertices define a convex polygon.
     * It is assumed that the exterior is the the right of each edge.
     */
    b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
        if (vertexCount === void 0) { vertexCount = 0; }
        var vert = vertices;
        if (typeof vert.axInitializer === 'function') {
            vert = vertices.value;
        }
        var v = vert.slice();
        this.SetAsVector(v, vertexCount);
    };
    b2PolygonShape.AsArray = function (vertices, vertexCount) {
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsArray(vertices, vertexCount);
        return polygonShape;
    };
    /**
     * Copy vertices. This assumes the vertices define a convex polygon.
     * It is assumed that the exterior is the the right of each edge.
     */
    b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
        if (vertexCount === void 0) { vertexCount = 0; }
        if (vertexCount == 0)
            vertexCount = vertices.length;
        b2Settings.b2Assert(2 <= vertexCount);
        this.m_vertexCount = vertexCount;
        this.Reserve(vertexCount);
        var i /** int */;
        // Copy vertices
        for (i = 0; i < this.m_vertexCount; i++) {
            this.m_vertices[i].SetV(vertices[i]);
        }
        // Compute normals. Ensure the edges have non-zero length.
        for (i = 0; i < this.m_vertexCount; ++i) {
            var i1 = i;
            var i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
            var edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
            b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE /* * Number.MIN_VALUE*/);
            this.m_normals[i].SetV(b2Math.CrossVF(edge, 1.0));
            this.m_normals[i].Normalize();
        }
        //#ifdef _DEBUG
        // Ensure the polygon is convex and the interior
        // is to the left of each edge.
        //for (int32 i = 0; i < m_vertexCount; ++i)
        //{
        //int32 i1 = i;
        //int32 i2 = i + 1 < m_vertexCount ? i + 1 : 0;
        //b2Vec2 edge = m_vertices[i2] - m_vertices[i1];
        //for (int32 j = 0; j < m_vertexCount; ++j)
        //{
        // Don't check vertices on the current edge.
        //if (j == i1 || j == i2)
        //{
        //continue;
        //}
        //
        //b2Vec2 r = m_vertices[j] - m_vertices[i1];
        // Your polygon is non-convex (it has an indentation) or
        // has colinear edges.
        //float32 s = b2Cross(edge, r);
        //b2Assert(s > 0.0f);
        //}
        //}
        //#endif
        // Compute the polygon centroid
        this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
    };
    b2PolygonShape.AsVector = function (vertices, vertexCount) {
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsVector(vertices, vertexCount);
        return polygonShape;
    };
    /**
    * Build vertices to represent an axis-aligned box.
    * @param hx the half-width.
    * @param hy the half-height.
    */
    b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
        this.m_vertexCount = 4;
        this.Reserve(4);
        this.m_vertices[0].Set(-hx, -hy);
        this.m_vertices[1].Set(hx, -hy);
        this.m_vertices[2].Set(hx, hy);
        this.m_vertices[3].Set(-hx, hy);
        this.m_normals[0].Set(0.0, -1.0);
        this.m_normals[1].Set(1.0, 0.0);
        this.m_normals[2].Set(0.0, 1.0);
        this.m_normals[3].Set(-1.0, 0.0);
        this.m_centroid.SetZero();
    };
    b2PolygonShape.AsBox = function (hx, hy) {
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsBox(hx, hy);
        return polygonShape;
    };
    b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
        if (center === void 0) { center = null; }
        if (angle === void 0) { angle = 0.0; }
        this.m_vertexCount = 4;
        this.Reserve(4);
        this.m_vertices[0].Set(-hx, -hy);
        this.m_vertices[1].Set(hx, -hy);
        this.m_vertices[2].Set(hx, hy);
        this.m_vertices[3].Set(-hx, hy);
        this.m_normals[0].Set(0.0, -1.0);
        this.m_normals[1].Set(1.0, 0.0);
        this.m_normals[2].Set(0.0, 1.0);
        this.m_normals[3].Set(-1.0, 0.0);
        this.m_centroid = center;
        var xf = new b2Transform();
        xf.position = center;
        xf.R.Set(angle);
        // Transform vertices and normals.
        for (var i = 0; i < this.m_vertexCount; ++i) {
            this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
            this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
        }
    };
    b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
        if (center === void 0) { center = null; }
        if (angle === void 0) { angle = 0.0; }
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsOrientedBox(hx, hy, center, angle);
        return polygonShape;
    };
    /**
     * Set this as a single edge.
     */
    b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
        this.m_vertexCount = 2;
        this.Reserve(2);
        this.m_vertices[0].SetV(v1);
        this.m_vertices[1].SetV(v2);
        this.m_centroid.x = 0.5 * (v1.x + v2.x);
        this.m_centroid.y = 0.5 * (v1.y + v2.y);
        this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1.0);
        this.m_normals[0].Normalize();
        this.m_normals[1].x = -this.m_normals[0].x;
        this.m_normals[1].y = -this.m_normals[0].y;
    };
    /**
     * Set this as a single edge.
     */
    b2PolygonShape.AsEdge = function (v1, v2) {
        var polygonShape = new b2PolygonShape();
        polygonShape.SetAsEdge(v1, v2);
        return polygonShape;
    };
    /**
    * @inheritDoc
    */
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
    /**
     * @inheritDoc
     */
    b2PolygonShape.prototype.RayCast = function (output, input, transform) {
        var lower = 0.0;
        var upper = input.maxFraction;
        var tX;
        var tY;
        var tMat;
        var tVec;
        // Put the ray into the polygon's frame of reference. (AS3 Port Manual inlining follows)
        //b2Vec2 p1 = b2MulT(transform.R, segment.p1 - transform.position);
        tX = input.p1.x - transform.position.x;
        tY = input.p1.y - transform.position.y;
        tMat = transform.R;
        var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
        var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
        //b2Vec2 p2 = b2MulT(transform.R, segment.p2 - transform.position);
        tX = input.p2.x - transform.position.x;
        tY = input.p2.y - transform.position.y;
        tMat = transform.R;
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
            //float32 numerator = b2Dot(m_normals[i], m_vertices[i] - p1);
            tVec = this.m_vertices[i];
            tX = tVec.x - p1X;
            tY = tVec.y - p1Y;
            tVec = this.m_normals[i];
            var numerator = (tVec.x * tX + tVec.y * tY);
            //float32 denominator = b2Dot(m_normals[i], d);
            var denominator = (tVec.x * dX + tVec.y * dY);
            if (denominator == 0.0) {
                if (numerator < 0.0) {
                    return false;
                }
            }
            else {
                // Note: we want this predicate without division:
                // lower < numerator / denominator, where denominator < 0
                // Since denominator < 0, we have to flip the inequality:
                // lower < numerator / denominator <==> denominator * lower > numerator.
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
            }
            if (upper < lower - Number.MIN_VALUE) {
                return false;
            }
        }
        //b2Settings.b2Assert(0.0 <= lower && lower <= input.maxLambda);
        if (index >= 0) {
            output.fraction = lower;
            //output.normal = b2Mul(transform.R, m_normals[index]);
            tMat = transform.R;
            tVec = this.m_normals[index];
            output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            return true;
        }
        return false;
    };
    /**
     * @inheritDoc
     */
    b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
        //var lower:b2Vec2 = b2Math.MulX(xf, m_vertices[0]);
        var tMat = xf.R;
        var tVec = this.m_vertices[0];
        var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        var upperX = lowerX;
        var upperY = lowerY;
        for (var i = 1; i < this.m_vertexCount; ++i) {
            tVec = this.m_vertices[i];
            var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            lowerX = lowerX < vX ? lowerX : vX;
            lowerY = lowerY < vY ? lowerY : vY;
            upperX = upperX > vX ? upperX : vX;
            upperY = upperY > vY ? upperY : vY;
        }
        aabb.lowerBound.x = lowerX - this.m_radius;
        aabb.lowerBound.y = lowerY - this.m_radius;
        aabb.upperBound.x = upperX + this.m_radius;
        aabb.upperBound.y = upperY + this.m_radius;
    };
    /**
    * @inheritDoc
    */
    b2PolygonShape.prototype.ComputeMass = function (massData, density) {
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
        //b2Settings.b2Assert(m_vertexCount >= 2);
        // A line segment has zero mass.
        if (this.m_vertexCount == 2) {
            massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
            massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
            massData.mass = 0.0;
            massData.I = 0.0;
            return;
        }
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
        for (int32 i = 0; i < m_vertexCount; ++i)
        {
            pRef += m_vertices[i];
        }
        pRef *= 1.0f / count;
        #endif*/
        var k_inv3 = 1.0 / 3.0;
        for (var i = 0; i < this.m_vertexCount; ++i) {
            // Triangle vertices.
            //b2Vec2 p1 = pRef;
            //
            //b2Vec2 p2 = m_vertices[i];
            var p2 = this.m_vertices[i];
            //b2Vec2 p3 = i + 1 < m_vertexCount ? m_vertices[i+1] : m_vertices[0];
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
        massData.mass = density * area;
        // Center of mass
        //b2Settings.b2Assert(area > Number.MIN_VALUE);
        //center *= 1.0f / area;
        centerX *= 1.0 / area;
        centerY *= 1.0 / area;
        //massData->center = center;
        massData.center.Set(centerX, centerY);
        // Inertia tensor relative to the local origin.
        massData.I = density * I;
    };
    /**
    * @inheritDoc
    */
    b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        // Transform plane into shape co-ordinates
        var normalL = b2Math.MulTMV(xf.R, normal);
        var offsetL = offset - b2Math.Dot(normal, xf.position);
        var depths = new Array();
        var diveCount = 0;
        var intoIndex = -1;
        var outoIndex = -1;
        var lastSubmerged = false;
        var i /** int */;
        for (i = 0; i < this.m_vertexCount; ++i) {
            depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
            var isSubmerged = depths[i] < -Number.MIN_VALUE;
            if (i > 0) {
                if (isSubmerged) {
                    if (!lastSubmerged) {
                        intoIndex = i - 1;
                        diveCount++;
                    }
                }
                else {
                    if (lastSubmerged) {
                        outoIndex = i - 1;
                        diveCount++;
                    }
                }
            }
            lastSubmerged = isSubmerged;
        }
        switch (diveCount) {
            case 0:
                if (lastSubmerged) {
                    // Completely submerged
                    var md = new b2MassData();
                    this.ComputeMass(md, 1);
                    c.SetV(b2Math.MulX(xf, md.center));
                    return md.mass;
                }
                else {
                    //Completely dry
                    return 0;
                }
                break;
            case 1:
                if (intoIndex == -1) {
                    intoIndex = this.m_vertexCount - 1;
                }
                else {
                    outoIndex = this.m_vertexCount - 1;
                }
                break;
        }
        var intoIndex2 = (intoIndex + 1) % this.m_vertexCount;
        var outoIndex2 = (outoIndex + 1) % this.m_vertexCount;
        var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
        var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
        var intoVec = new b2Vec2(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
        var outoVec = new b2Vec2(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
        // Initialize accumulator
        var area = 0;
        var center = new b2Vec2();
        var p2 = this.m_vertices[intoIndex2];
        var p3;
        // An awkward loop from intoIndex2+1 to outIndex2
        i = intoIndex2;
        while (i != outoIndex2) {
            i = (i + 1) % this.m_vertexCount;
            if (i == outoIndex2)
                p3 = outoVec;
            else
                p3 = this.m_vertices[i];
            var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
            area += triangleArea;
            // Area weighted centroid
            center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
            center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
            p2 = p3;
        }
        //Normalize and transform centroid
        center.Multiply(1 / area);
        c.SetV(b2Math.MulX(xf, center));
        return area;
    };
    /**
    * Get the vertex count.
    */
    b2PolygonShape.prototype.GetVertexCount = function () {
        return this.m_vertexCount;
    };
    /**
    * Get the vertices in local coordinates.
    */
    b2PolygonShape.prototype.GetVertices = function () {
        return this.m_vertices;
    };
    /**
    * Get the edge normal vectors. There is one for each vertex.
    */
    b2PolygonShape.prototype.GetNormals = function () {
        return this.m_normals;
    };
    /**
     * Get the supporting vertex index in the given direction.
     */
    b2PolygonShape.prototype.GetSupport = function (d) {
        var bestIndex = 0;
        var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
        for (var i = 1; i < this.m_vertexCount; ++i) {
            var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        return bestIndex;
    };
    b2PolygonShape.prototype.GetSupportVertex = function (d) {
        var bestIndex = 0;
        var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
        for (var i = 1; i < this.m_vertexCount; ++i) {
            var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
            if (value > bestValue) {
                bestIndex = i;
                bestValue = value;
            }
        }
        return this.m_vertices[bestIndex];
    };
    // TODO: Expose this
    b2PolygonShape.prototype.Validate = function () {
        /*
        // Ensure the polygon is convex.
        for (int32 i = 0; i < m_vertexCount; ++i)
        {
            for (int32 j = 0; j < m_vertexCount; ++j)
            {
                // Don't check vertices on the current edge.
                if (j == i || j == (i + 1) % m_vertexCount)
                {
                    continue;
                }

                // Your polygon is non-convex (it has an indentation).
                // Or your polygon is too skinny.
                float32 s = b2Dot(m_normals[i], this.m_vertices[j] - this.m_vertices[i]);
                b2Assert(s < -b2_linearSlop);
            }
        }

        // Ensure the polygon is counter-clockwise.
        for (i = 1; i < m_vertexCount; ++i)
        {
            var cross:number = b2Math.b2CrossVV(m_normals[int(i-1)], m_normals[i]);

            // Keep asinf happy.
            cross = b2Math.b2Clamp(cross, -1.0, 1.0);

            // You have consecutive edges that are almost parallel on your polygon.
            var angle:number = Math.asin(cross);
            //b2Assert(angle > b2_angularSlop);
            trace(angle > b2Settings.b2_angularSlop);
        }
        */
        return false;
    };
    b2PolygonShape.prototype.Reserve = function (count /** int */) {
        for (var i = this.m_vertices.length; i < count; i++) {
            this.m_vertices[i] = new b2Vec2();
            this.m_normals[i] = new b2Vec2();
        }
    };
    /**
     * Computes the centroid of the given polygon
     * @param	vs		vector of b2Vec specifying a polygon
     * @param	count	length of vs
     * @return the polygon centroid
     */
    b2PolygonShape.ComputeCentroid = function (vs, count /** uint */) {
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
    /**
     * Computes a polygon's OBB
     * @see http://www.geometrictools.com/Documentation/MinimumAreaRectangle.pdf
     */
    b2PolygonShape.ComputeOBB = function (obb, vs, count /** int */) {
        var i /** int */;
        var p = new Array(count + 1);
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
    /**
    * Build vertices to represent an oriented box.
    * @param hx the half-width.
    * @param hy the half-height.
    * @param center the center of the box in local coordinates.
    * @param angle the rotation of the box in local coordinates.
    */
    b2PolygonShape.s_mat = new b2Mat22();
    return b2PolygonShape;
}(b2Shape));
export { b2PolygonShape };
