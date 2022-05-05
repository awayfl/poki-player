import { b2Vec2, b2Mat22 } from '../Math';
/**
* A transform contains translation and rotation. It is used to represent
* the position and orientation of rigid frames.
*/
var b2Transform = /** @class */ (function () {
    /**
    * The default constructor does nothing (for performance).
    */
    function b2Transform(pos, r) {
        if (pos === void 0) { pos = null; }
        if (r === void 0) { r = null; }
        this.__fast__ = true;
        this.position = new b2Vec2;
        this.R = new b2Mat22();
        if (pos) {
            this.position.SetV(pos);
            this.R.SetM(r);
        }
    }
    /**
    * Initialize using a position vector and a rotation matrix.
    */
    b2Transform.prototype.Initialize = function (pos, r) {
        this.position.SetV(pos);
        this.R.SetM(r);
    };
    /**
    * Set this to the identity transform.
    */
    b2Transform.prototype.SetIdentity = function () {
        this.position.SetZero();
        this.R.SetIdentity();
    };
    b2Transform.prototype.Set = function (x) {
        this.position.SetV(x.position);
        this.R.SetM(x.R);
    };
    /**
     * Calculate the angle that the rotation matrix represents.
     */
    b2Transform.prototype.GetAngle = function () {
        return Math.atan2(this.R.col1.y, this.R.col1.x);
    };
    return b2Transform;
}());
export { b2Transform };
