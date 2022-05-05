import { b2Vec2 } from '../Math';
/**
* This describes the motion of a body/shape for TOI computation.
* Shapes are defined with respect to the body origin, which may
* no coincide with the center of mass. However, to support dynamics
* we must interpolate the center of mass position.
*/
var b2Sweep = /** @class */ (function () {
    function b2Sweep() {
        /** Local center of mass position */
        this.localCenter = new b2Vec2();
        /** Center world position */
        this.c0 = new b2Vec2;
        /** Center world position */
        this.c = new b2Vec2();
    }
    b2Sweep.prototype.Set = function (other) {
        this.localCenter.SetV(other.localCenter);
        this.c0.SetV(other.c0);
        this.c.SetV(other.c);
        this.a0 = other.a0;
        this.a = other.a;
        this.t0 = other.t0;
    };
    b2Sweep.prototype.Copy = function () {
        var copy = new b2Sweep();
        copy.localCenter.SetV(this.localCenter);
        copy.c0.SetV(this.c0);
        copy.c.SetV(this.c);
        copy.a0 = this.a0;
        copy.a = this.a;
        copy.t0 = this.t0;
        return copy;
    };
    /**
    * Get the interpolated transform at a specific time.
    * @param alpha is a factor in [0,1], where 0 indicates t0.
    */
    b2Sweep.prototype.GetTransform = function (xf, alpha) {
        xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
        xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
        var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
        xf.R.Set(angle);
        // Shift to origin
        //xf->position -= b2Mul(xf->R, localCenter);
        var tMat = xf.R;
        xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
        xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
    };
    /**
    * Advance the sweep forward, yielding a new initial state.
    * @param t the new initial time.
    */
    b2Sweep.prototype.Advance = function (t) {
        if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
            var alpha = (t - this.t0) / (1.0 - this.t0);
            //this.c0 = (1.0f - alpha) * c0 + alpha * c;
            this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
            this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
            this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
            this.t0 = t;
        }
    };
    return b2Sweep;
}());
export { b2Sweep };
