import { b2Joint } from '../Joints';
/**
* Joint definitions are used to construct joints.
* @see b2Joint
*/
var b2JointDef = /** @class */ (function () {
    function b2JointDef() {
        this.type = b2Joint.e_unknownJoint;
        this.userData = null;
        this.bodyA = null;
        this.bodyB = null;
        this.collideConnected = false;
    }
    return b2JointDef;
}());
export { b2JointDef };
