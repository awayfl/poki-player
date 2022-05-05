import { __extends } from "tslib";
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef, b2Joint } from '../Joints';
/**
 * Friction joint defintion
 * @see b2FrictionJoint
 */
var b2FrictionJointDef = /** @class */ (function (_super) {
    __extends(b2FrictionJointDef, _super);
    function b2FrictionJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The local anchor point relative to bodyA's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to bodyB's origin.
        */
        _this.localAnchorB = new b2Vec2();
        _this.type = b2Joint.e_frictionJoint;
        _this.maxForce = 0.0;
        _this.maxTorque = 0.0;
        return _this;
    }
    /**
     * Initialize the bodies, anchors, axis, and reference angle using the world
     * anchor and world axis.
     */
    b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
    };
    return b2FrictionJointDef;
}(b2JointDef));
export { b2FrictionJointDef };
