import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
import { b2Joint, b2PrismaticJointDef } from '../Joints';
/**
* A prismatic joint. This joint provides one degree of freedom: translation
* along an axis fixed in body1. Relative rotation is prevented. You can
* use a joint limit to restrict the range of motion and a joint motor to
* drive the motion or to model joint friction.
* @see b2PrismaticJointDef
*/
export declare class b2PrismaticJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    /**
    * Get the current joint translation, usually in meters.
    */
    GetJointTranslation(): number;
    /**
    * Get the current joint translation speed, usually in meters per second.
    */
    GetJointSpeed(): number;
    /**
    * Is the joint limit enabled?
    */
    IsLimitEnabled(): Boolean;
    /**
    * Enable/disable the joint limit.
    */
    EnableLimit(flag: boolean): void;
    /**
    * Get the lower joint limit, usually in meters.
    */
    GetLowerLimit(): number;
    /**
    * Get the upper joint limit, usually in meters.
    */
    GetUpperLimit(): number;
    /**
    * Set the joint limits, usually in meters.
    */
    SetLimits(lower: number, upper: number): void;
    /**
    * Is the joint motor enabled?
    */
    IsMotorEnabled(): Boolean;
    /**
    * Enable/disable the joint motor.
    */
    EnableMotor(flag: boolean): void;
    /**
    * Set the motor speed, usually in meters per second.
    */
    SetMotorSpeed(speed: number): void;
    /**
    * Get the motor speed, usually in meters per second.
    */
    GetMotorSpeed(): number;
    /**
    * Set the maximum motor force, usually in N.
    */
    SetMaxMotorForce(force: number): void;
    /**
    * Get the current motor force, usually in N.
    */
    GetMotorForce(): number;
    /** @private */
    constructor(def: b2PrismaticJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    m_localAnchor1: b2Vec2;
    m_localAnchor2: b2Vec2;
    m_localXAxis1: b2Vec2;
    private m_localYAxis1;
    private m_refAngle;
    private m_axis;
    private m_perp;
    private m_s1;
    private m_s2;
    private m_a1;
    private m_a2;
    private m_K;
    private m_impulse;
    private m_motorMass;
    private m_motorImpulse;
    private m_lowerTranslation;
    private m_upperTranslation;
    private m_maxMotorForce;
    private m_motorSpeed;
    private m_enableLimit;
    private m_enableMotor;
    private m_limitState;
}
//# sourceMappingURL=b2PrismaticJoint.d.ts.map