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
import { b2Vec2 } from '../../Common/Math';
/// Mouse joint definition. This requires a world target point,
/// tuning parameters, and the time step.
var b2MouseJointDef = /** @class */ (function (_super) {
    __extends(b2MouseJointDef, _super);
    function b2MouseJointDef() {
        var _this = _super.call(this) || this;
        /// The initial world target point. This is assumed
        /// to coincide with the body anchor initially.
        _this.target = new b2Vec2();
        _this.type = b2Joint.e_mouseJoint;
        _this.maxForce = 0.0;
        _this.frequencyHz = 5.0;
        _this.dampingRatio = 0.7;
        _this.timeStep = 1.0 / 60.0;
        return _this;
    }
    return b2MouseJointDef;
}(b2JointDef));
export { b2MouseJointDef };
