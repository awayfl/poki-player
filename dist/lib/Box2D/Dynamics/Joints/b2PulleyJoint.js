import { __extends } from "tslib";
import { b2Vec2, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2Joint } from '../Joints';
/**
* The pulley joint is connected to two bodies and two fixed ground points.
* The pulley supports a ratio such that:
* length1 + ratio * length2 <= constant
* Yes, the force transmitted is scaled by the ratio.
* The pulley also enforces a maximum length limit on both sides. This is
* useful to prevent one side of the pulley hitting the top.
* @see b2PulleyJointDef
*/
var b2PulleyJoint = /** @class */ (function (_super) {
    __extends(b2PulleyJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
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
        _this.m_ground = _this.m_bodyA.m_world.m_groundBody;
        //this.m_groundAnchor1 = def->groundAnchorA - this.m_ground->this.m_xf.position;
        _this.m_groundAnchor1.x = def.groundAnchorA.x - _this.m_ground.m_xf.position.x;
        _this.m_groundAnchor1.y = def.groundAnchorA.y - _this.m_ground.m_xf.position.y;
        //this.m_groundAnchor2 = def->groundAnchorB - this.m_ground->this.m_xf.position;
        _this.m_groundAnchor2.x = def.groundAnchorB.x - _this.m_ground.m_xf.position.x;
        _this.m_groundAnchor2.y = def.groundAnchorB.y - _this.m_ground.m_xf.position.y;
        //this.m_localAnchor1 = def->localAnchorA;
        _this.m_localAnchor1.SetV(def.localAnchorA);
        //this.m_localAnchor2 = def->localAnchorB;
        _this.m_localAnchor2.SetV(def.localAnchorB);
        //b2Settings.b2Assert(def.ratio != 0.0);
        _this.m_ratio = def.ratio;
        _this.m_constant = def.lengthA + _this.m_ratio * def.lengthB;
        _this.m_maxLength1 = b2Math.Min(def.maxLengthA, _this.m_constant - _this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
        _this.m_maxLength2 = b2Math.Min(def.maxLengthB, (_this.m_constant - b2PulleyJoint.b2_minPulleyLength) / _this.m_ratio);
        _this.m_impulse = 0.0;
        _this.m_limitImpulse1 = 0.0;
        _this.m_limitImpulse2 = 0.0;
        return _this;
    }
    /** @inheritDoc */
    b2PulleyJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
    };
    /** @inheritDoc */
    b2PulleyJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
    };
    /** @inheritDoc */
    b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
        //b2Vec2 P = this.m_impulse * this.m_u2;
        //return inv_dt * P;
        return new b2Vec2(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
    };
    /** @inheritDoc */
    b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
        //B2_NOT_USED(inv_dt);
        return 0.0;
    };
    /**
     * Get the first ground anchor.
     */
    b2PulleyJoint.prototype.GetGroundAnchorA = function () {
        //return this.m_ground.m_xf.position + this.m_groundAnchor1;
        var a = this.m_ground.m_xf.position.Copy();
        a.Add(this.m_groundAnchor1);
        return a;
    };
    /**
     * Get the second ground anchor.
     */
    b2PulleyJoint.prototype.GetGroundAnchorB = function () {
        //return this.m_ground.m_xf.position + this.m_groundAnchor2;
        var a = this.m_ground.m_xf.position.Copy();
        a.Add(this.m_groundAnchor2);
        return a;
    };
    /**
     * Get the current length of the segment attached to body1.
     */
    b2PulleyJoint.prototype.GetLength1 = function () {
        var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
        //b2Vec2 s = this.m_ground->this.m_xf.position + this.m_groundAnchor1;
        var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
        var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
        //b2Vec2 d = p - s;
        var dX = p.x - sX;
        var dY = p.y - sY;
        //return d.Length();
        return Math.sqrt(dX * dX + dY * dY);
    };
    /**
     * Get the current length of the segment attached to body2.
     */
    b2PulleyJoint.prototype.GetLength2 = function () {
        var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
        //b2Vec2 s = this.m_ground->this.m_xf.position + this.m_groundAnchor2;
        var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
        var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
        //b2Vec2 d = p - s;
        var dX = p.x - sX;
        var dY = p.y - sY;
        //return d.Length();
        return Math.sqrt(dX * dX + dY * dY);
    };
    /**
     * Get the pulley ratio.
     */
    b2PulleyJoint.prototype.GetRatio = function () {
        return this.m_ratio;
    };
    b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        //b2Vec2 r1 = b2Mul(bA->this.m_xf.R, this.m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->this.m_xf.R, this.m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        //b2Vec2 p1 = bA->this.m_sweep.c + r1;
        var p1X = bA.m_sweep.c.x + r1X;
        var p1Y = bA.m_sweep.c.y + r1Y;
        //b2Vec2 p2 = bB->this.m_sweep.c + r2;
        var p2X = bB.m_sweep.c.x + r2X;
        var p2Y = bB.m_sweep.c.y + r2Y;
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
            this.m_state = b2Joint.e_inactiveLimit;
            this.m_impulse = 0.0;
        }
        else {
            this.m_state = b2Joint.e_atUpperLimit;
        }
        if (length1 < this.m_maxLength1) {
            this.m_limitState1 = b2Joint.e_inactiveLimit;
            this.m_limitImpulse1 = 0.0;
        }
        else {
            this.m_limitState1 = b2Joint.e_atUpperLimit;
        }
        if (length2 < this.m_maxLength2) {
            this.m_limitState2 = b2Joint.e_inactiveLimit;
            this.m_limitImpulse2 = 0.0;
        }
        else {
            this.m_limitState2 = b2Joint.e_atUpperLimit;
        }
        // Compute effective mass.
        //var cr1u1:number = b2Cross(r1, this.m_u1);
        var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
        //var cr2u2:number = b2Cross(r2, this.m_u2);
        var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
        this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
        this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
        this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
        //b2Settings.b2Assert(this.m_limitMass1 > Number.MIN_VALUE);
        //b2Settings.b2Assert(this.m_limitMass2 > Number.MIN_VALUE);
        //b2Settings.b2Assert(this.m_pulleyMass > Number.MIN_VALUE);
        this.m_limitMass1 = 1.0 / this.m_limitMass1;
        this.m_limitMass2 = 1.0 / this.m_limitMass2;
        this.m_pulleyMass = 1.0 / this.m_pulleyMass;
        if (step.warmStarting) {
            // Scale impulses to support variable time steps.
            this.m_impulse *= step.dtRatio;
            this.m_limitImpulse1 *= step.dtRatio;
            this.m_limitImpulse2 *= step.dtRatio;
            // Warm starting.
            //b2Vec2 P1 = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1;
            var P1X = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.x;
            var P1Y = (-this.m_impulse - this.m_limitImpulse1) * this.m_u1.y;
            //b2Vec2 P2 = (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2;
            var P2X = (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.x;
            var P2Y = (-this.m_ratio * this.m_impulse - this.m_limitImpulse2) * this.m_u2.y;
            //bA.m_linearVelocity += bA.m_invMass * P1;
            bA.m_linearVelocity.x += bA.m_invMass * P1X;
            bA.m_linearVelocity.y += bA.m_invMass * P1Y;
            //bA.m_angularVelocity += bA.m_invI * b2Cross(r1, P1);
            bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
            //bB.m_linearVelocity += bB.m_invMass * P2;
            bB.m_linearVelocity.x += bB.m_invMass * P2X;
            bB.m_linearVelocity.y += bB.m_invMass * P2Y;
            //bB.m_angularVelocity += bB.m_invI * b2Cross(r2, P2);
            bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
        }
        else {
            this.m_impulse = 0.0;
            this.m_limitImpulse1 = 0.0;
            this.m_limitImpulse2 = 0.0;
        }
    };
    b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
        //B2_NOT_USED(step)
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        //b2Vec2 r1 = b2Mul(bA->this.m_xf.R, this.m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
        var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
        var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->this.m_xf.R, this.m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
        var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
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
        var impulse;
        var oldImpulse;
        if (this.m_state == b2Joint.e_atUpperLimit) {
            //b2Vec2 v1 = bA->this.m_linearVelocity + b2Cross(bA->this.m_angularVelocity, r1);
            v1X = bA.m_linearVelocity.x + (-bA.m_angularVelocity * r1Y);
            v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
            //b2Vec2 v2 = bB->this.m_linearVelocity + b2Cross(bB->this.m_angularVelocity, r2);
            v2X = bB.m_linearVelocity.x + (-bB.m_angularVelocity * r2Y);
            v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
            //Cdot = -b2Dot(this.m_u1, v1) - this.m_ratio * b2Dot(this.m_u2, v2);
            Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
            impulse = this.m_pulleyMass * (-Cdot);
            oldImpulse = this.m_impulse;
            this.m_impulse = b2Math.Max(0.0, this.m_impulse + impulse);
            impulse = this.m_impulse - oldImpulse;
            //b2Vec2 P1 = -impulse * this.m_u1;
            P1X = -impulse * this.m_u1.x;
            P1Y = -impulse * this.m_u1.y;
            //b2Vec2 P2 = - this.m_ratio * impulse * this.m_u2;
            P2X = -this.m_ratio * impulse * this.m_u2.x;
            P2Y = -this.m_ratio * impulse * this.m_u2.y;
            //bA.m_linearVelocity += bA.m_invMass * P1;
            bA.m_linearVelocity.x += bA.m_invMass * P1X;
            bA.m_linearVelocity.y += bA.m_invMass * P1Y;
            //bA.m_angularVelocity += bA.m_invI * b2Cross(r1, P1);
            bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
            //bB.m_linearVelocity += bB.m_invMass * P2;
            bB.m_linearVelocity.x += bB.m_invMass * P2X;
            bB.m_linearVelocity.y += bB.m_invMass * P2Y;
            //bB.m_angularVelocity += bB.m_invI * b2Cross(r2, P2);
            bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
        }
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            //b2Vec2 v1 = bA->this.m_linearVelocity + b2Cross(bA->this.m_angularVelocity, r1);
            v1X = bA.m_linearVelocity.x + (-bA.m_angularVelocity * r1Y);
            v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
            //float32 Cdot = -b2Dot(this.m_u1, v1);
            Cdot = -(this.m_u1.x * v1X + this.m_u1.y * v1Y);
            impulse = -this.m_limitMass1 * Cdot;
            oldImpulse = this.m_limitImpulse1;
            this.m_limitImpulse1 = b2Math.Max(0.0, this.m_limitImpulse1 + impulse);
            impulse = this.m_limitImpulse1 - oldImpulse;
            //b2Vec2 P1 = -impulse * this.m_u1;
            P1X = -impulse * this.m_u1.x;
            P1Y = -impulse * this.m_u1.y;
            //bA.m_linearVelocity += bA->this.m_invMass * P1;
            bA.m_linearVelocity.x += bA.m_invMass * P1X;
            bA.m_linearVelocity.y += bA.m_invMass * P1Y;
            //bA.m_angularVelocity += bA->this.m_invI * b2Cross(r1, P1);
            bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            //b2Vec2 v2 = bB->this.m_linearVelocity + b2Cross(bB->this.m_angularVelocity, r2);
            v2X = bB.m_linearVelocity.x + (-bB.m_angularVelocity * r2Y);
            v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
            //float32 Cdot = -b2Dot(this.m_u2, v2);
            Cdot = -(this.m_u2.x * v2X + this.m_u2.y * v2Y);
            impulse = -this.m_limitMass2 * Cdot;
            oldImpulse = this.m_limitImpulse2;
            this.m_limitImpulse2 = b2Math.Max(0.0, this.m_limitImpulse2 + impulse);
            impulse = this.m_limitImpulse2 - oldImpulse;
            //b2Vec2 P2 = -impulse * this.m_u2;
            P2X = -impulse * this.m_u2.x;
            P2Y = -impulse * this.m_u2.y;
            //bB->this.m_linearVelocity += bB->this.m_invMass * P2;
            bB.m_linearVelocity.x += bB.m_invMass * P2X;
            bB.m_linearVelocity.y += bB.m_invMass * P2Y;
            //bB->this.m_angularVelocity += bB->this.m_invI * b2Cross(r2, P2);
            bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
        }
    };
    b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte)
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
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
        if (this.m_state == b2Joint.e_atUpperLimit) {
            //b2Vec2 r1 = b2Mul(bA->this.m_xf.R, this.m_localAnchor1 - bA->GetLocalCenter());
            tMat = bA.m_xf.R;
            r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 r2 = b2Mul(bB->this.m_xf.R, this.m_localAnchor2 - bB->GetLocalCenter());
            tMat = bB.m_xf.R;
            r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            //b2Vec2 p1 = bA->this.m_sweep.c + r1;
            p1X = bA.m_sweep.c.x + r1X;
            p1Y = bA.m_sweep.c.y + r1Y;
            //b2Vec2 p2 = bB->this.m_sweep.c + r2;
            p2X = bB.m_sweep.c.x + r2X;
            p2Y = bB.m_sweep.c.y + r2Y;
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
            linearError = b2Math.Max(linearError, -C);
            C = b2Math.Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_pulleyMass * C;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            p2X = -this.m_ratio * impulse * this.m_u2.x;
            p2Y = -this.m_ratio * impulse * this.m_u2.y;
            bA.m_sweep.c.x += bA.m_invMass * p1X;
            bA.m_sweep.c.y += bA.m_invMass * p1Y;
            bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
            bB.m_sweep.c.x += bB.m_invMass * p2X;
            bB.m_sweep.c.y += bB.m_invMass * p2Y;
            bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
        }
        if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
            //b2Vec2 r1 = b2Mul(bA->this.m_xf.R, this.m_localAnchor1 - bA->GetLocalCenter());
            tMat = bA.m_xf.R;
            r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 p1 = bA->this.m_sweep.c + r1;
            p1X = bA.m_sweep.c.x + r1X;
            p1Y = bA.m_sweep.c.y + r1Y;
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
            linearError = b2Math.Max(linearError, -C);
            C = b2Math.Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass1 * C;
            //P1 = -impulse * this.m_u1;
            p1X = -impulse * this.m_u1.x;
            p1Y = -impulse * this.m_u1.y;
            bA.m_sweep.c.x += bA.m_invMass * p1X;
            bA.m_sweep.c.y += bA.m_invMass * p1Y;
            //bA.m_rotation += bA.m_invI * b2Cross(r1, P1);
            bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
            bA.SynchronizeTransform();
        }
        if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
            //b2Vec2 r2 = b2Mul(bB->this.m_xf.R, this.m_localAnchor2 - bB->GetLocalCenter());
            tMat = bB.m_xf.R;
            r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            //b2Vec2 p2 = bB->this.m_position + r2;
            p2X = bB.m_sweep.c.x + r2X;
            p2Y = bB.m_sweep.c.y + r2Y;
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
            linearError = b2Math.Max(linearError, -C);
            C = b2Math.Clamp(C + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
            impulse = -this.m_limitMass2 * C;
            //P2 = -impulse * this.m_u2;
            p2X = -impulse * this.m_u2.x;
            p2Y = -impulse * this.m_u2.y;
            //bB.m_sweep.c += bB.m_invMass * P2;
            bB.m_sweep.c.x += bB.m_invMass * p2X;
            bB.m_sweep.c.y += bB.m_invMass * p2Y;
            //bB.m_sweep.a += bB.m_invI * b2Cross(r2, P2);
            bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
            bB.SynchronizeTransform();
        }
        return linearError < b2Settings.b2_linearSlop;
    };
    // static
    b2PulleyJoint.b2_minPulleyLength = 2.0;
    return b2PulleyJoint;
}(b2Joint));
export { b2PulleyJoint };
