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
import { b2Joint } from '../Joints';
import { b2Vec2, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
/// The pulley joint is connected to two bodies and two fixed ground points.
/// The pulley supports a ratio such that:
/// length1 + ratio * length2 <= constant
/// Yes, the force transmitted is scaled by the ratio.
/// The pulley also enforces a maximum length limit on both sides. This is
/// useful to prevent one side of the pulley hitting the top.
var b2PulleyJoint = /** @class */ (function (_super) {
    __extends(b2PulleyJoint, _super);
    //--------------- Internals Below -------------------
    function b2PulleyJoint(def) {
        var _this = 
        // parent
        _super.call(this, def) || this;
        _this.m_groundAnchor1 = new b2Vec2();
        _this.m_groundAnchor2 = new b2Vec2();
        _this.m_localAnchor1 = new b2Vec2();
        _this.m_localAnchor2 = new b2Vec2();
        _this.m_u1 = new b2Vec2();
        _this.m_u2 = new b2Vec2();
        var tMat;
        var tX;
        var tY;
        _this.m_ground = _this.m_body1.m_world.m_groundBody;
        //this.m_groundAnchor1 = def->groundAnchor1 - this.m_ground->this.m_xf.position;
        _this.m_groundAnchor1.x = def.groundAnchor1.x - _this.m_ground.m_xf.position.x;
        _this.m_groundAnchor1.y = def.groundAnchor1.y - _this.m_ground.m_xf.position.y;
        //this.m_groundAnchor2 = def->groundAnchor2 - this.m_ground->this.m_xf.position;
        _this.m_groundAnchor2.x = def.groundAnchor2.x - _this.m_ground.m_xf.position.x;
        _this.m_groundAnchor2.y = def.groundAnchor2.y - _this.m_ground.m_xf.position.y;
        //this.m_localAnchor1 = def->localAnchor1;
        _this.m_localAnchor1.SetV(def.localAnchor1);
        //this.m_localAnchor2 = def->localAnchor2;
        _this.m_localAnchor2.SetV(def.localAnchor2);
        //b2Settings.b2Assert(def.ratio != 0.0);
        _this.m_ratio = def.ratio;
        _this.m_constant = def.length1 + _this.m_ratio * def.length2;
        _this.m_maxLength1 = b2Math.b2Min(def.maxLength1, _this.m_constant - _this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
        _this.m_maxLength2 = b2Math.b2Min(def.maxLength2, (_this.m_constant - b2PulleyJoint.b2_minPulleyLength) / _this.m_ratio);
        _this.m_force = 0.0;
        _this.m_limitForce1 = 0.0;
        _this.m_limitForce2 = 0.0;
        return _this;
    }
    b2PulleyJoint.prototype.GetAnchor1 = function () {
        return this.m_body1.GetWorldPoint(this.m_localAnchor1);
    };
    b2PulleyJoint.prototype.GetAnchor2 = function () {
        return this.m_body2.GetWorldPoint(this.m_localAnchor2);
    };
    b2PulleyJoint.prototype.GetReactionForce = function () {
        //b2Vec2 F = this.m_force * this.m_u2;
        var F = this.m_u2.Copy();
        F.Multiply(this.m_force);
        return F;
    };
    b2PulleyJoint.prototype.GetReactionTorque = function () {
        return 0.0;
    };
    b2PulleyJoint.prototype.GetGroundAnchor1 = function () {
        //return this.m_ground.m_xf.position + this.m_groundAnchor1;
        var a = this.m_ground.m_xf.position.Copy();
        a.Add(this.m_groundAnchor1);
        return a;
    };
    b2PulleyJoint.prototype.GetGroundAnchor2 = function () {
        //return this.m_ground.m_xf.position + this.m_groundAnchor2;
        var a = this.m_ground.m_xf.position.Copy();
        a.Add(this.m_groundAnchor2);
        return a;
    };
    b2PulleyJoint.prototype.GetLength1 = function () {
        var p = this.m_body1.GetWorldPoint(this.m_localAnchor1);
        //b2Vec2 s = this.m_ground->this.m_xf.position + this.m_groundAnchor1;
        var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        //b2Vec2 d = p - s;
        var dX = p.x - sX;
        var dY = p.y - sY;
        //return d.Length();
        return Math.sqrt(dX * dX + dY * dY);
    };
    b2PulleyJoint.prototype.GetLength2 = function () {
        var p = this.m_body2.GetWorldPoint(this.m_localAnchor2);
        //b2Vec2 s = this.m_ground->this.m_xf.position + this.m_groundAnchor2;
        var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        //b2Vec2 d = p - s;
        var dX = p.x - sX;
        var dY = p.y - sY;
        //return d.Length();
        return Math.sqrt(dX * dX + dY * dY);
    };
    b2PulleyJoint.prototype.GetRatio = function () {
        return this.m_ratio;
    };
    b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
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
        //b2Vec2 s1 = this.m_ground->this.m_xf.position + this.m_groundAnchor1;
        var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        //b2Vec2 s2 = this.m_ground->this.m_xf.position + this.m_groundAnchor2;
        var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        // Get the pulley axes.
        //this.m_u1 = p1 - s1;
        this.m_u1.Set(p1X - s1X, p1Y - s1Y);
        //this.m_u2 = p2 - s2;
        this.m_u2.Set(p2X - s2X, p2Y - s2Y);
        var length1 = this.m_u1.Length();
        var length2 = this.m_u2.Length();
        if (length1 > b2Settings.b2_linearSlop) {
            //this.m_u1 *= 1.0f / length1;
            this.m_u1.Multiply(1.0 / length1);
        }
        else {
            this.m_u1.SetZero();
        }
        if (length2 > b2Settings.b2_linearSlop) {
            //this.m_u2 *= 1.0f / length2;
            this.m_u2.Multiply(1.0 / length2);
        }
        else {
            this.m_u2.SetZero();
        }
        var C = this.m_constant - length1 - this.m_ratio * length2;
        if (C > 0.0) {
            this.m_state = b2PulleyJoint.e_inactiveLimit;
            this.m_force = 0.0;
        }
        else {
            this.m_state = b2PulleyJoint.e_atUpperLimit;
            this.m_positionImpulse = 0.0;
        }
        if (length1 < this.m_maxLength1) {
            this.m_limitState1 = b2PulleyJoint.e_inactiveLimit;
            this.m_limitForce1 = 0.0;
        }
        else {
            this.m_limitState1 = b2PulleyJoint.e_atUpperLimit;
            this.m_limitPositionImpulse1 = 0.0;
        }
        if (length2 < this.m_maxLength2) {
            this.m_limitState2 = b2PulleyJoint.e_inactiveLimit;
            this.m_limitForce2 = 0.0;
        }
        else {
            this.m_limitState2 = b2PulleyJoint.e_atUpperLimit;
            this.m_limitPositionImpulse2 = 0.0;
        }
        // Compute effective mass.
        //var cr1u1:number = b2Cross(r1, this.m_u1);
        var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
        //var cr2u2:number = b2Cross(r2, this.m_u2);
        var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
        this.m_limitMass1 = b1.m_invMass + b1.m_invI * cr1u1 * cr1u1;
        this.m_limitMass2 = b2.m_invMass + b2.m_invI * cr2u2 * cr2u2;
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        //b2Settings.b2Assert(this.m_limitMass1 > Number.MIN_VALUE);
        //b2Settings.b2Assert(this.m_limitMass2 > Number.MIN_VALUE);
        //b2Settings.b2Assert(this.m_pulleyMass > Number.MIN_VALUE);
        this.m_limitMass1 = 1.0 / this.m_limitMass1;
        this.m_limitMass2 = 1.0 / this.m_limitMass2;
        this.m_pulleyMass = 1.0 / this.m_pulleyMass;
        if (step.warmStarting) {
            // Warm starting.
            //b2Vec2 P1 = step.dt * (-this.m_force - this.m_limitForce1) * this.m_u1;
            //b2Vec2 P1 = step.dt * (-this.m_force - this.m_limitForce1) * this.m_u1;
            var P1X = step.dt * (-this.m_force - this.m_limitForce1) * this.m_u1.x;
            var P1Y = step.dt * (-this.m_force - this.m_limitForce1) * this.m_u1.y;
            //b2Vec2 P2 = step.dt * (-this.m_ratio * this.m_force - this.m_limitForce2) * this.m_u2;
            //b2Vec2 P2 = step.dt * (-this.m_ratio * this.m_force - this.m_limitForce2) * this.m_u2;
            var P2X = step.dt * (-this.m_ratio * this.m_force - this.m_limitForce2) * this.m_u2.x;
            var P2Y = step.dt * (-this.m_ratio * this.m_force - this.m_limitForce2) * this.m_u2.y;
            //b1.m_linearVelocity += b1.m_invMass * P1;
            b1.m_linearVelocity.x += b1.m_invMass * P1X;
            b1.m_linearVelocity.y += b1.m_invMass * P1Y;
            //b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1);
            b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
            //b2.m_linearVelocity += b2.m_invMass * P2;
            b2.m_linearVelocity.x += b2.m_invMass * P2X;
            b2.m_linearVelocity.y += b2.m_invMass * P2Y;
            //b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2);
            b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
        }
        else {
            this.m_force = 0.0;
            this.m_limitForce1 = 0.0;
            this.m_limitForce2 = 0.0;
        }
    };
    b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
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
        // temp vars
        var v1X;
        var v1Y;
        var v2X;
        var v2Y;
        var P1X;
        var P1Y;
        var P2X;
        var P2Y;
        var Cdot;
        var force;
        var oldForce;
        if (this.m_state == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 v1 = b1->this.m_linearVelocity + b2Cross(b1->this.m_angularVelocity, r1);
            v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
            v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);
            //b2Vec2 v2 = b2->this.m_linearVelocity + b2Cross(b2->this.m_angularVelocity, r2);
            v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
            v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);
            //Cdot = -b2Dot(this.m_u1, v1) - this.m_ratio * b2Dot(this.m_u2, v2);
            Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
            force = -step.inv_dt * this.m_pulleyMass * Cdot;
            oldForce = this.m_force;
            this.m_force = b2Math.b2Max(0.0, this.m_force + force);
            force = this.m_force - oldForce;
            //b2Vec2 P1 = -step.dt * force * this.m_u1;
            P1X = -step.dt * force * this.m_u1.x;
            P1Y = -step.dt * force * this.m_u1.y;
            //b2Vec2 P2 = -step.dt * this.m_ratio * force * this.m_u2;
            P2X = -step.dt * this.m_ratio * force * this.m_u2.x;
            P2Y = -step.dt * this.m_ratio * force * this.m_u2.y;
            //b1.m_linearVelocity += b1.m_invMass * P1;
            b1.m_linearVelocity.x += b1.m_invMass * P1X;
            b1.m_linearVelocity.y += b1.m_invMass * P1Y;
            //b1.m_angularVelocity += b1.m_invI * b2Cross(r1, P1);
            b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
            //b2.m_linearVelocity += b2.m_invMass * P2;
            b2.m_linearVelocity.x += b2.m_invMass * P2X;
            b2.m_linearVelocity.y += b2.m_invMass * P2Y;
            //b2.m_angularVelocity += b2.m_invI * b2Cross(r2, P2);
            b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
        }
        if (this.m_limitState1 == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 v1 = b1->this.m_linearVelocity + b2Cross(b1->this.m_angularVelocity, r1);
            v1X = b1.m_linearVelocity.x + (-b1.m_angularVelocity * r1Y);
            v1Y = b1.m_linearVelocity.y + (b1.m_angularVelocity * r1X);
            //float32 Cdot = -b2Dot(this.m_u1, v1);
            Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y);
            force = -step.inv_dt * this.m_limitMass1 * Cdot;
            oldForce = this.m_limitForce1;
            this.m_limitForce1 = b2Math.b2Max(0.0, this.m_limitForce1 + force);
            force = this.m_limitForce1 - oldForce;
            //b2Vec2 P1 = -step.dt * force * this.m_u1;
            P1X = -step.dt * force * this.m_u1.x;
            P1Y = -step.dt * force * this.m_u1.y;
            //b1.m_linearVelocity += b1->this.m_invMass * P1;
            b1.m_linearVelocity.x += b1.m_invMass * P1X;
            b1.m_linearVelocity.y += b1.m_invMass * P1Y;
            //b1.m_angularVelocity += b1->this.m_invI * b2Cross(r1, P1);
            b1.m_angularVelocity += b1.m_invI * (r1X * P1Y - r1Y * P1X);
        }
        if (this.m_limitState2 == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 v2 = b2->this.m_linearVelocity + b2Cross(b2->this.m_angularVelocity, r2);
            v2X = b2.m_linearVelocity.x + (-b2.m_angularVelocity * r2Y);
            v2Y = b2.m_linearVelocity.y + (b2.m_angularVelocity * r2X);
            //float32 Cdot = -b2Dot(this.m_u2, v2);
            Cdot = -(this.m_u2.x * v2X + this.m_u2.y * v2Y);
            force = -step.inv_dt * this.m_limitMass2 * Cdot;
            oldForce = this.m_limitForce2;
            this.m_limitForce2 = b2Math.b2Max(0.0, this.m_limitForce2 + force);
            force = this.m_limitForce2 - oldForce;
            //b2Vec2 P2 = -step.dt * force * this.m_u2;
            P2X = -step.dt * force * this.m_u2.x;
            P2Y = -step.dt * force * this.m_u2.y;
            //b2->this.m_linearVelocity += b2->this.m_invMass * P2;
            b2.m_linearVelocity.x += b2.m_invMass * P2X;
            b2.m_linearVelocity.y += b2.m_invMass * P2Y;
            //b2->this.m_angularVelocity += b2->this.m_invI * b2Cross(r2, P2);
            b2.m_angularVelocity += b2.m_invI * (r2X * P2Y - r2Y * P2X);
        }
    };
    b2PulleyJoint.prototype.SolvePositionConstraints = function () {
        var b1 = this.m_body1;
        var b2 = this.m_body2;
        var tMat;
        //b2Vec2 s1 = this.m_ground->this.m_xf.position + this.m_groundAnchor1;
        var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        //b2Vec2 s2 = this.m_ground->this.m_xf.position + this.m_groundAnchor2;
        var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        // temp vars
        var r1X;
        var r1Y;
        var r2X;
        var r2Y;
        var p1X;
        var p1Y;
        var p2X;
        var p2Y;
        var length1;
        var length2;
        var C;
        var impulse;
        var oldImpulse;
        var oldLimitPositionImpulse;
        var tX;
        var linearError = 0.0;
        if (this.m_state == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 r1 = b2Mul(b1->this.m_xf.R, this.m_localAnchor1 - b1->GetLocalCenter());
            tMat = b1.m_xf.R;
            r1X = this.m_localAnchor1.x - b1.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - b1.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 r2 = b2Mul(b2->this.m_xf.R, this.m_localAnchor2 - b2->GetLocalCenter());
            tMat = b2.m_xf.R;
            r2X = this.m_localAnchor2.x - b2.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - b2.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            //b2Vec2 p1 = b1->this.m_sweep.c + r1;
            p1X = b1.m_sweep.c.x + r1X;
            p1Y = b1.m_sweep.c.y + r1Y;
            //b2Vec2 p2 = b2->this.m_sweep.c + r2;
            p2X = b2.m_sweep.c.x + r2X;
            p2Y = b2.m_sweep.c.y + r2Y;
            // Get the pulley axes.
            //this.m_u1 = p1 - s1;
            this.m_u1.Set(p1X - s1X, p1Y - s1Y);
            //this.m_u2 = p2 - s2;
            this.m_u2.Set(p2X - s2X, p2Y - s2Y);
            length1 = this.m_u1.Length();
            length2 = this.m_u2.Length();
            if (length1 > b2Settings.b2_linearSlop) {
                //this.m_u1 *= 1.0f / length1;
                this.m_u1.Multiply(1.0 / length1);
            }
            else {
                this.m_u1.SetZero();
            }
            if (length2 > b2Settings.b2_linearSlop) {
                //this.m_u2 *= 1.0f / length2;
                this.m_u2.Multiply(1.0 / length2);
            }
            else {
                this.m_u2.SetZero();
            }
            C = this.m_constant - length1 - this.m_ratio * length2;
            linearError = b2Math.b2Max(linearError, -C);
            C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_pulleyMass * C;
            oldImpulse = this.m_positionImpulse;
            this.m_positionImpulse = b2Math.b2Max(0.0, this.m_positionImpulse + impulse);
            impulse = this.m_positionImpulse - oldImpulse;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            p2X = -this.m_ratio * impulse * this.m_u2.x;
            p2Y = -this.m_ratio * impulse * this.m_u2.y;
            b1.m_sweep.c.x += b1.m_invMass * p1X;
            b1.m_sweep.c.y += b1.m_invMass * p1Y;
            b1.m_sweep.a += b1.m_invI * (r1X * p1Y - r1Y * p1X);
            b2.m_sweep.c.x += b2.m_invMass * p2X;
            b2.m_sweep.c.y += b2.m_invMass * p2Y;
            b2.m_sweep.a += b2.m_invI * (r2X * p2Y - r2Y * p2X);
            b1.SynchronizeTransform();
            b2.SynchronizeTransform();
        }
        if (this.m_limitState1 == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 r1 = b2Mul(b1->this.m_xf.R, this.m_localAnchor1 - b1->GetLocalCenter());
            tMat = b1.m_xf.R;
            r1X = this.m_localAnchor1.x - b1.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - b1.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 p1 = b1->this.m_sweep.c + r1;
            p1X = b1.m_sweep.c.x + r1X;
            p1Y = b1.m_sweep.c.y + r1Y;
            //this.m_u1 = p1 - s1;
            this.m_u1.Set(p1X - s1X, p1Y - s1Y);
            length1 = this.m_u1.Length();
            if (length1 > b2Settings.b2_linearSlop) {
                //this.m_u1 *= 1.0 / length1;
                this.m_u1.x *= 1.0 / length1;
                this.m_u1.y *= 1.0 / length1;
            }
            else {
                this.m_u1.SetZero();
            }
            C = this.m_maxLength1 - length1;
            linearError = b2Math.b2Max(linearError, -C);
            C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass1 * C;
            oldLimitPositionImpulse = this.m_limitPositionImpulse1;
            this.m_limitPositionImpulse1 = b2Math.b2Max(0.0, this.m_limitPositionImpulse1 + impulse);
            impulse = this.m_limitPositionImpulse1 - oldLimitPositionImpulse;
            //P1 = -impulse * this.m_u1;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            b1.m_sweep.c.x += b1.m_invMass * p1X;
            b1.m_sweep.c.y += b1.m_invMass * p1Y;
            //b1.m_rotation += b1.m_invI * b2Cross(r1, P1);
            b1.m_sweep.a += b1.m_invI * (r1X * p1Y - r1Y * p1X);
            b1.SynchronizeTransform();
        }
        if (this.m_limitState2 == b2PulleyJoint.e_atUpperLimit) {
            //b2Vec2 r2 = b2Mul(b2->this.m_xf.R, this.m_localAnchor2 - b2->GetLocalCenter());
            tMat = b2.m_xf.R;
            r2X = this.m_localAnchor2.x - b2.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - b2.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            //b2Vec2 p2 = b2->this.m_position + r2;
            p2X = b2.m_sweep.c.x + r2X;
            p2Y = b2.m_sweep.c.y + r2Y;
            //this.m_u2 = p2 - s2;
            this.m_u2.Set(p2X - s2X, p2Y - s2Y);
            length2 = this.m_u2.Length();
            if (length2 > b2Settings.b2_linearSlop) {
                //this.m_u2 *= 1.0 / length2;
                this.m_u2.x *= 1.0 / length2;
                this.m_u2.y *= 1.0 / length2;
            }
            else {
                this.m_u2.SetZero();
            }
            C = this.m_maxLength2 - length2;
            linearError = b2Math.b2Max(linearError, -C);
            C = b2Math.b2Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass2 * C;
            oldLimitPositionImpulse = this.m_limitPositionImpulse2;
            this.m_limitPositionImpulse2 = b2Math.b2Max(0.0, this.m_limitPositionImpulse2 + impulse);
            impulse = this.m_limitPositionImpulse2 - oldLimitPositionImpulse;
            //P2 = -impulse * this.m_u2;
            p2X = -impulse * this.m_u2.x;
            p2Y = -impulse * this.m_u2.y;
            //b2.m_sweep.c += b2.m_invMass * P2;
            b2.m_sweep.c.x += b2.m_invMass * p2X;
            b2.m_sweep.c.y += b2.m_invMass * p2Y;
            //b2.m_sweep.a += b2.m_invI * b2Cross(r2, P2);
            b2.m_sweep.a += b2.m_invI * (r2X * p2Y - r2Y * p2X);
            b2.SynchronizeTransform();
        }
        return linearError < b2Settings.b2_linearSlop;
    };
    // static
    b2PulleyJoint.b2_minPulleyLength = 2.0;
    return b2PulleyJoint;
}(b2Joint));
export { b2PulleyJoint };
