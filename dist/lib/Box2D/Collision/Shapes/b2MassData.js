import { b2Vec2 } from '../../Common/Math';
/**
* This holds the mass data computed for a shape.
*/
var b2MassData = /** @class */ (function () {
    function b2MassData() {
        /**
        * The mass of the shape, usually in kilograms.
        */
        this.mass = 0.0;
        /**
        * The position of the shape's centroid relative to the shape's origin.
        */
        this.center = new b2Vec2(0, 0);
        /**
        * The rotational inertia of the shape.
        * This may be about the center or local origin, depending on usage.
        */
        this.I = 0.0;
    }
    return b2MassData;
}());
export { b2MassData };
