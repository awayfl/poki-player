import { __extends } from "tslib";
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef, b2Joint } from '../Joints';
/**
* Prismatic joint definition. This requires defining a line of
* motion using an axis and an anchor point. The definition uses local
* anchor points and a local axis so that the initial configuration
* can violate the constraint slightly. The joint translation is zero
* when the local anchor points coincide in world space. Using local
* anchors and a local axis helps when saving and loading a game.
* @see b2PrismaticJoint
*/
var b2PrismaticJointDef = /** @class */ (function (_super) {
    __extends(b2PrismaticJointDef, _super);
    function b2PrismaticJointDef() {
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
        * The local translation axis in body1.
        */
        _this.localAxisA = new b2Vec2();
        _this.type = b2Joint.e_prismaticJoint;
        //this.localAnchor1.SetZero();
        //this.localAnchor2.SetZero();
        _this.localAxisA.Set(1.0, 0.0);
        _this.referenceAngle = 0.0;
        _this.enableLimit = false;
        _this.lowerTranslation = 0.0;
        _this.upperTranslation = 0.0;
        _this.enableMotor = false;
        _this.maxMotorForce = 0.0;
        _this.motorSpeed = 0.0;
        return _this;
    }
    b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
        this.localAxisA = this.bodyA.GetLocalVector(axis);
        this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
    };
    return b2PrismaticJointDef;
}(b2JointDef));
export { b2PrismaticJointDef };
