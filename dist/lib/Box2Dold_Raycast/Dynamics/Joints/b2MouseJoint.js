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
import { b2Vec2, b2Mat22 } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
// p = attached point, m = mouse point
// C = p - m
// Cdot = v
//      = v + cross(w, r)
// J = [I r_skew]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)
/// A mouse joint is used to make a point on a body track a
/// specified world point. This a soft constraint with a maximum
/// force. This allows the constraint to stretch and without
/// applying huge forces.
var b2MouseJoint = /** @class */ (function (_super) {
    __extends(b2MouseJoint, _super);
    //--------------- Internals Below -------------------
    function b2MouseJoint(def) {
        var _this = _super.call(this, def) || this;
        // Presolve vars
        _this.K = new b2Mat22();
        _this.K1 = new b2Mat22();
        _this.K2 = new b2Mat22();
        _this.m_localAnchor = new b2Vec2();
        _this.m_target = new b2Vec2();
        _this.m_impulse = new b2Vec2();
        _this.m_mass = new b2Mat22(); // effective mass for point-to-point constraint.
        _this.m_C = new b2Vec2(); // position error
        _this.m_target.SetV(def.target);
        //m_localAnchor = b2MulT(m_body2.m_xf, m_target);
        var tX = _this.m_target.x - _this.m_body2.m_xf.position.x;
        var tY = _this.m_target.y - _this.m_body2.m_xf.position.y;
        var tMat = _this.m_body2.m_xf.R;
        _this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
        _this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
        _this.m_maxForce = def.maxForce;
        _this.m_impulse.SetZero();
        var mass = _this.m_body2.m_mass;
        // Frequency
        var omega = 2.0 * b2Settings.b2_pi * def.frequencyHz;
        // Damping coefficient
        var d = 2.0 * mass * def.dampingRatio * omega;
        // Spring stiffness
        var k = (def.timeStep * mass) * (omega * omega);
        // magic formulas
        //b2Assert(d + k > B2_FLT_EPSILON);
        _this.m_gamma = 1.0 / (d + k);
        _this.m_beta = k / (d + k);
        return _this;
    }
    /// Implements b2Joint.
    b2MouseJoint.prototype.GetAnchor1 = function () {
        return this.m_target;
    };
    /// Implements b2Joint.
    b2MouseJoint.prototype.GetAnchor2 = function () {
        return this.m_body2.GetWorldPoint(this.m_localAnchor);
    };
    /// Implements b2Joint.
    b2MouseJoint.prototype.GetReactionForce = function () {
        return this.m_impulse;
    };
    /// Implements b2Joint.
    b2MouseJoint.prototype.GetReactionTorque = function () {
        return 0.0;
    };
    /// Use this to update the target point.
    b2MouseJoint.prototype.SetTarget = function (target) {
        if (this.m_body2.IsSleeping()) {
            this.m_body2.WakeUp();
        }
        this.m_target = target;
    };
    b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
        var b = this.m_body2;
        var tMat;
        // Compute the effective mass matrix.
        //b2Vec2 r = b2Mul(b->m_xf.R, m_localAnchor - b->GetLocalCenter());
        tMat = b.m_xf.R;
        var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
        var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * rX + tMat.col2.x * rY);
        rY = (tMat.col1.y * rX + tMat.col2.y * rY);
        rX = tX;
        // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
        //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
        //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
        var invMass = b.m_invMass;
        var invI = b.m_invI;
        //b2Mat22 K1;
        this.K1.col1.x = invMass;
        this.K1.col2.x = 0.0;
        this.K1.col1.y = 0.0;
        this.K1.col2.y = invMass;
        //b2Mat22 K2;
        this.K2.col1.x = invI * rY * rY;
        this.K2.col2.x = -invI * rX * rY;
        this.K2.col1.y = -invI * rX * rY;
        this.K2.col2.y = invI * rX * rX;
        //b2Mat22 K = K1 + K2;
        this.K.SetM(this.K1);
        this.K.AddM(this.K2);
        this.K.col1.x += this.m_gamma;
        this.K.col2.y += this.m_gamma;
        //m_ptpMass = K.Invert();
        this.K.Invert(this.m_mass);
        //m_C = b.m_position + r - m_target;
        this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
        this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
        // Cheat with some damping
        b.m_angularVelocity *= 0.98;
        // Warm starting.
        //b2Vec2 P = m_impulse;
        var PX = step.dt * this.m_impulse.x;
        var PY = step.dt * this.m_impulse.y;
        //b.m_linearVelocity += invMass * P;
        b.m_linearVelocity.x += invMass * PX;
        b.m_linearVelocity.y += invMass * PY;
        //b.m_angularVelocity += invI * b2Cross(r, P);
        b.m_angularVelocity += invI * (rX * PY - rY * PX);
    };
    b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
        var b = this.m_body2;
        var tMat;
        var tX;
        var tY;
        // Compute the effective mass matrix.
        //b2Vec2 r = b2Mul(b->m_xf.R, m_localAnchor - b->GetLocalCenter());
        tMat = b.m_xf.R;
        var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
        var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
        tX = (tMat.col1.x * rX + tMat.col2.x * rY);
        rY = (tMat.col1.y * rX + tMat.col2.y * rY);
        rX = tX;
        // Cdot = v + cross(w, r)
        //b2Vec2 Cdot = b->m_linearVelocity + b2Cross(b->m_angularVelocity, r);
        var CdotX = b.m_linearVelocity.x + (-b.m_angularVelocity * rY);
        var CdotY = b.m_linearVelocity.y + (b.m_angularVelocity * rX);
        //b2Vec2 force = -step.inv_dt * b2Mul(m_mass, Cdot + (m_beta * step.inv_dt) * m_C + m_gamma * step.dt * m_force);
        tMat = this.m_mass;
        tX = CdotX + (this.m_beta * step.inv_dt) * this.m_C.x + this.m_gamma * step.dt * this.m_impulse.x;
        tY = CdotY + (this.m_beta * step.inv_dt) * this.m_C.y + this.m_gamma * step.dt * this.m_impulse.y;
        var forceX = -step.inv_dt * (tMat.col1.x * tX + tMat.col2.x * tY);
        var forceY = -step.inv_dt * (tMat.col1.y * tX + tMat.col2.y * tY);
        var oldForceX = this.m_impulse.x;
        var oldForceY = this.m_impulse.y;
        //m_force += force;
        this.m_impulse.x += forceX;
        this.m_impulse.y += forceY;
        var forceMagnitude = this.m_impulse.Length();
        if (forceMagnitude > this.m_maxForce) {
            //m_impulse *= m_maxForce / forceMagnitude;
            this.m_impulse.Multiply(this.m_maxForce / forceMagnitude);
        }
        //force = m_impulse - oldForce;
        forceX = this.m_impulse.x - oldForceX;
        forceY = this.m_impulse.y - oldForceY;
        //b2Vec2 P = step.dt * force;
        var PX = step.dt * forceX;
        var PY = step.dt * forceY;
        //b->m_linearVelocity += b->m_invMass * P;
        b.m_linearVelocity.x += b.m_invMass * PX;
        b.m_linearVelocity.y += b.m_invMass * PY;
        //b->m_angularVelocity += b->m_invI * b2Cross(r, P);
        b.m_angularVelocity += b.m_invI * (rX * PY - rY * PX);
    };
    b2MouseJoint.prototype.SolvePositionConstraints = function () {
        return true;
    };
    return b2MouseJoint;
}(b2Joint));
export { b2MouseJoint };
