/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { __extends } from "tslib";
import { b2JointDef, b2PulleyJoint, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/// Pulley joint definition. This requires two ground anchors,
/// two dynamic body anchor points, max lengths for each side,
/// and a pulley ratio.
var b2PulleyJointDef = /** @class */ (function (_super) {
    __extends(b2PulleyJointDef, _super);
    function b2PulleyJointDef() {
        var _this = _super.call(this) || this;
        /// The first ground anchor in world coordinates. This point never moves.
        _this.groundAnchor1 = new b2Vec2();
        /// The second ground anchor in world coordinates. This point never moves.
        _this.groundAnchor2 = new b2Vec2();
        /// The local anchor point relative to body1's origin.
        _this.localAnchor1 = new b2Vec2();
        /// The local anchor point relative to body2's origin.
        _this.localAnchor2 = new b2Vec2();
        _this.type = b2Joint.e_pulleyJoint;
        _this.groundAnchor1.Set(-1.0, 1.0);
        _this.groundAnchor2.Set(1.0, 1.0);
        _this.localAnchor1.Set(-1.0, 0.0);
        _this.localAnchor2.Set(1.0, 0.0);
        _this.length1 = 0.0;
        _this.maxLength1 = 0.0;
        _this.length2 = 0.0;
        _this.maxLength2 = 0.0;
        _this.ratio = 1.0;
        _this.collideConnected = true;
        return _this;
    }
    b2PulleyJointDef.prototype.Initialize = function (b1, b2, ga1, ga2, anchor1, anchor2, r) {
        this.body1 = b1;
        this.body2 = b2;
        this.groundAnchor1.SetV(ga1);
        this.groundAnchor2.SetV(ga2);
        this.localAnchor1 = this.body1.GetLocalPoint(anchor1);
        this.localAnchor2 = this.body2.GetLocalPoint(anchor2);
        //b2Vec2 d1 = anchor1 - ga1;
        var d1X = anchor1.x - ga1.x;
        var d1Y = anchor1.y - ga1.y;
        //length1 = d1.Length();
        this.length1 = Math.sqrt(d1X * d1X + d1Y * d1Y);
        //b2Vec2 d2 = anchor2 - ga2;
        var d2X = anchor2.x - ga2.x;
        var d2Y = anchor2.y - ga2.y;
        //length2 = d2.Length();
        this.length2 = Math.sqrt(d2X * d2X + d2Y * d2Y);
        this.ratio = r;
        //b2Settings.b2Assert(ratio > Number.MIN_VALUE);
        var C = this.length1 + this.ratio * this.length2;
        this.maxLength1 = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
        this.maxLength2 = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
    };
    return b2PulleyJointDef;
}(b2JointDef));
export { b2PulleyJointDef };
