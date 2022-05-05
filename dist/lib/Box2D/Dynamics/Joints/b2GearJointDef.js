import { __extends } from "tslib";
import { b2JointDef, b2Joint } from '../Joints';
/**
* Gear joint definition. This definition requires two existing
* revolute or prismatic joints (any combination will work).
* The provided joints must attach a dynamic body to a static body.
* @see b2GearJoint
*/
var b2GearJointDef = /** @class */ (function (_super) {
    __extends(b2GearJointDef, _super);
    function b2GearJointDef() {
        var _this = _super.call(this) || this;
        _this.type = b2Joint.e_gearJoint;
        _this.joint1 = null;
        _this.joint2 = null;
        _this.ratio = 1.0;
        return _this;
    }
    return b2GearJointDef;
}(b2JointDef));
export { b2GearJointDef };
