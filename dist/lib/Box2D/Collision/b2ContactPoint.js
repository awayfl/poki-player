import { b2Vec2 } from '../Common/Math';
import { b2ContactID } from './b2ContactID';
/**
* This structure is used to report contact points.
*/
var b2ContactPoint = /** @class */ (function () {
    function b2ContactPoint() {
        this.__fast__ = true;
        /** Position in world coordinates */
        this.position = new b2Vec2();
        /** Velocity of point on body2 relative to point on body1 (pre-solver) */
        this.velocity = new b2Vec2();
        /** Points from shape1 to shape2 */
        this.normal = new b2Vec2();
        /** The contact id identifies the features in contact */
        this.id = new b2ContactID();
    }
    return b2ContactPoint;
}());
export { b2ContactPoint };
