import { b2Vec2 } from '../../Common/Math';
/**
* @private
*/
var b2Jacobian = /** @class */ (function () {
    function b2Jacobian() {
        this.linearA = new b2Vec2();
        this.linearB = new b2Vec2();
    }
    b2Jacobian.prototype.SetZero = function () {
        this.linearA.SetZero();
        this.angularA = 0.0;
        this.linearB.SetZero();
        this.angularB = 0.0;
    };
    b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
        this.linearA.SetV(x1);
        this.angularA = a1;
        this.linearB.SetV(x2);
        this.angularB = a2;
    };
    b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
        //return b2Math.b2Dot(this.linearA, x1) + this.angularA * a1 + b2Math.b2Dot(this.linearV, x2) + this.angularV * a2;
        return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
    };
    return b2Jacobian;
}());
export { b2Jacobian };
