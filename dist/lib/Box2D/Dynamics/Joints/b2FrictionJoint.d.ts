import { b2Vec2, b2Mat22 } from '../../Common/Math';
import { b2Joint, b2FrictionJointDef } from '../Joints';
import { b2TimeStep } from '../b2TimeStep';
/**
 * Friction joint. This is used for top-down friction.
 * It provides 2D translational friction and angular friction.
 * @see b2FrictionJointDef
 */
export declare class b2FrictionJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    SetMaxForce(force: number): void;
    GetMaxForce(): number;
    SetMaxTorque(torque: number): void;
    GetMaxTorque(): number;
    /** @private */
    constructor(def: b2FrictionJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_localAnchorA;
    private m_localAnchorB;
    m_linearMass: b2Mat22;
    m_angularMass: number;
    private m_linearImpulse;
    private m_angularImpulse;
    private m_maxForce;
    private m_maxTorque;
}
//# sourceMappingURL=b2FrictionJoint.d.ts.map