import { __extends } from "tslib";
import { b2Joint } from '../Joints';
import { b2Vec2, b2Mat22, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
// Linear constraint (point-to-line)
// d = p2 - p1 = x2 + r2 - x1 - r1
// C = dot(perp, d)
// Cdot = dot(d, cross(w1, perp)) + dot(perp, v2 + cross(w2, r2) - v1 - cross(w1, r1))
//      = -dot(perp, v1) - dot(cross(d + r1, perp), w1) + dot(perp, v2) + dot(cross(r2, perp), v2)
// J = [-perp, -cross(d + r1, perp), perp, cross(r2,perp)]
//
// K = J * invM * JT
//
// J = [-a -s1 a s2]
// a = perp
// s1 = cross(d + r1, a) = cross(p2 - x1, a)
// s2 = cross(r2, a) = cross(p2 - x2, a)
// Motor/Limit linear constraint
// C = dot(ax1, d)
// Cdot = = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
// J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]
// Block Solver
// We develop a block solver that includes the joint limit. This makes the limit stiff (inelastic) even
// when the mass has poor distribution (leading to large torques about the joint anchor points).
//
// The Jacobian has 3 rows:
// J = [-uT -s1 uT s2] // linear
//     [-vT -a1 vT a2] // limit
//
// u = perp
// v = axis
// s1 = cross(d + r1, u), s2 = cross(r2, u)
// a1 = cross(d + r1, v), a2 = cross(r2, v)
// M * (v2 - v1) = JT * df
// J * v2 = bias
//
// v2 = v1 + invM * JT * df
// J * (v1 + invM * JT * df) = bias
// K * df = bias - J * v1 = -Cdot
// K = J * invM * JT
// Cdot = J * v1 - bias
//
// Now solve for f2.
// df = f2 - f1
// K * (f2 - f1) = -Cdot
// f2 = invK * (-Cdot) + f1
//
// Clamp accumulated limit impulse.
// lower: f2(2) = max(f2(2), 0)
// upper: f2(2) = min(f2(2), 0)
//
// Solve for correct f2(1)
// K(1,1) * f2(1) = -Cdot(1) - K(1,2) * f2(2) + K(1,1:2) * f1
//                = -Cdot(1) - K(1,2) * f2(2) + K(1,1) * f1(1) + K(1,2) * f1(2)
// K(1,1) * f2(1) = -Cdot(1) - K(1,2) * (f2(2) - f1(2)) + K(1,1) * f1(1)
// f2(1) = invK(1,1) * (-Cdot(1) - K(1,2) * (f2(2) - f1(2))) + f1(1)
//
// Now compute impulse to be applied:
// df = f2 - f1
/**
 * A line joint. This joint provides one degree of freedom: translation
 * along an axis fixed in body1. You can use a joint limit to restrict
 * the range of motion and a joint motor to drive the motion or to
 * model joint friction.
 * @see b2LineJointDef
 */
var b2LineJoint = /** @class */ (function (_super) {
    __extends(b2LineJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
    function b2LineJoint(def) {
        var _this = _super.call(this, def) || this;
        _this.m_localAnchor1 = new b2Vec2();
        _this.m_localAnchor2 = new b2Vec2();
        _this.m_localXAxis1 = new b2Vec2();
        _this.m_localYAxis1 = new b2Vec2();
        _this.m_axis = new b2Vec2();
        _this.m_perp = new b2Vec2();
        _this.m_K = new b2Mat22();
        _this.m_impulse = new b2Vec2();
        var tMat;
        var tX;
        var tY;
        _this.m_localAnchor1.SetV(def.localAnchorA);
        _this.m_localAnchor2.SetV(def.localAnchorB);
        _this.m_localXAxis1.SetV(def.localAxisA);
        //this.m_localYAxis1 = b2Cross(1.0f, this.m_localXAxis1);
        _this.m_localYAxis1.x = -_this.m_localXAxis1.y;
        _this.m_localYAxis1.y = _this.m_localXAxis1.x;
        _this.m_impulse.SetZero();
        _this.m_motorMass = 0.0;
        _this.m_motorImpulse = 0.0;
        _this.m_lowerTranslation = def.lowerTranslation;
        _this.m_upperTranslation = def.upperTranslation;
        _this.m_maxMotorForce = def.maxMotorForce;
        _this.m_motorSpeed = def.motorSpeed;
        _this.m_enableLimit = def.enableLimit;
        _this.m_enableMotor = def.enableMotor;
        _this.m_limitState = b2Joint.e_inactiveLimit;
        _this.m_axis.SetZero();
        _this.m_perp.SetZero();
        return _this;
    }
    /** @inheritDoc */
    b2LineJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
    };
    /** @inheritDoc */
    b2LineJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
    };
    /** @inheritDoc */
    b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
        //return inv_dt * (this.m_impulse.x * this.m_perp + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis);
        return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
    };
    /** @inheritDoc */
    b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
        return inv_dt * this.m_impulse.y;
    };
    /**
    * Get the current joint translation, usually in meters.
    */
    b2LineJoint.prototype.GetJointTranslation = function () {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        var p1 = bA.GetWorldPoint(this.m_localAnchor1);
        var p2 = bB.GetWorldPoint(this.m_localAnchor2);
        //var d:b2Vec2 = b2Math.SubtractVV(p2, p1);
        var dX = p2.x - p1.x;
        var dY = p2.y - p1.y;
        //b2Vec2 axis = bA->GetWorldVector(this.m_localXAxis1);
        var axis = bA.GetWorldVector(this.m_localXAxis1);
        //float32 translation = b2Dot(d, axis);
        var translation = axis.x * dX + axis.y * dY;
        return translation;
    };
    /**
    * Get the current joint translation speed, usually in meters per second.
    */
    b2LineJoint.prototype.GetJointSpeed = function () {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
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
        //b2Vec2 p1 = bA->m_sweep.c + r1;
        var p1X = bA.m_sweep.c.x + r1X;
        var p1Y = bA.m_sweep.c.y + r1Y;
        //b2Vec2 p2 = bB->m_sweep.c + r2;
        var p2X = bB.m_sweep.c.x + r2X;
        var p2Y = bB.m_sweep.c.y + r2Y;
        //var d:b2Vec2 = b2Math.SubtractVV(p2, p1);
        var dX = p2X - p1X;
        var dY = p2Y - p1Y;
        //b2Vec2 axis = bA->GetWorldVector(m_localXAxis1);
        var axis = bA.GetWorldVector(this.m_localXAxis1);
        var v1 = bA.m_linearVelocity;
        var v2 = bB.m_linearVelocity;
        var w1 = bA.m_angularVelocity;
        var w2 = bB.m_angularVelocity;
        //var speed:number = b2Math.b2Dot(d, b2Math.b2CrossFV(w1, ax1)) + b2Math.b2Dot(ax1, b2Math.SubtractVV( b2Math.SubtractVV( b2Math.AddVV( v2 , b2Math.b2CrossFV(w2, r2)) , v1) , b2Math.b2CrossFV(w1, r1)));
        //var b2D:number = (dX*(-w1 * ax1Y) + dY*(w1 * ax1X));
        //var b2D2:number = (ax1X * ((( v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + ax1Y * ((( v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
        var speed = (dX * (-w1 * axis.y) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + (-w2 * r2Y)) - v1.x) - (-w1 * r1Y)) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
        return speed;
    };
    /**
    * Is the joint limit enabled?
    */
    b2LineJoint.prototype.IsLimitEnabled = function () {
        return this.m_enableLimit;
    };
    /**
    * Enable/disable the joint limit.
    */
    b2LineJoint.prototype.EnableLimit = function (flag) {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_enableLimit = flag;
    };
    /**
    * Get the lower joint limit, usually in meters.
    */
    b2LineJoint.prototype.GetLowerLimit = function () {
        return this.m_lowerTranslation;
    };
    /**
    * Get the upper joint limit, usually in meters.
    */
    b2LineJoint.prototype.GetUpperLimit = function () {
        return this.m_upperTranslation;
    };
    /**
    * Set the joint limits, usually in meters.
    */
    b2LineJoint.prototype.SetLimits = function (lower, upper) {
        //b2Settings.b2Assert(lower <= upper);
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_lowerTranslation = lower;
        this.m_upperTranslation = upper;
    };
    /**
    * Is the joint motor enabled?
    */
    b2LineJoint.prototype.IsMotorEnabled = function () {
        return this.m_enableMotor;
    };
    /**
    * Enable/disable the joint motor.
    */
    b2LineJoint.prototype.EnableMotor = function (flag) {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_enableMotor = flag;
    };
    /**
    * Set the motor speed, usually in meters per second.
    */
    b2LineJoint.prototype.SetMotorSpeed = function (speed) {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_motorSpeed = speed;
    };
    /**
    * Get the motor speed, usually in meters per second.
    */
    b2LineJoint.prototype.GetMotorSpeed = function () {
        return this.m_motorSpeed;
    };
    /**
     * Set the maximum motor force, usually in N.
     */
    b2LineJoint.prototype.SetMaxMotorForce = function (force) {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_maxMotorForce = force;
    };
    /**
     * Get the maximum motor force, usually in N.
     */
    b2LineJoint.prototype.GetMaxMotorForce = function () {
        return this.m_maxMotorForce;
    };
    /**
    * Get the current motor force, usually in N.
    */
    b2LineJoint.prototype.GetMotorForce = function () {
        return this.m_motorImpulse;
    };
    b2LineJoint.prototype.InitVelocityConstraints = function (step) {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        var tX;
        this.m_localCenterA.SetV(bA.GetLocalCenter());
        this.m_localCenterB.SetV(bB.GetLocalCenter());
        var xf1 = bA.GetTransform();
        var xf2 = bB.GetTransform();
        // Compute the effective masses.
        //b2Vec2 r1 = b2Mul(bA->m_xf.R, m_localAnchor1 - bA->GetLocalCenter());
        tMat = bA.m_xf.R;
        var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
        var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
        tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(bB->m_xf.R, m_localAnchor2 - bB->GetLocalCenter());
        tMat = bB.m_xf.R;
        var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
        var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        //b2Vec2 d = bB->m_sweep.c + r2 - bA->m_sweep.c - r1;
        var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
        var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
        this.m_invMassA = bA.m_invMass;
        this.m_invMassB = bB.m_invMass;
        this.m_invIA = bA.m_invI;
        this.m_invIB = bB.m_invI;
        // Compute motor Jacobian and effective mass.
        {
            this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
            //this.m_a1 = b2Math.b2Cross(d + r1, this.m_axis);
            this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
            //this.m_a2 = b2Math.b2Cross(r2, this.m_axis);
            this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
            this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
            this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
        }
        // Prismatic constraint.
        {
            this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
            //this.m_s1 = b2Math.b2Cross(d + r1, this.m_perp);
            this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
            //this.m_s2 = b2Math.b2Cross(r2, this.m_perp);
            this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
            var m1 = this.m_invMassA;
            var m2 = this.m_invMassB;
            var i1 = this.m_invIA;
            var i2 = this.m_invIB;
            this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
            this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
            this.m_K.col2.x = this.m_K.col1.y;
            this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
        }
        // Compute motor and limit terms
        if (this.m_enableLimit) {
            //float32 jointTranslation = b2Dot(this.m_axis, d);
            var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
            if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
                this.m_limitState = b2Joint.e_equalLimits;
            }
            else if (jointTransition <= this.m_lowerTranslation) {
                if (this.m_limitState != b2Joint.e_atLowerLimit) {
                    this.m_limitState = b2Joint.e_atLowerLimit;
                    this.m_impulse.y = 0.0;
                }
            }
            else if (jointTransition >= this.m_upperTranslation) {
                if (this.m_limitState != b2Joint.e_atUpperLimit) {
                    this.m_limitState = b2Joint.e_atUpperLimit;
                    this.m_impulse.y = 0.0;
                }
            }
            else {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_impulse.y = 0.0;
            }
        }
        else {
            this.m_limitState = b2Joint.e_inactiveLimit;
        }
        if (this.m_enableMotor == false) {
            this.m_motorImpulse = 0.0;
        }
        if (step.warmStarting) {
            // Account for variable time step.
            this.m_impulse.x *= step.dtRatio;
            this.m_impulse.y *= step.dtRatio;
            this.m_motorImpulse *= step.dtRatio;
            //b2Vec2 P = m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis;
            var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
            var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
            var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
            var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
            //bA->m_linearVelocity -= m_invMassA * P;
            bA.m_linearVelocity.x -= this.m_invMassA * PX;
            bA.m_linearVelocity.y -= this.m_invMassA * PY;
            //bA->m_angularVelocity -= m_invIA * L1;
            bA.m_angularVelocity -= this.m_invIA * L1;
            //bB->m_linearVelocity += m_invMassB * P;
            bB.m_linearVelocity.x += this.m_invMassB * PX;
            bB.m_linearVelocity.y += this.m_invMassB * PY;
            //bB->m_angularVelocity += m_invIB * L2;
            bB.m_angularVelocity += this.m_invIB * L2;
        }
        else {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0.0;
        }
    };
    b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var v1 = bA.m_linearVelocity;
        var w1 = bA.m_angularVelocity;
        var v2 = bB.m_linearVelocity;
        var w2 = bB.m_angularVelocity;
        var PX;
        var PY;
        var L1;
        var L2;
        // Solve linear motor constraint
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            //float32 Cdot = b2Dot(this.m_axis, v2 - v1) + this.m_a2 * w2 - this.m_a1 * w1;
            var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
            var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
            var oldImpulse = this.m_motorImpulse;
            var maxImpulse = step.dt * this.m_maxMotorForce;
            this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;
            PX = impulse * this.m_axis.x;
            PY = impulse * this.m_axis.y;
            L1 = impulse * this.m_a1;
            L2 = impulse * this.m_a2;
            v1.x -= this.m_invMassA * PX;
            v1.y -= this.m_invMassA * PY;
            w1 -= this.m_invIA * L1;
            v2.x += this.m_invMassB * PX;
            v2.y += this.m_invMassB * PY;
            w2 += this.m_invIB * L2;
        }
        //Cdot1 = b2Dot(this.m_perp, v2 - v1) + this.m_s2 * w2 - this.m_s1 * w1;
        var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            // Solve prismatic and limit constraint in block form
            //Cdot2 = b2Dot(this.m_axis, v2 - v1) + this.m_a2 * w2 - this.m_a1 * w1;
            var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
            var f1 = this.m_impulse.Copy();
            var df = this.m_K.Solve(new b2Vec2(), -Cdot1, -Cdot2);
            this.m_impulse.Add(df);
            if (this.m_limitState == b2Joint.e_atLowerLimit) {
                this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0.0);
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0.0);
            }
            // f2(1) = invK(1,1) * (-Cdot(1) - K(1,3) * (f2(2) - f1(2))) + f1(1)
            var b = -Cdot1 - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
            var f2r = void 0;
            if (this.m_K.col1.x != 0.0) {
                f2r = b / this.m_K.col1.x + f1.x;
            }
            else {
                f2r = f1.x;
            }
            this.m_impulse.x = f2r;
            df.x = this.m_impulse.x - f1.x;
            df.y = this.m_impulse.y - f1.y;
            PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
            PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
            L1 = df.x * this.m_s1 + df.y * this.m_a1;
            L2 = df.x * this.m_s2 + df.y * this.m_a2;
            v1.x -= this.m_invMassA * PX;
            v1.y -= this.m_invMassA * PY;
            w1 -= this.m_invIA * L1;
            v2.x += this.m_invMassB * PX;
            v2.y += this.m_invMassB * PY;
            w2 += this.m_invIB * L2;
        }
        else {
            // Limit is inactive, just solve the prismatic constraint in block form.
            var df2 = void 0;
            if (this.m_K.col1.x != 0.0) {
                df2 = (-Cdot1) / this.m_K.col1.x;
            }
            else {
                df2 = 0.0;
            }
            this.m_impulse.x += df2;
            PX = df2 * this.m_perp.x;
            PY = df2 * this.m_perp.y;
            L1 = df2 * this.m_s1;
            L2 = df2 * this.m_s2;
            v1.x -= this.m_invMassA * PX;
            v1.y -= this.m_invMassA * PY;
            w1 -= this.m_invIA * L1;
            v2.x += this.m_invMassB * PX;
            v2.y += this.m_invMassB * PY;
            w2 += this.m_invIB * L2;
        }
        bA.m_linearVelocity.SetV(v1);
        bA.m_angularVelocity = w1;
        bB.m_linearVelocity.SetV(v2);
        bB.m_angularVelocity = w2;
    };
    b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        //B2_NOT_USED(baumgarte);
        var limitC;
        var oldLimitImpulse;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var c1 = bA.m_sweep.c;
        var a1 = bA.m_sweep.a;
        var c2 = bB.m_sweep.c;
        var a2 = bB.m_sweep.a;
        var tMat;
        var tX;
        var m1;
        var m2;
        var i1;
        var i2;
        // Solve linear limit constraint
        var linearError = 0.0;
        var angularError = 0.0;
        var active = false;
        var C2 = 0.0;
        var R1 = b2Mat22.FromAngle(a1);
        var R2 = b2Mat22.FromAngle(a2);
        //b2Vec2 r1 = b2Mul(R1, this.m_localAnchor1 - this.m_localCenter1);
        tMat = R1;
        var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
        var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
        tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
        r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
        r1X = tX;
        //b2Vec2 r2 = b2Mul(R2, this.m_localAnchor2 - this.m_localCenter2);
        tMat = R2;
        var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
        var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
        tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
        r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
        r2X = tX;
        var dX = c2.x + r2X - c1.x - r1X;
        var dY = c2.y + r2Y - c1.y - r1Y;
        if (this.m_enableLimit) {
            this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
            //this.m_a1 = b2Math.b2Cross(d + r1, this.m_axis);
            this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
            //this.m_a2 = b2Math.b2Cross(r2, this.m_axis);
            this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
            var translation = this.m_axis.x * dX + this.m_axis.y * dY;
            if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
                // Prevent large angular corrections.
                C2 = b2Math.Clamp(translation, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
                linearError = b2Math.Abs(translation);
                active = true;
            }
            else if (translation <= this.m_lowerTranslation) {
                // Prevent large angular corrections and allow some slop.
                C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, -b2Settings.b2_maxLinearCorrection, 0.0);
                linearError = this.m_lowerTranslation - translation;
                active = true;
            }
            else if (translation >= this.m_upperTranslation) {
                // Prevent large angular corrections and allow some slop.
                C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
                linearError = translation - this.m_upperTranslation;
                active = true;
            }
        }
        this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
        //this.m_s1 = b2Cross(d + r1, this.m_perp);
        this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
        //this.m_s2 = b2Cross(r2, this.m_perp);
        this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
        var impulse = new b2Vec2();
        var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
        linearError = b2Math.Max(linearError, b2Math.Abs(C1));
        angularError = 0.0;
        if (active) {
            m1 = this.m_invMassA;
            m2 = this.m_invMassB;
            i1 = this.m_invIA;
            i2 = this.m_invIB;
            this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
            this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
            this.m_K.col2.x = this.m_K.col1.y;
            this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
            this.m_K.Solve(impulse, -C1, -C2);
        }
        else {
            m1 = this.m_invMassA;
            m2 = this.m_invMassB;
            i1 = this.m_invIA;
            i2 = this.m_invIB;
            var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
            var impulse1 = void 0;
            if (k11 != 0.0) {
                impulse1 = (-C1) / k11;
            }
            else {
                impulse1 = 0.0;
            }
            impulse.x = impulse1;
            impulse.y = 0.0;
        }
        var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
        var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
        var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
        var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
        c1.x -= this.m_invMassA * PX;
        c1.y -= this.m_invMassA * PY;
        a1 -= this.m_invIA * L1;
        c2.x += this.m_invMassB * PX;
        c2.y += this.m_invMassB * PY;
        a2 += this.m_invIB * L2;
        // TODO_ERIN remove need for this
        //bA.m_sweep.c = c1;	//Already done by reference
        bA.m_sweep.a = a1;
        //bB.m_sweep.c = c2;	//Already done by reference
        bB.m_sweep.a = a2;
        bA.SynchronizeTransform();
        bB.SynchronizeTransform();
        return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    };
    return b2LineJoint;
}(b2Joint));
export { b2LineJoint };
