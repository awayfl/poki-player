import { b2Vec2 } from '../Common/Math';
/**
 * Returns data on the collision between a ray and a shape.
 */
var b2RayCastOutput = /** @class */ (function () {
    function b2RayCastOutput() {
        this.__fast__ = true;
        /**
         * The normal at the point of collision
         */
        this.normal = new b2Vec2();
    }
    return b2RayCastOutput;
}());
export { b2RayCastOutput };
