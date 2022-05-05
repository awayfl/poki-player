import { __extends } from "tslib";
import { b2JointDef, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/**
* Mouse joint definition. This requires a world target point,
* tuning parameters, and the time step.
* @see b2MouseJoint
*/
var b2MouseJointDef = /** @class */ (function (_super) {
    __extends(b2MouseJointDef, _super);
    function b2MouseJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The initial world target point. This is assumed
        * to coincide with the body anchor initially.
        */
        _this.target = new b2Vec2();
        _this.type = b2Joint.e_mouseJoint;
        _this.maxForce = 0.0;
        _this.frequencyHz = 5.0;
        _this.dampingRatio = 0.7;
        return _this;
    }
    return b2MouseJointDef;
}(b2JointDef));
export { b2MouseJointDef };
