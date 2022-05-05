import { b2Mat22, b2Vec2 } from '../Common/Math';
/**
* An oriented bounding box.
*/
var b2OBB = /** @class */ (function () {
    function b2OBB() {
        this.__fast__ = true;
        /** The rotation matrix */
        this.R = new b2Mat22();
        /** The local centroid */
        this.center = new b2Vec2();
        /** The half-widths */
        this.extents = new b2Vec2();
    }
    return b2OBB;
}());
export { b2OBB };
