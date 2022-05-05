import { b2Vec2 } from '../Common/Math';
import { b2Body } from './b2Body';
/**
* A body definition holds all the data needed to construct a rigid body.
* You can safely re-use body definitions.
*/
var b2BodyDef = /** @class */ (function () {
    /**
    * This constructor sets the body definition default values.
    */
    function b2BodyDef() {
        this.__fast__ = true;
        /**
         * The world position of the body. Avoid creating bodies at the origin
         * since this can lead to many overlapping shapes.
         */
        this.position = new b2Vec2();
        /**
         * The linear velocity of the body's origin in world co-ordinates.
         */
        this.linearVelocity = new b2Vec2();
        this.userData = null;
        this.position.Set(0.0, 0.0);
        this.angle = 0.0;
        this.linearVelocity.Set(0, 0);
        this.angularVelocity = 0.0;
        this.linearDamping = 0.0;
        this.angularDamping = 0.0;
        this.allowSleep = true;
        this.awake = true;
        this.fixedRotation = false;
        this.bullet = false;
        this.type = b2Body.b2_staticBody;
        this.active = true;
        this.inertiaScale = 1.0;
    }
    return b2BodyDef;
}());
export { b2BodyDef };
