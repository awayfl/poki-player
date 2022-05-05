import { __extends } from "tslib";
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef, b2PulleyJoint, b2Joint } from '../Joints';
/**
* Pulley joint definition. This requires two ground anchors,
* two dynamic body anchor points, max lengths for each side,
* and a pulley ratio.
* @see b2PulleyJoint
*/
var b2PulleyJointDef = /** @class */ (function (_super) {
    __extends(b2PulleyJointDef, _super);
    function b2PulleyJointDef() {
        var _this = _super.call(this) || this;
        /**
        * The first ground anchor in world coordinates. This point never moves.
        */
        _this.groundAnchorA = new b2Vec2();
        /**
        * The second ground anchor in world coordinates. This point never moves.
        */
        _this.groundAnchorB = new b2Vec2();
        /**
        * The local anchor point relative to bodyA's origin.
        */
        _this.localAnchorA = new b2Vec2();
        /**
        * The local anchor point relative to bodyB's origin.
        */
        _this.localAnchorB = new b2Vec2();
        _this.type = b2Joint.e_pulleyJoint;
        _this.groundAnchorA.Set(-1.0, 1.0);
        _this.groundAnchorB.Set(1.0, 1.0);
        _this.localAnchorA.Set(-1.0, 0.0);
        _this.localAnchorB.Set(1.0, 0.0);
        _this.lengthA = 0.0;
        _this.maxLengthA = 0.0;
        _this.lengthB = 0.0;
        _this.maxLengthB = 0.0;
        _this.ratio = 1.0;
        _this.collideConnected = true;
        return _this;
    }
    b2PulleyJointDef.prototype.Initialize = function (bA, bB, gaA, gaB, anchorA, anchorB, r) {
        this.bodyA = bA;
        this.bodyB = bB;
        this.groundAnchorA.SetV(gaA);
        this.groundAnchorB.SetV(gaB);
        this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
        this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
        //b2Vec2 d1 = anchorA - gaA;
        var d1X = anchorA.x - gaA.x;
        var d1Y = anchorA.y - gaA.y;
        //length1 = d1.Length();
        this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
        //b2Vec2 d2 = anchor2 - ga2;
        var d2X = anchorB.x - gaB.x;
        var d2Y = anchorB.y - gaB.y;
        //length2 = d2.Length();
        this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
        this.ratio = r;
        //b2Settings.b2Assert(ratio > Number.MIN_VALUE);
        var C = this.lengthA + this.ratio * this.lengthB;
        this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
        this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
    };
    return b2PulleyJointDef;
}(b2JointDef));
export { b2PulleyJointDef };
