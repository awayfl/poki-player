import { __extends } from "tslib";
import { b2Joint } from '../Joints';
import { b2Vec2, b2Mat33, b2Vec3, b2Mat22, b2Math } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
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
/**
* A revolute joint constrains to bodies to share a common point while they
* are free to rotate about the point. The relative rotation about the shared
* point is the joint angle. You can limit the relative rotation with
* a joint limit that specifies a lower and upper angle. You can use a motor
* to drive the relative rotation about the shared point. A maximum motor torque
* is provided so that infinite forces are not generated.
* @see b2RevoluteJointDef
*/
var b2RevoluteJoint = /** @class */ (function (_super) {
    __extends(b2RevoluteJoint, _super);
    //--------------- Internals Below -------------------
    /** @private */
    function b2RevoluteJoint(def) {
        var _this = _super.call(this, def) || this;
        // internal vars
        _this.K = new b2Mat22();
        _this.K1 = new b2Mat22();
        _this.K2 = new b2Mat22();
        _this.K3 = new b2Mat22();
        _this.impulse3 = new b2Vec3();
        _this.impulse2 = new b2Vec2();
        _this.reduced = new b2Vec2();
        _this.m_localAnchor1 = new b2Vec2(); // relative
        _this.m_localAnchor2 = new b2Vec2();
        _this.m_impulse = new b2Vec3();
        _this.m_mass = new b2Mat33(); // effective mass for point-to-point constraint.
        //this.m_localAnchor1 = def->localAnchorA;
        _this.m_localAnchor1.SetV(def.localAnchorA);
        //this.m_localAnchor2 = def->localAnchorB;
        _this.m_localAnchor2.SetV(def.localAnchorB);
        _this.m_referenceAngle = def.referenceAngle;
        _this.m_impulse.SetZero();
        _this.m_motorImpulse = 0.0;
        _this.m_lowerAngle = def.lowerAngle;
        _this.m_upperAngle = def.upperAngle;
        _this.m_maxMotorTorque = def.maxMotorTorque;
        _this.m_motorSpeed = def.motorSpeed;
        _this.m_enableLimit = def.enableLimit;
        _this.m_enableMotor = def.enableMotor;
        _this.m_limitState = b2Joint.e_inactiveLimit;
        return _this;
    }
    /** @inheritDoc */
    b2RevoluteJoint.prototype.GetAnchorA = function () {
        return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
    };
    /** @inheritDoc */
    b2RevoluteJoint.prototype.GetAnchorB = function () {
        return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
    };
    /** @inheritDoc */
    b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
        return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
    };
    /** @inheritDoc */
    b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
        return inv_dt * this.m_impulse.z;
    };
    /**
    * Get the current joint angle in radians.
    */
    b2RevoluteJoint.prototype.GetJointAngle = function () {
        //b2Body* bA = this.m_bodyA;
        //b2Body* bB = this.m_bodyB;
        return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
    };
    /**
    * Get the current joint angle speed in radians per second.
    */
    b2RevoluteJoint.prototype.GetJointSpeed = function () {
        //b2Body* bA = this.m_bodyA;
        //b2Body* bB = this.m_bodyB;
        return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
    };
    /**
    * Is the joint limit enabled?
    */
    b2RevoluteJoint.prototype.IsLimitEnabled = function () {
        return this.m_enableLimit;
    };
    /**
    * Enable/disable the joint limit.
    */
    b2RevoluteJoint.prototype.EnableLimit = function (flag) {
        this.m_enableLimit = flag;
    };
    /**
    * Get the lower joint limit in radians.
    */
    b2RevoluteJoint.prototype.GetLowerLimit = function () {
        return this.m_lowerAngle;
    };
    /**
    * Get the upper joint limit in radians.
    */
    b2RevoluteJoint.prototype.GetUpperLimit = function () {
        return this.m_upperAngle;
    };
    /**
    * Set the joint limits in radians.
    */
    b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
        //b2Settings.b2Assert(lower <= upper);
        this.m_lowerAngle = lower;
        this.m_upperAngle = upper;
    };
    /**
    * Is the joint motor enabled?
    */
    b2RevoluteJoint.prototype.IsMotorEnabled = function () {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        return this.m_enableMotor;
    };
    /**
    * Enable/disable the joint motor.
    */
    b2RevoluteJoint.prototype.EnableMotor = function (flag) {
        this.m_enableMotor = flag;
    };
    /**
    * Set the motor speed in radians per second.
    */
    b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
        this.m_bodyA.SetAwake(true);
        this.m_bodyB.SetAwake(true);
        this.m_motorSpeed = speed;
    };
    /**
    * Get the motor speed in radians per second.
    */
    b2RevoluteJoint.prototype.GetMotorSpeed = function () {
        return this.m_motorSpeed;
    };
    /**
    * Set the maximum motor torque, usually in N-m.
    */
    b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
        this.m_maxMotorTorque = torque;
    };
    /**
    * Get the current motor torque, usually in N-m.
    */
    b2RevoluteJoint.prototype.GetMotorTorque = function () {
        return this.m_maxMotorTorque;
    };
    b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        var tX;
        if (this.m_enableMotor || this.m_enableLimit) {
            // You cannot create prismatic joint between bodies that
            // both have fixed rotation.
            //b2Settings.b2Assert(bA.m_invI > 0.0 || bB.m_invI > 0.0);
        }
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
        // J = [-I -r1_skew I r2_skew]
        // [ 0 -1 0 1]
        // r_skew = [-ry; rx]
        // Matlab
        // K = [ m1+r1y^2*i1+m2+r2y^2*i2, -r1y*i1*r1x-r2y*i2*r2x, -r1y*i1-r2y*i2]
        //     [ -r1y*i1*r1x-r2y*i2*r2x, m1+r1x^2*i1+m2+r2x^2*i2, r1x*i1+r2x*i2]
        //     [ -r1y*i1-r2y*i2, r1x*i1+r2x*i2, i1+i2]
        var m1 = bA.m_invMass;
        var m2 = bB.m_invMass;
        var i1 = bA.m_invI;
        var i2 = bB.m_invI;
        this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
        this.m_mass.col2.x = -r1Y * r1X * i1 - r2Y * r2X * i2;
        this.m_mass.col3.x = -r1Y * i1 - r2Y * i2;
        this.m_mass.col1.y = this.m_mass.col2.x;
        this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
        this.m_mass.col3.y = r1X * i1 + r2X * i2;
        this.m_mass.col1.z = this.m_mass.col3.x;
        this.m_mass.col2.z = this.m_mass.col3.y;
        this.m_mass.col3.z = i1 + i2;
        this.m_motorMass = 1.0 / (i1 + i2);
        if (this.m_enableMotor == false) {
            this.m_motorImpulse = 0.0;
        }
        if (this.m_enableLimit) {
            //float32 jointAngle = bB->m_sweep.a - bA->m_sweep.a - m_referenceAngle;
            var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
            if (b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
                this.m_limitState = b2Joint.e_equalLimits;
            }
            else if (jointAngle <= this.m_lowerAngle) {
                if (this.m_limitState != b2Joint.e_atLowerLimit) {
                    this.m_impulse.z = 0.0;
                }
                this.m_limitState = b2Joint.e_atLowerLimit;
            }
            else if (jointAngle >= this.m_upperAngle) {
                if (this.m_limitState != b2Joint.e_atUpperLimit) {
                    this.m_impulse.z = 0.0;
                }
                this.m_limitState = b2Joint.e_atUpperLimit;
            }
            else {
                this.m_limitState = b2Joint.e_inactiveLimit;
                this.m_impulse.z = 0.0;
            }
        }
        else {
            this.m_limitState = b2Joint.e_inactiveLimit;
        }
        // Warm starting.
        if (step.warmStarting) {
            //Scale impulses to support a variable time step
            this.m_impulse.x *= step.dtRatio;
            this.m_impulse.y *= step.dtRatio;
            this.m_motorImpulse *= step.dtRatio;
            var PX = this.m_impulse.x;
            var PY = this.m_impulse.y;
            //bA->m_linearVelocity -= m1 * P;
            bA.m_linearVelocity.x -= m1 * PX;
            bA.m_linearVelocity.y -= m1 * PY;
            //bA->m_angularVelocity -= i1 * (b2Cross(r1, P) + m_motorImpulse + m_impulse.z);
            bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
            //bB->m_linearVelocity += m2 * P;
            bB.m_linearVelocity.x += m2 * PX;
            bB.m_linearVelocity.y += m2 * PY;
            //bB->m_angularVelocity += i2 * (b2Cross(r2, P) + m_motorImpulse + m_impulse.z);
            bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
        }
        else {
            this.m_impulse.SetZero();
            this.m_motorImpulse = 0.0;
        }
    };
    b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var tMat;
        var tX;
        var newImpulse;
        var r1X;
        var r1Y;
        var r2X;
        var r2Y;
        var v1 = bA.m_linearVelocity;
        var w1 = bA.m_angularVelocity;
        var v2 = bB.m_linearVelocity;
        var w2 = bB.m_angularVelocity;
        var m1 = bA.m_invMass;
        var m2 = bB.m_invMass;
        var i1 = bA.m_invI;
        var i2 = bB.m_invI;
        // Solve motor constraint.
        if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
            var Cdot = w2 - w1 - this.m_motorSpeed;
            var impulse = this.m_motorMass * (-Cdot);
            var oldImpulse = this.m_motorImpulse;
            var maxImpulse = step.dt * this.m_maxMotorTorque;
            this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
            impulse = this.m_motorImpulse - oldImpulse;
            w1 -= i1 * impulse;
            w2 += i2 * impulse;
        }
        // Solve limit constraint.
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            //b2Vec2 r1 = b2Mul(bA->m_xf.R, m_localAnchor1 - bA->GetLocalCenter());
            tMat = bA.m_xf.R;
            r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 r2 = b2Mul(bB->m_xf.R, m_localAnchor2 - bB->GetLocalCenter());
            tMat = bB.m_xf.R;
            r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            // Solve point-to-point constraint
            //b2Vec2 Cdot1 = v2 + b2Cross(w2, r2) - v1 - b2Cross(w1, r1);
            var Cdot1X = v2.x + (-w2 * r2Y) - v1.x - (-w1 * r1Y);
            var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
            var Cdot2 = w2 - w1;
            this.m_mass.Solve33(this.impulse3, -Cdot1X, -Cdot1Y, -Cdot2);
            if (this.m_limitState == b2Joint.e_equalLimits) {
                this.m_impulse.Add(this.impulse3);
            }
            else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                newImpulse = this.m_impulse.z + this.impulse3.z;
                if (newImpulse < 0.0) {
                    this.m_mass.Solve22(this.reduced, -Cdot1X, -Cdot1Y);
                    this.impulse3.x = this.reduced.x;
                    this.impulse3.y = this.reduced.y;
                    this.impulse3.z = -this.m_impulse.z;
                    this.m_impulse.x += this.reduced.x;
                    this.m_impulse.y += this.reduced.y;
                    this.m_impulse.z = 0.0;
                }
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                newImpulse = this.m_impulse.z + this.impulse3.z;
                if (newImpulse > 0.0) {
                    this.m_mass.Solve22(this.reduced, -Cdot1X, -Cdot1Y);
                    this.impulse3.x = this.reduced.x;
                    this.impulse3.y = this.reduced.y;
                    this.impulse3.z = -this.m_impulse.z;
                    this.m_impulse.x += this.reduced.x;
                    this.m_impulse.y += this.reduced.y;
                    this.m_impulse.z = 0.0;
                }
            }
            v1.x -= m1 * this.impulse3.x;
            v1.y -= m1 * this.impulse3.y;
            w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
            v2.x += m2 * this.impulse3.x;
            v2.y += m2 * this.impulse3.y;
            w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
        }
        else {
            //b2Vec2 r1 = b2Mul(bA->m_xf.R, m_localAnchor1 - bA->GetLocalCenter());
            tMat = bA.m_xf.R;
            r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
            r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
            r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
            r1X = tX;
            //b2Vec2 r2 = b2Mul(bB->m_xf.R, m_localAnchor2 - bB->GetLocalCenter());
            tMat = bB.m_xf.R;
            r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
            r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
            tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
            r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
            r2X = tX;
            //b2Vec2 Cdot = v2 + b2Cross(w2, r2) - v1 - b2Cross(w1, r1);
            var CdotX = v2.x + (-w2 * r2Y) - v1.x - (-w1 * r1Y);
            var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
            this.m_mass.Solve22(this.impulse2, -CdotX, -CdotY);
            this.m_impulse.x += this.impulse2.x;
            this.m_impulse.y += this.impulse2.y;
            v1.x -= m1 * this.impulse2.x;
            v1.y -= m1 * this.impulse2.y;
            //w1 -= i1 * b2Cross(r1, impulse2);
            w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
            v2.x += m2 * this.impulse2.x;
            v2.y += m2 * this.impulse2.y;
            //w2 += i2 * b2Cross(r2, impulse2);
            w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
        }
        bA.m_linearVelocity.SetV(v1);
        bA.m_angularVelocity = w1;
        bB.m_linearVelocity.SetV(v2);
        bB.m_angularVelocity = w2;
    };
    b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
        // TODO_ERIN block solve with limit
        var oldLimitImpulse;
        var C;
        var tMat;
        var bA = this.m_bodyA;
        var bB = this.m_bodyB;
        var angularError = 0.0;
        var positionError = 0.0;
        var tX;
        var impulseX;
        var impulseY;
        // Solve angular limit constraint.
        if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
            var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
            var limitImpulse = 0.0;
            if (this.m_limitState == b2Joint.e_equalLimits) {
                // Prevent large angular corrections
                C = b2Math.Clamp(angle - this.m_lowerAngle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * C;
                angularError = b2Math.Abs(C);
            }
            else if (this.m_limitState == b2Joint.e_atLowerLimit) {
                C = angle - this.m_lowerAngle;
                angularError = -C;
                // Prevent large angular corrections and allow some slop.
                C = b2Math.Clamp(C + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0.0);
                limitImpulse = -this.m_motorMass * C;
            }
            else if (this.m_limitState == b2Joint.e_atUpperLimit) {
                C = angle - this.m_upperAngle;
                angularError = C;
                // Prevent large angular corrections and allow some slop.
                C = b2Math.Clamp(C - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
                limitImpulse = -this.m_motorMass * C;
            }
            bA.m_sweep.a -= bA.m_invI * limitImpulse;
            bB.m_sweep.a += bB.m_invI * limitImpulse;
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
        }
        // Solve point-to-point constraint
        {
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
            //b2Vec2 C = bB->m_sweep.c + r2 - bA->m_sweep.c - r1;
            var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
            var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
            var CLengthSquared = CX * CX + CY * CY;
            var CLength = Math.sqrt(CLengthSquared);
            positionError = CLength;
            var invMass1 = bA.m_invMass;
            var invMass2 = bB.m_invMass;
            var invI1 = bA.m_invI;
            var invI2 = bB.m_invI;
            //Handle large detachment.
            var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
            if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
                // Use a particle solution (no rotation)
                //b2Vec2 u = C; u.Normalize();
                var uX = CX / CLength;
                var uY = CY / CLength;
                var k = invMass1 + invMass2;
                //b2Settings.b2Assert(k>Number.MIN_VALUE)
                var m = 1.0 / k;
                impulseX = m * (-CX);
                impulseY = m * (-CY);
                var k_beta = 0.5;
                bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
                bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
                bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
                bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
                //C = bB->m_sweep.c + r2 - bA->m_sweep.c - r1;
                CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
                CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
            }
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
            //b2Vec2 impulse = K.Solve(-C);
            this.K.Solve(b2RevoluteJoint.tImpulse, -CX, -CY);
            impulseX = b2RevoluteJoint.tImpulse.x;
            impulseY = b2RevoluteJoint.tImpulse.y;
            //bA.m_sweep.c -= bA.m_invMass * impulse;
            bA.m_sweep.c.x -= bA.m_invMass * impulseX;
            bA.m_sweep.c.y -= bA.m_invMass * impulseY;
            //bA.m_sweep.a -= bA.m_invI * b2Cross(r1, impulse);
            bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
            //bB.m_sweep.c += bB.m_invMass * impulse;
            bB.m_sweep.c.x += bB.m_invMass * impulseX;
            bB.m_sweep.c.y += bB.m_invMass * impulseY;
            //bB.m_sweep.a += bB.m_invI * b2Cross(r2, impulse);
            bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
        }
        return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
    };
    b2RevoluteJoint.tImpulse = new b2Vec2();
    return b2RevoluteJoint;
}(b2Joint));
export { b2RevoluteJoint };
