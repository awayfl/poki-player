import { b2Vec2 } from '../Common/Math';
/**
 * Specifies a segment for use with RayCast functions.
 */
var b2RayCastInput = /** @class */ (function () {
    function b2RayCastInput(p1, p2, maxFraction) {
        if (p1 === void 0) { p1 = null; }
        if (p2 === void 0) { p2 = null; }
        if (maxFraction === void 0) { maxFraction = 1; }
        this.__fast__ = true;
        /**
         * The start point of the ray
         */
        this.p1 = new b2Vec2();
        /**
         * The end point of the ray
         */
        this.p2 = new b2Vec2();
        if (p1)
            this.p1.SetV(p1);
        if (p2)
            this.p2.SetV(p2);
        this.maxFraction = maxFraction;
    }
    return b2RayCastInput;
}());
export { b2RayCastInput };
