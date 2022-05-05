import { b2Vec2 } from '../Common/Math';
/**
* An axis aligned bounding box.
*/
var b2AABB = /** @class */ (function () {
    function b2AABB() {
        this.__fast__ = true;
        /** The lower vertex */
        this.lowerBound = new b2Vec2();
        /** The upper vertex */
        this.upperBound = new b2Vec2();
    }
    /**
    * Verify that the bounds are sorted.
    */
    b2AABB.prototype.IsValid = function () {
        //b2Vec2 d = upperBound - lowerBound;;
        var dX = this.upperBound.x - this.lowerBound.x;
        var dY = this.upperBound.y - this.lowerBound.y;
        var valid = dX >= 0.0 && dY >= 0.0;
        valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
        return valid;
    };
    /** Get the center of the AABB. */
    b2AABB.prototype.GetCenter = function () {
        return new b2Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
    };
    /** Get the extents of the AABB (half-widths). */
    b2AABB.prototype.GetExtents = function () {
        return new b2Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
    };
    /**
     * Is an AABB contained within this one.
     */
    b2AABB.prototype.Contains = function (aabb) {
        var result = true;
        result = result && this.lowerBound.x <= aabb.lowerBound.x;
        result = result && this.lowerBound.y <= aabb.lowerBound.y;
        result = result && aabb.upperBound.x <= this.upperBound.x;
        result = result && aabb.upperBound.y <= this.upperBound.y;
        return result;
    };
    // From Real-time Collision Detection, p179.
    /**
     * Perform a precise raycast against the AABB.
     */
    b2AABB.prototype.RayCast = function (output, input) {
        var tmin = -Number.MAX_VALUE;
        var tmax = Number.MAX_VALUE;
        var pX = input.p1.x;
        var pY = input.p1.y;
        var dX = input.p2.x - input.p1.x;
        var dY = input.p2.y - input.p1.y;
        var absDX = Math.abs(dX);
        var absDY = Math.abs(dY);
        var normal = output.normal;
        var inv_d;
        var t1;
        var t2;
        var t3;
        var s;
        //x
        {
            if (absDX < Number.MIN_VALUE) {
                // Parallel.
                if (pX < this.lowerBound.x || this.upperBound.x < pX)
                    return false;
            }
            else {
                inv_d = 1.0 / dX;
                t1 = (this.lowerBound.x - pX) * inv_d;
                t2 = (this.upperBound.x - pX) * inv_d;
                // Sign of the normal vector
                s = -1.0;
                if (t1 > t2) {
                    t3 = t1;
                    t1 = t2;
                    t2 = t3;
                    s = 1.0;
                }
                // Push the min up
                if (t1 > tmin) {
                    normal.x = s;
                    normal.y = 0;
                    tmin = t1;
                }
                // Pull the max down
                tmax = Math.min(tmax, t2);
                if (tmin > tmax)
                    return false;
            }
        }
        //y
        {
            if (absDY < Number.MIN_VALUE) {
                // Parallel.
                if (pY < this.lowerBound.y || this.upperBound.y < pY)
                    return false;
            }
            else {
                inv_d = 1.0 / dY;
                t1 = (this.lowerBound.y - pY) * inv_d;
                t2 = (this.upperBound.y - pY) * inv_d;
                // Sign of the normal vector
                s = -1.0;
                if (t1 > t2) {
                    t3 = t1;
                    t1 = t2;
                    t2 = t3;
                    s = 1.0;
                }
                // Push the min up
                if (t1 > tmin) {
                    normal.y = s;
                    normal.x = 0;
                    tmin = t1;
                }
                // Pull the max down
                tmax = Math.min(tmax, t2);
                if (tmin > tmax)
                    return false;
            }
        }
        output.fraction = tmin;
        return true;
    };
    /**
     * Tests if another AABB overlaps this one.
     */
    b2AABB.prototype.TestOverlap = function (other) {
        var d1X = other.lowerBound.x - this.upperBound.x;
        var d1Y = other.lowerBound.y - this.upperBound.y;
        var d2X = this.lowerBound.x - other.upperBound.x;
        var d2Y = this.lowerBound.y - other.upperBound.y;
        if (d1X > 0.0 || d1Y > 0.0)
            return false;
        if (d2X > 0.0 || d2Y > 0.0)
            return false;
        return true;
    };
    /** Combine two AABBs into one. */
    b2AABB.Combine = function (aabb1, aabb2) {
        var aabb = new b2AABB();
        aabb.Combine(aabb1, aabb2);
        return aabb;
    };
    /** Combine two AABBs into one. */
    b2AABB.prototype.Combine = function (aabb1, aabb2) {
        this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
        this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
        this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
        this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
    };
    return b2AABB;
}());
export { b2AABB };
