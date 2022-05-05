import { __extends } from "tslib";
import { b2Vec2, b2Mat22, b2Math } from '../../Common/Math';
import { b2Joint } from '../Joints';
// Point-to-point constraint
// Cdot = v2 - v1
//      = v2 + cross(w2, r2) - v1 - cross(w1, r1)
// J = [-I -r1_skew I r2_skew ]
// Identity used:
// w k % (rx i + ry j) = w * (-ry i + rx j)
// Angle constraint
// Cdot = w2 - w1
// J = [0 0 -1 0 0 1]
// K = invI1 + invI2
/**
 * Friction joint. This is used for top-down friction.
 * It provides 2D translational friction and angular friction.
 * @see b2FrictionJointDef
 */
var b2FrictionJoint = /** @class */ (function (_super) {
    __extends(b2FrictionJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
    function b2FrictionJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_localAnchorA = new b2Vec2();
        _this.m_localAnchorB = new b2Vec2();
        _this.m_linearMass = new b2Mat22();
        _this.m_linearImpulse = new b2Vec2();
        _this.m_localAnchorA.SetV(def.localAnchorA);
        _this.m_localAnchorB.SetV(def.localAnchorB);
        _this.m_linearMass.SetZero();
        _this.m_angularMass = 0.0;
        _this.m_linearImpulse.SetZero();
        _this.m_angularImpulse = 0.0;
        _this.m_maxForce = def.maxForce;
        _this.m_maxTorque = def.maxTorque;
        return _this;
    }
    /** @inheritDoc */
    b2FrictionJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    };
    /** @inheritDoc */
    b2FrictionJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    };
    /** @inheritDoc */
    b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
        return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
    };
    /** @inheritDoc */
    b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
        //B2_NOT_USED(inv_dt);
        return inv_dt * this.m_angularImpulse;
    };
    b2FrictionJoint.prototype.SetMaxForce = function (force) {
        this.m_maxForce = force;
    };
    b2FrictionJoint.prototype.GetMaxForce = function () {
        return this.m_maxForce;
    };
    b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
        this.m_maxTorque = torque;
    };
    b2FrictionJoint.prototype.GetMaxTorque = function () {
        return this.m_maxTorque;
    };
    b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
        var tMat;
        var tX;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        // Compute the effective mass matrix.
        //b2Vec2 rA = b2Mul(bA->m_xf.R, m_localAnchorA - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
        var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
        tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
        rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
        rAX = tX;
        //b2Vec2 rB = b2Mul(bB->m_xf.R, m_localAnchorB - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
        var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
        rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
        rBX = tX;
        // J = [-I -r1_skew I r2_skew]
        //     [ 0       -1 0       1]
        // r_skew = [-ry; rx]
        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
        //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
        var mA = bA.m_invMass;
        var mB = bB.m_invMass;
        var iA = bA.m_invI;
        var iB = bB.m_invI;
        var K = new b2Mat22();
        K.col1.x = mA + mB;
        K.col2.x = 0.0;
        K.col1.y = 0.0;
        K.col2.y = mA + mB;
        K.col1.x += iA * rAY * rAY;
        K.col2.x += -iA * rAX * rAY;
        K.col1.y += -iA * rAX * rAY;
        K.col2.y += iA * rAX * rAX;
        K.col1.x += iB * rBY * rBY;
        K.col2.x += -iB * rBX * rBY;
        K.col1.y += -iB * rBX * rBY;
        K.col2.y += iB * rBX * rBX;
        K.GetInverse(this.m_linearMass);
        this.m_angularMass = iA + iB;
        if (this.m_angularMass > 0.0) {
            this.m_angularMass = 1.0 / this.m_angularMass;
        }
        if (step.warmStarting) {
            // Scale impulses to support a variable time step.
            this.m_linearImpulse.x *= step.dtRatio;
            this.m_linearImpulse.y *= step.dtRatio;
            this.m_angularImpulse *= step.dtRatio;
            var P = this.m_linearImpulse;
            bA.m_linearVelocity.x -= mA * P.x;
            bA.m_linearVelocity.y -= mA * P.y;
            bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
            bB.m_linearVelocity.x += mB * P.x;
            bB.m_linearVelocity.y += mB * P.y;
            bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
        }
        else {
            this.m_linearImpulse.SetZero();
            this.m_angularImpulse = 0.0;
        }
    };
    b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
        //B2_NOT_USED(step);
        var tMat;
        var tX;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var vA = bA.m_linearVelocity;
        var wA = bA.m_angularVelocity;
        var vB = bB.m_linearVelocity;
        var wB = bB.m_angularVelocity;
        var mA = bA.m_invMass;
        var mB = bB.m_invMass;
        var iA = bA.m_invI;
        var iB = bB.m_invI;
        //b2Vec2 rA = b2Mul(bA->m_xf.R, m_localAnchorA - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
        var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
        tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
        rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
        rAX = tX;
        //b2Vec2 rB = b2Mul(bB->m_xf.R, m_localAnchorB - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
        var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
        rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
        rBX = tX;
        var maxImpulse;
        // Solve angular friction
        {
            var Cdot = wB - wA;
            var impulse = -this.m_angularMass * Cdot;
            var oldImpulse = this.m_angularImpulse;
            maxImpulse = step.dt * this.m_maxTorque;
            this.m_angularImpulse = b2Math.Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_angularImpulse - oldImpulse;
            wA -= iA * impulse;
            wB += iB * impulse;
        }
        // Solve linear friction
        {
            //b2Vec2 Cdot = vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA);
            var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
            var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
            var impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2(-CdotX, -CdotY));
            var oldImpulseV = this.m_linearImpulse.Copy();
            this.m_linearImpulse.Add(impulseV);
            maxImpulse = step.dt * this.m_maxForce;
            if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
                this.m_linearImpulse.Normalize();
                this.m_linearImpulse.Multiply(maxImpulse);
            }
            impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
            vA.x -= mA * impulseV.x;
            vA.y -= mA * impulseV.y;
            wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
            vB.x += mB * impulseV.x;
            vB.y += mB * impulseV.y;
            wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
        }
        // References has made some sets unnecessary
        //bA->m_linearVelocity = vA;
        bA.m_angularVelocity = wA;
        //bB->m_linearVelocity = vB;
        bB.m_angularVelocity = wB;
    };
    b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte);
        return true;
    };
    return b2FrictionJoint;
}(b2Joint));
export { b2FrictionJoint };
