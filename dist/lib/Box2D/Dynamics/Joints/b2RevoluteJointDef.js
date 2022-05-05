import { __extends } from "tslib";
import { b2JointDef, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/**
* Revolute joint definition. This requires defining an
* anchor point where the bodies are joined. The definition
* uses local anchor points so that the initial configuration
* can violate the constraint slightly. You also need to
* specify the initial relative angle for joint limits. This
* helps when saving and loading a game.
* The local anchor points are measured from the body's origin
* rather than the center of mass because:
* 1. you might not know where the center of mass will be.
* 2. if you add/remove shapes from a body and recompute the mass,
* the joints will be broken.
* @see b2RevoluteJoint
*/
var b2RevoluteJointDef = /** @class */ (function (_super) {
    __extends(b2RevoluteJointDef, _super);
    function b2RevoluteJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The local anchor point relative to bodyA's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to bodyB's origin.
        */
        _this.localAnchorB = new b2Vec2();
        _this.type = b2Joint.e_revoluteJoint;
        _this.localAnchorA.Set(0.0, 0.0);
        _this.localAnchorB.Set(0.0, 0.0);
        _this.referenceAngle = 0.0;
        _this.lowerAngle = 0.0;
        _this.upperAngle = 0.0;
        _this.maxMotorTorque = 0.0;
        _this.motorSpeed = 0.0;
        _this.enableLimit = false;
        _this.enableMotor = false;
        return _this;
    }
    /**
    * Initialize the bodies, anchors, and reference angle using the world
    * anchor.
    */
    b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    };
    return b2RevoluteJointDef;
}(b2JointDef));
export { b2RevoluteJointDef };
