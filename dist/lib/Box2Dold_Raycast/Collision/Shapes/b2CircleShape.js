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
import { b2Vec2 } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
var b2CircleShape = /** @class */ (function (_super) {
    __extends(b2CircleShape, _super);
    //--------------- Internals Below -------------------
    function b2CircleShape(def) {
        var _this = _super.call(this, def) || this;
        // Local position in parent body
        _this.m_localPosition = new b2Vec2();
        //b2Settings.b2Assert(def.type == e_circleShape);
        var circleDef = def;
        _this.m_type = b2CircleShape.e_circleShape;
        _this.m_localPosition.SetV(circleDef.localPosition);
        _this.m_radius = circleDef.radius;
        return _this;
    }
    /// @see b2Shape::TestPoint
    b2CircleShape.prototype.TestPoint = function (transform, p) {
        //b2Vec2 center = transform.position + b2Mul(transform.R, m_localPosition);
        var tMat = transform.R;
        var dX = transform.position.x + (tMat.col1.x * this.m_localPosition.x + tMat.col2.x * this.m_localPosition.y);
        var dY = transform.position.y + (tMat.col1.y * this.m_localPosition.x + tMat.col2.y * this.m_localPosition.y);
        //b2Vec2 d = p - center;
        dX = p.x - dX;
        dY = p.y - dY;
        //return b2Dot(d, d) <= m_radius * m_radius;
        return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
    };
    /// @see b2Shape::TestSegment
    b2CircleShape.prototype.TestSegment = function (transform, lambda, // float pointer
    normal, // pointer
    segment, maxLambda) {
        //b2Vec2 position = transform.position + b2Mul(transform.R, m_localPosition);
        var tMat = transform.R;
        var positionX = transform.position.x + (tMat.col1.x * this.m_localPosition.x + tMat.col2.x * this.m_localPosition.y);
        var positionY = transform.position.y + (tMat.col1.y * this.m_localPosition.x + tMat.col2.y * this.m_localPosition.y);
        //b2Vec2 s = segment.p1 - position;
        var sX = segment.p1.x - positionX;
        var sY = segment.p1.y - positionY;
        //float32 b = b2Dot(s, s) - m_radius * m_radius;
        var b = (sX * sX + sY * sY) - this.m_radius * this.m_radius;
        // Does the segment start inside the circle?
        if (b < 0.0) {
            lambda[0] = 0;
            return b2Shape.e_startsInsideCollide;
        }
        // Solve quadratic equation.
        //b2Vec2 r = segment.p2 - segment.p1;
        var rX = segment.p2.x - segment.p1.x;
        var rY = segment.p2.y - segment.p1.y;
        //float32 c =  b2Dot(s, r);
        var c = (sX * rX + sY * rY);
        //float32 rr = b2Dot(r, r);
        var rr = (rX * rX + rY * rY);
        var sigma = c * c - rr * b;
        // Check for negative discriminant and short segment.
        if (sigma < 0.0 || rr < Number.MIN_VALUE) {
            return b2Shape.e_missCollide;
        }
        // Find the point of intersection of the line with the circle.
        var a = -(c + Math.sqrt(sigma));
        // Is the intersection point on the segment?
        if (0.0 <= a && a <= maxLambda * rr) {
            a /= rr;
            //*lambda = a;
            lambda[0] = a;
            //*normal = s + a * r;
            normal.x = sX + a * rX;
            normal.y = sY + a * rY;
            normal.Normalize();
            return b2Shape.e_hitCollide;
        }
        return b2Shape.e_missCollide;
    };
    /// @see b2Shape::ComputeAABB
    b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
        //b2Vec2 p = transform.position + b2Mul(transform.R, m_localPosition);
        var tMat = transform.R;
        var pX = transform.position.x + (tMat.col1.x * this.m_localPosition.x + tMat.col2.x * this.m_localPosition.y);
        var pY = transform.position.y + (tMat.col1.y * this.m_localPosition.x + tMat.col2.y * this.m_localPosition.y);
        aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
        aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
    };
    /// @see b2Shape::ComputeSweptAABB
    b2CircleShape.prototype.ComputeSweptAABB = function (aabb, transform1, transform2) {
        var tMat;
        //b2Vec2 p1 = transform1.position + b2Mul(transform1.R, m_localPosition);
        tMat = transform1.R;
        var p1X = transform1.position.x + (tMat.col1.x * this.m_localPosition.x + tMat.col2.x * this.m_localPosition.y);
        var p1Y = transform1.position.y + (tMat.col1.y * this.m_localPosition.x + tMat.col2.y * this.m_localPosition.y);
        //b2Vec2 p2 = transform2.position + b2Mul(transform2.R, m_localPosition);
        tMat = transform2.R;
        var p2X = transform2.position.x + (tMat.col1.x * this.m_localPosition.x + tMat.col2.x * this.m_localPosition.y);
        var p2Y = transform2.position.y + (tMat.col1.y * this.m_localPosition.x + tMat.col2.y * this.m_localPosition.y);
        //b2Vec2 lower = b2Min(p1, p2);
        //b2Vec2 upper = b2Max(p1, p2);
        //aabb->lowerBound.Set(lower.x - m_radius, lower.y - m_radius);
        aabb.lowerBound.Set((p1X < p2X ? p1X : p2X) - this.m_radius, (p1Y < p2Y ? p1Y : p2Y) - this.m_radius);
        //aabb->upperBound.Set(upper.x + m_radius, upper.y + m_radius);
        aabb.upperBound.Set((p1X > p2X ? p1X : p2X) + this.m_radius, (p1Y > p2Y ? p1Y : p2Y) + this.m_radius);
    };
    /// @see b2Shape::ComputeMass
    b2CircleShape.prototype.ComputeMass = function (massData) {
        massData.mass = this.m_density * b2Settings.b2_pi * this.m_radius * this.m_radius;
        massData.center.SetV(this.m_localPosition);
        // inertia about the local origin
        //massData.I = massData.mass * (0.5 * m_radius * m_radius + b2Dot(m_localPosition, m_localPosition));
        massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_localPosition.x * this.m_localPosition.x + this.m_localPosition.y * this.m_localPosition.y));
    };
    /// Get the local position of this circle in its parent body.
    b2CircleShape.prototype.GetLocalPosition = function () {
        return this.m_localPosition;
    };
    /// Get the radius of this circle.
    b2CircleShape.prototype.GetRadius = function () {
        return this.m_radius;
    };
    b2CircleShape.prototype.UpdateSweepRadius = function (center) {
        // Update the sweep radius (maximum radius) as measured from
        // a local center point.
        //b2Vec2 d = m_localPosition - center;
        var dX = this.m_localPosition.x - center.x;
        var dY = this.m_localPosition.y - center.y;
        dX = Math.sqrt(dX * dX + dY * dY); // length
        //m_sweepRadius = d.Length() + m_radius - b2_toiSlop;
        this.m_sweepRadius = dX + this.m_radius - b2Settings.b2_toiSlop;
    };
    return b2CircleShape;
}(b2Shape));
export { b2CircleShape };
