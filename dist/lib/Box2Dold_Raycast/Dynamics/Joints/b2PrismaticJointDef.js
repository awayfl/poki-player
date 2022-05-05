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
var b2PrismaticJointDef = /** @class */ (function (_super) {
    __extends(b2PrismaticJointDef, _super);
    function b2PrismaticJointDef() {
        var _this = _super.call(this) || this;
        /// The local anchor point relative to body1's origin.
        _this.localAnchor1 = new b2Vec2();
        /// The local anchor point relative to body2's origin.
        _this.localAnchor2 = new b2Vec2();
        /// The local translation axis in body1.
        _this.localAxis1 = new b2Vec2();
        _this.type = b2Joint.e_prismaticJoint;
        //localAnchor1.SetZero();
        //localAnchor2.SetZero();
        _this.localAxis1.Set(1.0, 0.0);
        _this.referenceAngle = 0.0;
        _this.enableLimit = false;
        _this.lowerTranslation = 0.0;
        _this.upperTranslation = 0.0;
        _this.enableMotor = false;
        _this.maxMotorForce = 0.0;
        _this.motorSpeed = 0.0;
        return _this;
    }
    b2PrismaticJointDef.prototype.Initialize = function (b1, b2, anchor, axis) {
        this.body1 = b1;
        this.body2 = b2;
        this.localAnchor1 = this.body1.GetLocalPoint(anchor);
        this.localAnchor2 = this.body2.GetLocalPoint(anchor);
        this.localAxis1 = this.body1.GetLocalVector(axis);
        this.referenceAngle = this.body2.GetAngle() - this.body1.GetAngle();
    };
    return b2PrismaticJointDef;
}(b2JointDef));
export { b2PrismaticJointDef };
