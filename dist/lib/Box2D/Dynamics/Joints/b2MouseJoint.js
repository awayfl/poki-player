import { __extends } from "tslib";
import { b2Vec2, b2Mat22 } from '../../Common/Math';
import { b2Joint } from '../Joints';
/**
* A mouse joint is used to make a point on a body track a
* specified world point. This a soft constraint with a maximum
* force. This allows the constraint to stretch and without
* applying huge forces.
* Note: this joint is not fully documented as it is intended primarily
* for the testbed. See that for more instructions.
* @see b2MouseJointDef
*/
var b2MouseJoint = /** @class */ (function (_super) {
    __extends(b2MouseJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
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
        //b2Settings.b2Assert(def.target.IsValid());
        //b2Settings.b2Assert(b2Math.b2IsValid(def.maxForce) && def.maxForce > 0.0);
        //b2Settings.b2Assert(b2Math.b2IsValid(def.frequencyHz) && def.frequencyHz > 0.0);
        //b2Settings.b2Assert(b2Math.b2IsValid(def.dampingRatio) && def.dampingRatio > 0.0);
        _this.m_target.SetV(def.target);
        //this.m_localAnchor = b2MulT(this.m_bodyB.this.m_xf, this.m_target);
        var tX = _this.m_target.x - _this.m_bodyB.m_xf.position.x;
        var tY = _this.m_target.y - _this.m_bodyB.m_xf.position.y;
        var tMat = _this.m_bodyB.m_xf.R;
        _this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
        _this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
        _this.m_maxForce = def.maxForce;
        _this.m_impulse.SetZero();
        _this.m_frequencyHz = def.frequencyHz;
        _this.m_dampingRatio = def.dampingRatio;
        _this.m_beta = 0.0;
        _this.m_gamma = 0.0;
        return _this;
    }
    /** @inheritDoc */
    b2MouseJoint.prototype.GetAnchorA = function () {
        return this.m_target;
    };
    /** @inheritDoc */
    b2MouseJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
    };
    /** @inheritDoc */
    b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
        return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
    };
    /** @inheritDoc */
    b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
        return 0.0;
    };
    b2MouseJoint.prototype.GetTarget = function () {
        return this.m_target;
    };
    /**
     * Use this to update the target point.
     */
    b2MouseJoint.prototype.SetTarget = function (target) {
        if (this.m_bodyB.IsAwake() == false) {
            this.m_bodyB.SetAwake(true);
        }
        this.m_target = target;
    };
    /// Get the maximum force in Newtons.
    b2MouseJoint.prototype.GetMaxForce = function () {
        return this.m_maxForce;
    };
    /// Set the maximum force in Newtons.
    b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
        this.m_maxForce = maxForce;
    };
    /// Get frequency in Hz
    b2MouseJoint.prototype.GetFrequency = function () {
        return this.m_frequencyHz;
    };
    /// Set the frequency in Hz
    b2MouseJoint.prototype.SetFrequency = function (hz) {
        this.m_frequencyHz = hz;
    };
    /// Get damping ratio
    b2MouseJoint.prototype.GetDampingRatio = function () {
        return this.m_dampingRatio;
    };
    /// Set damping ratio
    b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
        this.m_dampingRatio = ratio;
    };
    b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
        var b = this.m_bodyB;
        var mass = b.GetMass();
        // Frequency
        var omega = 2.0 * Math.PI * this.m_frequencyHz;
        // Damping co-efficient
        var d = 2.0 * mass * this.m_dampingRatio * omega;
        // Spring stiffness
        var k = mass * omega * omega;
        // magic formulas
        // gamma has units of inverse mass
        // beta hs units of inverse time
        //b2Settings.b2Assert(d + step.dt * k > Number.MIN_VALUE)
        this.m_gamma = step.dt * (d + step.dt * k);
        this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0.0;
        this.m_beta = step.dt * k * this.m_gamma;
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
        //this.m_ptpMass = K.GetInverse();
        this.K.GetInverse(this.m_mass);
        //m_C = b.m_position + r - m_target;
        this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
        this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
        // Cheat with some damping
        b.m_angularVelocity *= 0.98;
        // Warm starting.
        this.m_impulse.x *= step.dtRatio;
        this.m_impulse.y *= step.dtRatio;
        //b.m_linearVelocity += invMass * this.m_impulse;
        b.m_linearVelocity.x += invMass * this.m_impulse.x;
        b.m_linearVelocity.y += invMass * this.m_impulse.y;
        //b.m_angularVelocity += invI * b2Cross(r, this.m_impulse);
        b.m_angularVelocity += invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
    };
    b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
        var b = this.m_bodyB;
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
        //b2Vec2 impulse = - b2Mul(this.m_mass, Cdot + this.m_beta * this.m_C + this.m_gamma * this.m_impulse);
        tMat = this.m_mass;
        tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
        tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
        var impulseX = -(tMat.col1.x * tX + tMat.col2.x * tY);
        var impulseY = -(tMat.col1.y * tX + tMat.col2.y * tY);
        var oldImpulseX = this.m_impulse.x;
        var oldImpulseY = this.m_impulse.y;
        //this.m_impulse += impulse;
        this.m_impulse.x += impulseX;
        this.m_impulse.y += impulseY;
        var maxImpulse = step.dt * this.m_maxForce;
        if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
            //this.m_impulse *= this.m_maxImpulse / this.m_impulse.Length();
            this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
        }
        //impulse = this.m_impulse - oldImpulse;
        impulseX = this.m_impulse.x - oldImpulseX;
        impulseY = this.m_impulse.y - oldImpulseY;
        //b->this.m_linearVelocity += b->m_invMass * impulse;
        b.m_linearVelocity.x += b.m_invMass * impulseX;
        b.m_linearVelocity.y += b.m_invMass * impulseY;
        //b->m_angularVelocity += b->m_invI * b2Cross(r, P);
        b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
    };
    b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte);
        return true;
    };
    return b2MouseJoint;
}(b2Joint));
export { b2MouseJoint };
