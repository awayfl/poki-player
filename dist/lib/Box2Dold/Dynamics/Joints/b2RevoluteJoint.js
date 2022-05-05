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
import { b2Joint, } from './b2Joint';
import { b2Vec2, b2Mat22, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
/// A revolute joint constrains to bodies to share a common point while they
/// are free to rotate about the point. The relative rotation about the shared
/// point is the joint angle. You can limit the relative rotation with
/// a joint limit that specifies a lower and upper angle. You can use a motor
/// to drive the relative rotation about the shared point. A maximum motor torque
/// is provided so that infinite forces are not generated.
// Point-to-point constraint
// C = p2 - p1
// Cdot = v2 - v1
//      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
// J = [-I -r1_skew I r2_skew ]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)
// Motor constraint
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
// K = invI1 + invI2
var b2RevoluteJoint = /** @class */ (function (_super) {
    __extends(b2RevoluteJoint, _super);
    //--------------- Internals Below -------------------
    function b2RevoluteJoint(def) {
        var _this = _super.call(this, def) || this;
        // internal vars
        _this.K = new b2Mat22();
        _this.K1 = new b2Mat22();
        _this.K2 = new b2Mat22();
        _this.K3 = new b2Mat22();
        _this.m_localAnchor1 = new b2Vec2(); // relative
        _this.m_localAnchor2 = new b2Vec2();
        _this.m_pivotForce = new b2Vec2();
        _this.m_pivotMass = new b2Mat22(); // effective mass for point-to-point constraint.
        //this.m_localAnchor1 = def->localAnchor1;
        _this.m_localAnchor1.SetV(def.localAnchor1);
        //this.m_localAnchor2 = def->localAnchor2;
        _this.m_localAnchor2.SetV(def.localAnchor2);
        _this.m_referenceAngle = def.referenceAngle;
        _this.m_pivotForce.Set(0.0, 0.0);
        _this.m_motorForce = 0.0;
        _this.m_limitForce = 0.0;
        _this.m_limitPositionImpulse = 0.0;
        _this.m_lowerAngle = def.lowerAngle;
        _this.m_upperAngle = def.upperAngle;
        _this.m_maxMotorTorque = def.maxMotorTorque;
        _this.m_motorSpeed = def.motorSpeed;
        _this.m_enableLimit = def.enableLimit;
        _this.m_enableMotor = def.enableMotor;
        return _this;
    }
    b2RevoluteJoint.prototype.GetAnchor1 = function () {
        return this.m_body1.GetWorldPoint(this.m_localAnchor1);
    };
    b2RevoluteJoint.prototype.GetAnchor2 = function () {
        return this.m_body2.GetWorldPoint(this.m_localAnchor2);
    };
    b2RevoluteJoint.prototype.GetReactionForce = function () {
        return this.m_pivotForce;
    };
    b2RevoluteJoint.prototype.GetReactionTorque = function () {
        return this.m_limitForce;
    };
    /// Get the current joint angle in radians.
    b2RevoluteJoint.prototype.GetJointAngle = function () {
        //b2Body* b1 = this.m_body1;
        //b2Body* b2 = this.m_body2;
        return this.m_body2.m_sweep.a - this.m_body1.m_sweep.a - this.m_referenceAngle;
    };
    /// Get the current joint angle speed in radians per second.
    b2RevoluteJoint.prototype.GetJointSpeed = function () {
        //b2Body* b1 = this.m_body1;
        //b2Body* b2 = this.m_body2;
        return this.m_body2.m_angularVelocity - this.m_body1.m_angularVelocity;
    };
    /// Is the joint limit enabled?
    b2RevoluteJoint.prototype.IsLimitEnabled = function () {
        return this.m_enableLimit;
    };
    /// Enable/disable the joint limit.
    b2RevoluteJoint.prototype.EnableLimit = function (flag) {
        this.m_enableLimit = flag;
    };
    /// Get the lower joint limit in radians.
    b2RevoluteJoint.prototype.GetLowerLimit = function () {
        return this.m_lowerAngle;
    };
    /// Get the upper joint limit in radians.
    b2RevoluteJoint.prototype.GetUpperLimit = function () {
        return this.m_upperAngle;
    };
    /// Set the joint limits in radians.
    b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
        //b2Settings.b2Assert(lower <= upper);
        this.m_lowerAngle = lower;
        this.m_upperAngle = upper;
    };
    /// Is the joint motor enabled?
    b2RevoluteJoint.prototype.IsMotorEnabled = function () {
        return this.m_enableMotor;
    };
    /// Enable/disable the joint motor.
    b2RevoluteJoint.prototype.EnableMotor = function (flag) {
        this.m_enableMotor = flag;
    };
    /// Set the motor speed in radians per second.
    b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
        this.m_motorSpeed = speed;
    };
    /// Get the motor speed in radians per second.
    b2RevoluteJoint.prototype.GetMotorSpeed = function () {
        return this.m_motorSpeed;
    };
    /// Set the maximum motor torque, usually in N-m.
    b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
        this.m_maxMotorTorque = torque;
    };
    /// Get the current motor torque, usually in N-m.
    b2RevoluteJoint.prototype.GetMotorTorque = function () {
        return this.m_motorForce;
    };
    b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        var tX;
        // Compute the effective mass matrix.
        //b2Vec2 r1 = b2Mul(b1->this.m_xf.R, this.m_localAnchor1 - b1->GetLocalCenter());
        tMat = b1.m_xf.R;
        var r1X = this.m_localAnchor1.x - b1.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - b1.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(b2->this.m_xf.R, this.m_localAnchor2 - b2->GetLocalCenter());
        tMat = b2.m_xf.R;
        var r2X = this.m_localAnchor2.x - b2.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - b2.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
        //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
        //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        //var K1:b2Mat22 = new b2Mat22();
        this.K1.col1.x = invMass1 + invMass2;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass1 + invMass2;
        //var K2:b2Mat22 = new b2Mat22();
        this.K2.col1.x = invI1 * r1Y * r1Y;
        this.K2.col2.x = -invI1 * r1X * r1Y;
        this.K2.col1.y = -invI1 * r1X * r1Y;
        this.K2.col2.y = invI1 * r1X * r1X;
        //var K3:b2Mat22 = new b2Mat22();
        this.K3.col1.x = invI2 * r2Y * r2Y;
        this.K3.col2.x = -invI2 * r2X * r2Y;
        this.K3.col1.y = -invI2 * r2X * r2Y;
        this.K3.col2.y = invI2 * r2X * r2X;
        //var K:b2Mat22 = b2Math.AddMM(b2Math.AddMM(K1, K2), K3);
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        //this.m_pivotMass = K.Invert();
        this.K.Invert(this.m_pivotMass);
        this.m_motorMass = 1.0 / (invI1 + invI2);
        if (this.m_enableMotor == false) {
            this.m_motorForce = 0.0;
        }
        if (this.m_enableLimit) {
            //float32 jointAngle = b2->this.m_sweep.a - b1->this.m_sweep.a - this.m_referenceAngle;
            var jointAngle = b2.m_sweep.a - b1.m_sweep.a - this.m_referenceAngle;
            if (b2Math.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
                this.m_limitState = b2RevoluteJoint.e_equalLimits;
            }
            else if (jointAngle <= this.m_lowerAngle) {
                if (this.m_limitState != b2RevoluteJoint.e_atLowerLimit) {
                    this.m_limitForce = 0.0;
                }
                this.m_limitState = b2RevoluteJoint.e_atLowerLimit;
            }
            else if (jointAngle >= this.m_upperAngle) {
                if (this.m_limitState != b2RevoluteJoint.e_atUpperLimit) {
                    this.m_limitForce = 0.0;
                }
                this.m_limitState = b2RevoluteJoint.e_atUpperLimit;
            }
            else {
                this.m_limitState = b2RevoluteJoint.e_inactiveLimit;
                this.m_limitForce = 0.0;
            }
        }
        else {
            this.m_limitForce = 0.0;
        }
        // Warm starting.
        if (step.warmStarting) {
            //b1->this.m_linearVelocity -= step.dt * invMass1 * this.m_pivotForce;
            b1.m_linearVelocity.x -= step.dt * invMass1 * this.m_pivotForce.x;
            b1.m_linearVelocity.y -= step.dt * invMass1 * this.m_pivotForce.y;
            //b1->this.m_angularVelocity -= step.dt * invI1 * (b2Cross(r1, this.m_pivotForce) + this.m_motorForce + this.m_limitForce);
            b1.m_angularVelocity -= step.dt * invI1 * ((r1X * this.m_pivotForce.y - r1Y * this.m_pivotForce.x) + this.m_motorForce + this.m_limitForce);
            //b2->this.m_linearVelocity += step.dt * invMass2 * this.m_pivotForce;
            b2.m_linearVelocity.x += step.dt * invMass2 * this.m_pivotForce.x;
            b2.m_linearVelocity.y += step.dt * invMass2 * this.m_pivotForce.y;
            //b2->this.m_angularVelocity += step.dt * invI2 * (b2Cross(r2, this.m_pivotForce) + this.m_motorForce + this.m_limitForce);
            b2.m_angularVelocity += step.dt * invI2 * ((r2X * this.m_pivotForce.y - r2Y * this.m_pivotForce.x) + this.m_motorForce + this.m_limitForce);
        }
        else {
            this.m_pivotForce.SetZero();
            this.m_motorForce = 0.0;
            this.m_limitForce = 0.0;
        }
        this.m_limitPositionImpulse = 0.0;
    };
    b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        var tX;
        //b2Vec2 r1 = b2Mul(b1->this.m_xf.R, this.m_localAnchor1 - b1->GetLocalCenter());
        tMat = b1.m_xf.R;
        var r1X = this.m_localAnchor1.x - b1.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - b1.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(b2->this.m_xf.R, this.m_localAnchor2 - b2->GetLocalCenter());
        tMat = b2.m_xf.R;
        var r2X = this.m_localAnchor2.x - b2.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - b2.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        var oldLimitForce;
        // Solve point-to-point constraint
        //b2Vec2 pivotCdot = b2.m_linearVelocity + b2Cross(b2.m_angularVelocity, r2) - b1.m_linearVelocity - b2Cross(b1.m_angularVelocity, r1);
        var pivotCdotX = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y) - b1.m_linearVelocity.x - (-b1.m_angularVelocity * r1Y);
        var pivotCdotY = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X) - b1.m_linearVelocity.y - (b1.m_angularVelocity * r1X);
        //b2Vec2 pivotForce = -step.inv_dt * b2Mul(this.m_pivotMass, pivotCdot);
        var pivotForceX = -step.inv_dt * (this.m_pivotMass.col1.x * pivotCdotX + this.m_pivotMass.col2.x * pivotCdotY);
        var pivotForceY = -step.inv_dt * (this.m_pivotMass.col1.y * pivotCdotX + this.m_pivotMass.col2.y * pivotCdotY);
        this.m_pivotForce.x += pivotForceX;
        this.m_pivotForce.y += pivotForceY;
        //b2Vec2 P = step.dt * pivotForce;
        var PX = step.dt * pivotForceX;
        var PY = step.dt * pivotForceY;
        //b1->this.m_linearVelocity -= b1->this.m_invMass * P;
        b1.m_linearVelocity.x -= b1.m_invMass * PX;
        b1.m_linearVelocity.y -= b1.m_invMass * PY;
        //b1->this.m_angularVelocity -= b1->this.m_invI * b2Cross(r1, P);
        b1.m_angularVelocity -= b1.m_invI * (r1X * PY - r1Y * PX);
        //b2->this.m_linearVelocity += b2->this.m_invMass * P;
        b2.m_linearVelocity.x += b2.m_invMass * PX;
        b2.m_linearVelocity.y += b2.m_invMass * PY;
        //b2->this.m_angularVelocity += b2->this.m_invI * b2Cross(r2, P);
        b2.m_angularVelocity += b2.m_invI * (r2X * PY - r2Y * PX);
        if (this.m_enableMotor && this.m_limitState != b2RevoluteJoint.e_equalLimits) {
            var motorCdot = b2.m_angularVelocity - b1.m_angularVelocity - this.m_motorSpeed;
            var motorForce = -step.inv_dt * this.m_motorMass * motorCdot;
            var oldMotorForce = this.m_motorForce;
            this.m_motorForce = b2Math.b2Clamp(this.m_motorForce + motorForce, -this.m_maxMotorTorque, this.m_maxMotorTorque);
            motorForce = this.m_motorForce - oldMotorForce;
            b1.m_angularVelocity -= b1.m_invI * step.dt * motorForce;
            b2.m_angularVelocity += b2.m_invI * step.dt * motorForce;
        }
        if (this.m_enableLimit && this.m_limitState != b2RevoluteJoint.e_inactiveLimit) {
            var limitCdot = b2.m_angularVelocity - b1.m_angularVelocity;
            var limitForce = -step.inv_dt * this.m_motorMass * limitCdot;
            if (this.m_limitState == b2RevoluteJoint.e_equalLimits) {
                this.m_limitForce += limitForce;
            }
            else if (this.m_limitState == b2RevoluteJoint.e_atLowerLimit) {
                oldLimitForce = this.m_limitForce;
                this.m_limitForce = b2Math.b2Max(this.m_limitForce + limitForce, 0.0);
                limitForce = this.m_limitForce - oldLimitForce;
            }
            else if (this.m_limitState == b2RevoluteJoint.e_atUpperLimit) {
                oldLimitForce = this.m_limitForce;
                this.m_limitForce = b2Math.b2Min(this.m_limitForce + limitForce, 0.0);
                limitForce = this.m_limitForce - oldLimitForce;
            }
            b1.m_angularVelocity -= b1.m_invI * step.dt * limitForce;
            b2.m_angularVelocity += b2.m_invI * step.dt * limitForce;
        }
    };
    b2RevoluteJoint.prototype.SolvePositionConstraints = function () {
        var oldLimitImpulse;
        var limitC;
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var positionError = 0.0;
        var tMat;
        // Solve point-to-point position error.
        //b2Vec2 r1 = b2Mul(b1->this.m_xf.R, this.m_localAnchor1 - b1->GetLocalCenter());
        tMat = b1.m_xf.R;
        var r1X = this.m_localAnchor1.x - b1.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - b1.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(b2->this.m_xf.R, this.m_localAnchor2 - b2->GetLocalCenter());
        tMat = b2.m_xf.R;
        var r2X = this.m_localAnchor2.x - b2.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - b2.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        //b2Vec2 p1 = b1->this.m_sweep.c + r1;
        var p1X = b1.m_sweep.c.x + r1X;
        var p1Y = b1.m_sweep.c.y + r1Y;
        //b2Vec2 p2 = b2->this.m_sweep.c + r2;
        var p2X = b2.m_sweep.c.x + r2X;
        var p2Y = b2.m_sweep.c.y + r2Y;
        //b2Vec2 ptpC = p2 - p1;
        var ptpCX = p2X - p1X;
        var ptpCY = p2Y - p1Y;
        //float32 positionError = ptpC.Length();
        positionError = Math.sqrt(ptpCX * ptpCX + ptpCY * ptpCY);
        // Prevent overly large corrections.
        //b2Vec2 dpMax(b2_maxLinearCorrection, b2_maxLinearCorrection);
        //ptpC = b2Clamp(ptpC, -dpMax, dpMax);
        //float32 invMass1 = b1->this.m_invMass, invMass2 = b2->this.m_invMass;
        var invMass1 = b1.m_invMass;
        var invMass2 = b2.m_invMass;
        //float32 invI1 = b1->this.m_invI, invI2 = b2->this.m_invI;
        var invI1 = b1.m_invI;
        var invI2 = b2.m_invI;
        //b2Mat22 K1;
        this.K1.col1.x = invMass1 + invMass2;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass1 + invMass2;
        //b2Mat22 K2;
        this.K2.col1.x = invI1 * r1Y * r1Y;
        this.K2.col2.x = -invI1 * r1X * r1Y;
        this.K2.col1.y = -invI1 * r1X * r1Y;
        this.K2.col2.y = invI1 * r1X * r1X;
        //b2Mat22 K3;
        this.K3.col1.x = invI2 * r2Y * r2Y;
        this.K3.col2.x = -invI2 * r2X * r2Y;
        this.K3.col1.y = -invI2 * r2X * r2Y;
        this.K3.col2.y = invI2 * r2X * r2X;
        //b2Mat22 K = K1 + K2 + K3;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.AddM(this.K3);
        //b2Vec2 impulse = K.Solve(-ptpC);
        this.K.Solve(b2RevoluteJoint.tImpulse, -ptpCX, -ptpCY);
        var impulseX = b2RevoluteJoint.tImpulse.x;
        var impulseY = b2RevoluteJoint.tImpulse.y;
        //b1.m_sweep.c -= b1.m_invMass * impulse;
        b1.m_sweep.c.x -= b1.m_invMass * impulseX;
        b1.m_sweep.c.y -= b1.m_invMass * impulseY;
        //b1.m_sweep.a -= b1.m_invI * b2Cross(r1, impulse);
        b1.m_sweep.a -= b1.m_invI * (r1X * impulseY - r1Y * impulseX);
        //b2.m_sweep.c += b2.m_invMass * impulse;
        b2.m_sweep.c.x += b2.m_invMass * impulseX;
        b2.m_sweep.c.y += b2.m_invMass * impulseY;
        //b2.m_sweep.a += b2.m_invI * b2Cross(r2, impulse);
        b2.m_sweep.a += b2.m_invI * (r2X * impulseY - r2Y * impulseX);
        b1.SynchronizeTransform();
        b2.SynchronizeTransform();
        // Handle limits.
        var angularError = 0.0;
        if (this.m_enableLimit && this.m_limitState != b2RevoluteJoint.e_inactiveLimit) {
            var angle = b2.m_sweep.a - b1.m_sweep.a - this.m_referenceAngle;
            var limitImpulse = 0.0;
            if (this.m_limitState == b2RevoluteJoint.e_equalLimits) {
                // Prevent large angular corrections
                limitC = b2Math.b2Clamp(angle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                angularError = b2Math.b2Abs(limitC);
            }
            else if (this.m_limitState == b2RevoluteJoint.e_atLowerLimit) {
                limitC = angle - this.m_lowerAngle;
                angularError = b2Math.b2Max(0.0, -limitC);
                // Prevent large angular corrections and allow some slop.
                limitC = b2Math.b2Clamp(limitC + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0.0);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Max(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            }
            else if (this.m_limitState == b2RevoluteJoint.e_atUpperLimit) {
                limitC = angle - this.m_upperAngle;
                angularError = b2Math.b2Max(0.0, limitC);
                // Prevent large angular corrections and allow some slop.
                limitC = b2Math.b2Clamp(limitC - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * limitC;
                oldLimitImpulse = this.m_limitPositionImpulse;
                this.m_limitPositionImpulse = b2Math.b2Min(this.m_limitPositionImpulse + limitImpulse, 0.0);
                limitImpulse = this.m_limitPositionImpulse - oldLimitImpulse;
            }
            b1.m_sweep.a -= b1.m_invI * limitImpulse;
            b2.m_sweep.a += b2.m_invI * limitImpulse;
            b1.SynchronizeTransform();
            b2.SynchronizeTransform();
        }
        return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    };
    b2RevoluteJoint.tImpulse = new b2Vec2();
    return b2RevoluteJoint;
}(b2Joint));
export { b2RevoluteJoint };
