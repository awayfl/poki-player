import { __extends } from "tslib";
import { b2JointDef, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/**
 * Weld joint definition. You need to specify local anchor points
 * where they are attached and the relative body angle. The position
 * of the anchor points is important for computing the reaction torque.
 * @see b2WeldJoint
 */
var b2WeldJointDef = /** @class */ (function (_super) {
    __extends(b2WeldJointDef, _super);
    function b2WeldJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The local anchor point relative to bodyA's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to bodyB's origin.
        */
        _this.localAnchorB = new b2Vec2();
        _this.type = b2Joint.e_weldJoint;
        _this.referenceAngle = 0.0;
        return _this;
    }
    /**
     * Initialize the bodies, anchors, axis, and reference angle using the world
     * anchor and world axis.
     */
    b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    };
    return b2WeldJointDef;
}(b2JointDef));
export { b2WeldJointDef };
