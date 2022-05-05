/**
* A 2D column vector with 3 elements.
*/
var b2Vec3 = /** @class */ (function () {
    /**
     * Construct using co-ordinates
     */
    function b2Vec3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        this.__fast__ = true;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Sets this vector to all zeros
     */
    b2Vec3.prototype.SetZero = function () {
        this.x = this.y = this.z = 0.0;
    };
    /**
     * Set this vector to some specified coordinates.
     */
    b2Vec3.prototype.Set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    b2Vec3.prototype.SetV = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    };
    /**
     * Negate this vector
     */
    b2Vec3.prototype.GetNegative = function () {
        return new b2Vec3(-this.x, -this.y, -this.z);
    };
    b2Vec3.prototype.NegativeSelf = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    };
    b2Vec3.prototype.Copy = function () {
        return new b2Vec3(this.x, this.y, this.z);
    };
    b2Vec3.prototype.Add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    };
    b2Vec3.prototype.Subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    };
    b2Vec3.prototype.Multiply = function (a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
    };
    return b2Vec3;
}());
export { b2Vec3 };
