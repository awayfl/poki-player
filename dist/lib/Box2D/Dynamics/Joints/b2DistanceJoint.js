import { __extends } from "tslib";
import { b2Vec2, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2Joint } from '../Joints';
// 1-D constrained system
// m (v2 - v1) = lambda
// v2 + (beta/h) * x1 + gamma * lambda = 0, gamma has units of inverse mass.
// x2 = x1 + h * v2
// 1-D mass-damper-spring system
// m (v2 - v1) + h * d * v2 + h * k *
// C = norm(p2 - p1) - L
// u = (p2 - p1) / norm(p2 - p1)
// Cdot = dot(u, v2 + cross(w2, r2) - v1 - cross(w1, r1))
// J = [-u -cross(r1, u) u cross(r2, u)]
// K = J * invM * JT
//   = invMass1 + invI1 * cross(r1, u)^2 + invMass2 + invI2 * cross(r2, u)^2
/**
* A distance joint constrains two points on two bodies
* to remain at a fixed distance from each other. You can view
* this as a massless, rigid rod.
* @see b2DistanceJointDef
*/
var b2DistanceJoint = /** @class */ (function (_super) {
    __extends(b2DistanceJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
    function b2DistanceJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_localAnchor1 = new b2Vec2();
        _this.m_localAnchor2 = new b2Vec2();
        _this.m_u = new b2Vec2();
        var tMat;
        var tX;
        var tY;
        _this.m_localAnchor1.SetV(def.localAnchorA);
        _this.m_localAnchor2.SetV(def.localAnchorB);
        _this.m_length = def.length;
        _this.m_frequencyHz = def.frequencyHz;
        _this.m_dampingRatio = def.dampingRatio;
        _this.m_impulse = 0.0;
        _this.m_gamma = 0.0;
        _this.m_bias = 0.0;
        return _this;
    }
    /** @inheritDoc */
    b2DistanceJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
    };
    /** @inheritDoc */
    b2DistanceJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
    };
    /** @inheritDoc */
    b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
        //b2Vec2 F = (m_inv_dt * m_impulse) * m_u;
        //return F;
        return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
    };
    /** @inheritDoc */
    b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
        //B2_NOT_USED(inv_dt);
        return 0.0;
    };
    /// Set the natural length
    b2DistanceJoint.prototype.GetLength = function () {
        return this.m_length;
    };
    /// Get the natural length
    b2DistanceJoint.prototype.SetLength = function (length) {
        this.m_length = length;
    };
    /// Get the frequency in Hz
    b2DistanceJoint.prototype.GetFrequency = function () {
        return this.m_frequencyHz;
    };
    /// Set the frequency in Hz
    b2DistanceJoint.prototype.SetFrequency = function (hz) {
        this.m_frequencyHz = hz;
    };
    /// Get damping ratio
    b2DistanceJoint.prototype.GetDampingRatio = function () {
        return this.m_dampingRatio;
    };
    /// Set damping ratio
    b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
        this.m_dampingRatio = ratio;
    };
    b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
        var tMat;
        var tX;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        // Compute the effective mass matrix.
        //b2Vec2 r1 = b2Mul(bA->m_xf.R, m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->m_xf.R, m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        //m_u = bB->m_sweep.c + r2 - bA->m_sweep.c - r1;
        this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
        this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
        // Handle singularity.
        //float32 length = m_u.Length();
        var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
        if (length > b2Settings.b2_linearSlop) {
            //m_u *= 1.0 / length;
            this.m_u.Multiply(1.0 / length);
        }
        else {
            this.m_u.SetZero();
        }
        //float32 cr1u = b2Cross(r1, m_u);
        var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
        //float32 cr2u = b2Cross(r2, m_u);
        var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
        //m_mass = bA->m_invMass + bA->m_invI * cr1u * cr1u + bB->m_invMass + bB->m_invI * cr2u * cr2u;
        var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
        this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
        if (this.m_frequencyHz > 0.0) {
            var C = length - this.m_length;
            // Frequency
            var omega = 2.0 * Math.PI * this.m_frequencyHz;
            // Damping coefficient
            var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
            // Spring stiffness
            var k = this.m_mass * omega * omega;
            // magic formulas
            this.m_gamma = step.dt * (d + step.dt * k);
            this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
            this.m_bias = C * step.dt * k * this.m_gamma;
            this.m_mass = invMass + this.m_gamma;
            this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
        }
        if (step.warmStarting) {
            // Scale the impulse to support a variable time step
            this.m_impulse *= step.dtRatio;
            //b2Vec2 P = this.m_impulse * this.m_u;
            var PX = this.m_impulse * this.m_u.x;
            var PY = this.m_impulse * this.m_u.y;
            //bA->m_linearVelocity -= bA->m_invMass * P;
            bA.m_linearVelocity.x -= bA.m_invMass * PX;
            bA.m_linearVelocity.y -= bA.m_invMass * PY;
            //bA->m_angularVelocity -= bA->m_invI * b2Cross(r1, P);
            bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
            //bB->m_linearVelocity += bB->m_invMass * P;
            bB.m_linearVelocity.x += bB.m_invMass * PX;
            bB.m_linearVelocity.y += bB.m_invMass * PY;
            //bB->m_angularVelocity += bB->m_invI * b2Cross(r2, P);
            bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
        }
        else {
            this.m_impulse = 0.0;
        }
    };
    b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
        var tMat;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        //b2Vec2 r1 = b2Mul(bA->m_xf.R, this.m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->m_xf.R, this.m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        // Cdot = dot(u, v + cross(w, r))
        //b2Vec2 v1 = bA->m_linearVelocity + b2Cross(bA->m_angularVelocity, r1);
        var v1X = bA.m_linearVelocity.x + (-bA.m_angularVelocity * r1Y);
        var v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
        //b2Vec2 v2 = bB->m_linearVelocity + b2Cross(bB->m_angularVelocity, r2);
        var v2X = bB.m_linearVelocity.x + (-bB.m_angularVelocity * r2Y);
        var v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
        //float32 Cdot = b2Dot(this.m_u, v2 - v1);
        var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
        var impulse = -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
        this.m_impulse += impulse;
        //b2Vec2 P = impulse * this.m_u;
        var PX = impulse * this.m_u.x;
        var PY = impulse * this.m_u.y;
        //bA->m_linearVelocity -= bA->m_invMass * P;
        bA.m_linearVelocity.x -= bA.m_invMass * PX;
        bA.m_linearVelocity.y -= bA.m_invMass * PY;
        //bA->m_angularVelocity -= bA->m_invI * b2Cross(r1, P);
        bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
        //bB->m_linearVelocity += bB->m_invMass * P;
        bB.m_linearVelocity.x += bB.m_invMass * PX;
        bB.m_linearVelocity.y += bB.m_invMass * PY;
        //bB->m_angularVelocity += bB->m_invI * b2Cross(r2, P);
        bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
    };
    b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte);
        var tMat;
        if (this.m_frequencyHz > 0.0) {
            // There is no position correction for soft distance constraints
            return true;
        }
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        //b2Vec2 r1 = b2Mul(bA->m_xf.R, m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->m_xf.R, m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        //b2Vec2 d = bB->m_sweep.c + r2 - bA->m_sweep.c - r1;
        var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
        var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
        //float32 length = d.Normalize();
        var length = Math.sqrt(dX * dX + dY * dY);
        dX /= length;
        dY /= length;
        //float32 C = length - this.m_length;
        var C = length - this.m_length;
        C = b2Math.Clamp(C, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
        var impulse = -this.m_mass * C;
        //this.m_u = d;
        this.m_u.Set(dX, dY);
        //b2Vec2 P = impulse * this.m_u;
        var PX = impulse * this.m_u.x;
        var PY = impulse * this.m_u.y;
        //bA->this.m_sweep.c -= bA->m_invMass * P;
        bA.m_sweep.c.x -= bA.m_invMass * PX;
        bA.m_sweep.c.y -= bA.m_invMass * PY;
        //bA->m_sweep.a -= bA->m_invI * b2Cross(r1, P);
        bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
        //bB->m_sweep.c += bB->m_invMass * P;
        bB.m_sweep.c.x += bB.m_invMass * PX;
        bB.m_sweep.c.y += bB.m_invMass * PY;
        //bB->m_sweep.a -= bB->m_invI * b2Cross(r2, P);
        bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
        bA.SynchronizeTransform();
        bB.SynchronizeTransform();
        return b2Math.Abs(C) < b2Settings.b2_linearSlop;
    };
    return b2DistanceJoint;
}(b2Joint));
export { b2DistanceJoint };
