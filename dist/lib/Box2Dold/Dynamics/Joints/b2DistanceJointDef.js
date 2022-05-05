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
import { b2JointDef, b2Joint } from '../Joints';
import { b2Vec2 } from '../../Common/Math/b2Vec2';
/// Distance joint definition. This requires defining an
/// anchor point on both bodies and the non-zero length of the
/// distance joint. The definition uses local anchor points
/// so that the initial configuration can violate the constraint
/// slightly. This helps when saving and loading a game.
/// @warning Do not use a zero or short length.
var b2DistanceJointDef = /** @class */ (function (_super) {
    __extends(b2DistanceJointDef, _super);
    function b2DistanceJointDef() {
        var _this = _super.call(this) || this;
        /// The local anchor point relative to body1's origin.
        _this.localAnchor1 = new b2Vec2();
        /// The local anchor point relative to body2's origin.
        _this.localAnchor2 = new b2Vec2();
        _this.type = b2Joint.e_distanceJoint;
        //localAnchor1.Set(0.0, 0.0);
        //localAnchor2.Set(0.0, 0.0);
        _this.length = 1.0;
        _this.frequencyHz = 0.0;
        _this.dampingRatio = 0.0;
        return _this;
    }
    /// Initialize the bodies, anchors, and length using the world
    /// anchors.
    b2DistanceJointDef.prototype.Initialize = function (b1, b2, anchor1, anchor2) {
        this.body1 = b1;
        this.body2 = b2;
        this.localAnchor1.SetV(this.body1.GetLocalPoint(anchor1));
        this.localAnchor2.SetV(this.body2.GetLocalPoint(anchor2));
        var dX = anchor2.x - anchor1.x;
        var dY = anchor2.y - anchor1.y;
        this.length = Math.sqrt(dX * dX + dY * dY);
        this.frequencyHz = 0.0;
        this.dampingRatio = 0.0;
    };
    return b2DistanceJointDef;
}(b2JointDef));
export { b2DistanceJointDef };
