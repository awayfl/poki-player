import { b2Vec2 } from '../Common/Math';
/**
 * Output for b2Distance.
 */
var b2DistanceOutput = /** @class */ (function () {
    function b2DistanceOutput() {
        this.__fast__ = true;
        /**
         * Closest point on shapea
         */
        this.pointA = new b2Vec2();
        /**
         * Closest point on shapeb
         */
        this.pointB = new b2Vec2();
    }
    return b2DistanceOutput;
}());
export { b2DistanceOutput };
