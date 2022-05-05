import { b2Joint, b2RevoluteJointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
/**
* A revolute joint constrains to bodies to share a common point while they
* are free to rotate about the point. The relative rotation about the shared
* point is the joint angle. You can limit the relative rotation with
* a joint limit that specifies a lower and upper angle. You can use a motor
* to drive the relative rotation about the shared point. A maximum motor torque
* is provided so that infinite forces are not generated.
* @see b2RevoluteJointDef
*/
export declare class b2RevoluteJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    /**
    * Get the current joint angle in radians.
    */
    GetJointAngle(): number;
    /**
    * Get the current joint angle speed in radians per second.
    */
    GetJointSpeed(): number;
    /**
    * Is the joint limit enabled?
    */
    IsLimitEnabled(): boolean;
    /**
    * Enable/disable the joint limit.
    */
    EnableLimit(flag: boolean): void;
    /**
    * Get the lower joint limit in radians.
    */
    GetLowerLimit(): number;
    /**
    * Get the upper joint limit in radians.
    */
    GetUpperLimit(): number;
    /**
    * Set the joint limits in radians.
    */
    SetLimits(lower: number, upper: number): void;
    /**
    * Is the joint motor enabled?
    */
    IsMotorEnabled(): boolean;
    /**
    * Enable/disable the joint motor.
    */
    EnableMotor(flag: boolean): void;
    /**
    * Set the motor speed in radians per second.
    */
    SetMotorSpeed(speed: number): void;
    /**
    * Get the motor speed in radians per second.
    */
    GetMotorSpeed(): number;
    /**
    * Set the maximum motor torque, usually in N-m.
    */
    SetMaxMotorTorque(torque: number): void;
    /**
    * Get the current motor torque, usually in N-m.
    */
    GetMotorTorque(): number;
    /** @private */
    constructor(def: b2RevoluteJointDef);
    private K;
    private K1;
    private K2;
    private K3;
    InitVelocityConstraints(step: b2TimeStep): void;
    private impulse3;
    private impulse2;
    private reduced;
    SolveVelocityConstraints(step: b2TimeStep): void;
    private static tImpulse;
    SolvePositionConstraints(baumgarte: number): boolean;
    m_localAnchor1: b2Vec2;
    m_localAnchor2: b2Vec2;
    private m_impulse;
    private m_motorImpulse;
    private m_mass;
    private m_motorMass;
    private m_enableMotor;
    private m_maxMotorTorque;
    private m_motorSpeed;
    private m_enableLimit;
    private m_referenceAngle;
    private m_lowerAngle;
    private m_upperAngle;
    private m_limitState;
}
//# sourceMappingURL=b2RevoluteJoint.d.ts.map