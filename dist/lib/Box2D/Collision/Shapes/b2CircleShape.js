import { __extends } from "tslib";
import { b2Shape } from './b2Shape';
import { b2Vec2, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
/**
* A circle shape.
* @see b2CircleDef
*/
var b2CircleShape = /** @class */ (function (_super) {
    __extends(b2CircleShape, _super);
    function b2CircleShape(radius) {
        if (radius === void 0) { radius = 0; }
        var _this = _super.call(this) || this;
        _this.__fast__ = true;
        // Local position in parent body
        _this.m_p = new b2Vec2();
        _this.m_type = b2Shape.e_circleShape;
        _this.m_radius = radius;
        return _this;
    }
    b2CircleShape.prototype.Copy = function () {
        var s = new b2CircleShape();
        s.Set(this);
        return s;
    };
    b2CircleShape.prototype.Set = function (other) {
        _super.prototype.Set.call(this, other);
        if (other instanceof b2CircleShape) {
            var other2 = other;
            this.m_p.SetV(other2.m_p);
        }
    };
    /**
    * @inheritDoc
    */
    b2CircleShape.prototype.TestPoint = function (transform, p) {
        //b2Vec2 center = transform.position + b2Mul(transform.R, m_p);
        var tMat = transform.R;
        var dX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
        var dY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
        //b2Vec2 d = p - center;
        dX = p.x - dX;
        dY = p.y - dY;
        //return b2Dot(d, d) <= m_radius * m_radius;
        return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
    };
    /**
    * @inheritDoc
    */
    b2CircleShape.prototype.RayCast = function (output, input, transform) {
        //b2Vec2 position = transform.position + b2Mul(transform.R, m_p);
        var tMat = transform.R;
        var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
        var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
        //b2Vec2 s = input.p1 - position;
        var sX = input.p1.x - positionX;
        var sY = input.p1.y - positionY;
        //float32 b = b2Dot(s, s) - m_radius * m_radius;
        var b = (sX * sX + sY * sY) - this.m_radius * this.m_radius;
        /*// Does the segment start inside the circle?
        if (b < 0.0)
        {
            output.fraction = 0;
            output.hit = e_startsInsideCollide;
            return;
        }*/
        // Solve quadratic equation.
        //b2Vec2 r = input.p2 - input.p1;
        var rX = input.p2.x - input.p1.x;
        var rY = input.p2.y - input.p1.y;
        //float32 c =  b2Dot(s, r);
        var c = (sX * rX + sY * rY);
        //float32 rr = b2Dot(r, r);
        var rr = (rX * rX + rY * rY);
        var sigma = c * c - rr * b;
        // Check for negative discriminant and short segment.
        if (sigma < 0.0 || rr < Number.MIN_VALUE) {
            return false;
        }
        // Find the point of intersection of the line with the circle.
        var a = -(c + Math.sqrt(sigma));
        // Is the intersection point on the segment?
        if (0.0 <= a && a <= input.maxFraction * rr) {
            a /= rr;
            output.fraction = a;
            // manual inline of: output.normal = s + a * r;
            output.normal.x = sX + a * rX;
            output.normal.y = sY + a * rY;
            output.normal.Normalize();
            return true;
        }
        return false;
    };
    /**
    * @inheritDoc
    */
    b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
        //b2Vec2 p = transform.position + b2Mul(transform.R, m_p);
        var tMat = transform.R;
        var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
        var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
        aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
        aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
    };
    /**
    * @inheritDoc
    */
    b2CircleShape.prototype.ComputeMass = function (massData, density) {
        massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
        massData.center.SetV(this.m_p);
        // inertia about the local origin
        //massData.I = massData.mass * (0.5 * m_radius * m_radius + b2Dot(m_p, m_p));
        massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
    };
    /**
    * @inheritDoc
    */
    b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
        var p = b2Math.MulX(xf, this.m_p);
        var l = -(b2Math.Dot(normal, p) - offset);
        if (l < -this.m_radius + Number.MIN_VALUE) {
            //Completely dry
            return 0;
        }
        if (l > this.m_radius) {
            //Completely wet
            c.SetV(p);
            return Math.PI * this.m_radius * this.m_radius;
        }
        //Magic
        var r2 = this.m_radius * this.m_radius;
        var l2 = l * l;
        var area = r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(r2 - l2);
        var com = -2 / 3 * Math.pow(r2 - l2, 1.5) / area;
        c.x = p.x + normal.x * com;
        c.y = p.y + normal.y * com;
        return area;
    };
    /**
     * Get the local position of this circle in its parent body.
     */
    b2CircleShape.prototype.GetLocalPosition = function () {
        return this.m_p;
    };
    /**
     * Set the local position of this circle in its parent body.
     */
    b2CircleShape.prototype.SetLocalPosition = function (position) {
        this.m_p.SetV(position);
    };
    /**
     * Get the radius of the circle
     */
    b2CircleShape.prototype.GetRadius = function () {
        return this.m_radius;
    };
    /**
     * Set the radius of the circle
     */
    b2CircleShape.prototype.SetRadius = function (radius) {
        this.m_radius = radius;
    };
    return b2CircleShape;
}(b2Shape));
export { b2CircleShape };
