import { __extends } from "tslib";
import { b2Joint } from '../Joints';
import { b2Vec2, b2Vec3, b2Mat33, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
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
 * A weld joint essentially glues two bodies together. A weld joint may
 * distort somewhat because the island constraint solver is approximate.
 */
var b2WeldJoint = /** @class */ (function (_super) {
    __extends(b2WeldJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
    function b2WeldJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_localAnchorA = new b2Vec2();
        _this.m_localAnchorB = new b2Vec2();
        _this.m_impulse = new b2Vec3();
        _this.m_mass = new b2Mat33();
        _this.m_localAnchorA.SetV(def.localAnchorA);
        _this.m_localAnchorB.SetV(def.localAnchorB);
        _this.m_referenceAngle = def.referenceAngle;
        _this.m_impulse.SetZero();
        _this.m_mass = new b2Mat33();
        return _this;
    }
    /** @inheritDoc */
    b2WeldJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
    };
    /** @inheritDoc */
    b2WeldJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
    };
    /** @inheritDoc */
    b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
        return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
    };
    /** @inheritDoc */
    b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
        return inv_dt * this.m_impulse.z;
    };
    b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
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
        this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
        this.m_mass.col2.x = -rAY * rAX * iA - rBY * rBX * iB;
        this.m_mass.col3.x = -rAY * iA - rBY * iB;
        this.m_mass.col1.y = this.m_mass.col2.x;
        this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
        this.m_mass.col3.y = rAX * iA + rBX * iB;
        this.m_mass.col1.z = this.m_mass.col3.x;
        this.m_mass.col2.z = this.m_mass.col3.y;
        this.m_mass.col3.z = iA + iB;
        if (step.warmStarting) {
            // Scale impulses to support a variable time step.
            this.m_impulse.x *= step.dtRatio;
            this.m_impulse.y *= step.dtRatio;
            this.m_impulse.z *= step.dtRatio;
            bA.m_linearVelocity.x -= mA * this.m_impulse.x;
            bA.m_linearVelocity.y -= mA * this.m_impulse.y;
            bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
            bB.m_linearVelocity.x += mB * this.m_impulse.x;
            bB.m_linearVelocity.y += mB * this.m_impulse.y;
            bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
        }
        else {
            this.m_impulse.SetZero();
        }
    };
    b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
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
        // Solve point-to-point constraint
        var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
        var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
        var Cdot2 = wB - wA;
        var impulse = new b2Vec3();
        this.m_mass.Solve33(impulse, -Cdot1X, -Cdot1Y, -Cdot2);
        this.m_impulse.Add(impulse);
        vA.x -= mA * impulse.x;
        vA.y -= mA * impulse.y;
        wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
        vB.x += mB * impulse.x;
        vB.y += mB * impulse.y;
        wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
        // References has made some sets unnecessary
        //bA->this.m_linearVelocity = vA;
        bA.m_angularVelocity = wA;
        //bB->this.m_linearVelocity = vB;
        bB.m_angularVelocity = wB;
    };
    b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte);
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
        //b2Vec2 C1 =  bB->this.m_sweep.c + rB - bA->this.m_sweep.c - rA;
        var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
        var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
        var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
        // Handle large detachment.
        var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
        var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
        var angularError = b2Math.Abs(C2);
        if (positionError > k_allowedStretch) {
            iA *= 1.0;
            iB *= 1.0;
        }
        this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
        this.m_mass.col2.x = -rAY * rAX * iA - rBY * rBX * iB;
        this.m_mass.col3.x = -rAY * iA - rBY * iB;
        this.m_mass.col1.y = this.m_mass.col2.x;
        this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
        this.m_mass.col3.y = rAX * iA + rBX * iB;
        this.m_mass.col1.z = this.m_mass.col3.x;
        this.m_mass.col2.z = this.m_mass.col3.y;
        this.m_mass.col3.z = iA + iB;
        var impulse = new b2Vec3();
        this.m_mass.Solve33(impulse, -C1X, -C1Y, -C2);
        bA.m_sweep.c.x -= mA * impulse.x;
        bA.m_sweep.c.y -= mA * impulse.y;
        bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
        bB.m_sweep.c.x += mB * impulse.x;
        bB.m_sweep.c.y += mB * impulse.y;
        bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
        bA.SynchronizeTransform();
        bB.SynchronizeTransform();
        return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    };
    return b2WeldJoint;
}(b2Joint));
export { b2WeldJoint };
