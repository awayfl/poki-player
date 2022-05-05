import { __extends } from "tslib";
import { b2JointDef, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/**
 * Line joint definition. This requires defining a line of
 * motion using an axis and an anchor point. The definition uses local
 * anchor points and a local axis so that the initial configuration
 * can violate the constraint slightly. The joint translation is zero
 * when the local anchor points coincide in world space. Using local
 * anchors and a local axis helps when saving and loading a game.
 * @see b2LineJoint
 */
var b2LineJointDef = /** @class */ (function (_super) {
    __extends(b2LineJointDef, _super);
    function b2LineJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The local anchor point relative to bodyA's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to bodyB's origin.
        */
        _this.localAnchorB = new b2Vec2();
        /**
        * The local translation axis in bodyA.
        */
        _this.localAxisA = new b2Vec2();
        _this.type = b2Joint.e_lineJoint;
        //this.localAnchor1.SetZero();
        //this.localAnchor2.SetZero();
        _this.localAxisA.Set(1.0, 0.0);
        _this.enableLimit = false;
        _this.lowerTranslation = 0.0;
        _this.upperTranslation = 0.0;
        _this.enableMotor = false;
        _this.maxMotorForce = 0.0;
        _this.motorSpeed = 0.0;
        return _this;
    }
    b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
        this.localAxisA = this.bodyA.GetLocalVector(axis);
    };
    return b2LineJointDef;
}(b2JointDef));
export { b2LineJointDef };
