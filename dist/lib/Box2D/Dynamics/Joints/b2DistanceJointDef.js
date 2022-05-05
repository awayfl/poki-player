import { __extends } from "tslib";
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef, b2Joint } from '../Joints';
/**
* Distance joint definition. This requires defining an
* anchor point on both bodies and the non-zero length of the
* distance joint. The definition uses local anchor points
* so that the initial configuration can violate the constraint
* slightly. This helps when saving and loading a game.
* @warning Do not use a zero or short length.
* @see b2DistanceJoint
*/
var b2DistanceJointDef = /** @class */ (function (_super) {
    __extends(b2DistanceJointDef, _super);
    function b2DistanceJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The local anchor point relative to body1's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to body2's origin.
        */
        _this.localAnchorB = new b2Vec2();
        _this.type = b2Joint.e_distanceJoint;
        //localAnchor1.Set(0.0, 0.0);
        //localAnchor2.Set(0.0, 0.0);
        _this.length = 1.0;
        _this.frequencyHz = 0.0;
        _this.dampingRatio = 0.0;
        return _this;
    }
    /**
    * Initialize the bodies, anchors, and length using the world
    * anchors.
    */
    b2DistanceJointDef.prototype.Initialize = function (bA, bB, anchorA, anchorB) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
        this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
        var dX = anchorB.x - anchorA.x;
        var dY = anchorB.y - anchorA.y;
        length = Math.sqrt(dX * dX + dY * dY);
        this.frequencyHz = 0.0;
        this.dampingRatio = 0.0;
    };
    return b2DistanceJointDef;
}(b2JointDef));
export { b2DistanceJointDef };
