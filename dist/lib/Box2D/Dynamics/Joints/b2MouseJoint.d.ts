import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
import { b2Joint, b2MouseJointDef } from '../Joints';
/**
* A mouse joint is used to make a point on a body track a
* specified world point. This a soft constraint with a maximum
* force. This allows the constraint to stretch and without
* applying huge forces.
* Note: this joint is not fully documented as it is intended primarily
* for the testbed. See that for more instructions.
* @see b2MouseJointDef
*/
export declare class b2MouseJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    GetTarget(): b2Vec2;
    /**
     * Use this to update the target point.
     */
    SetTarget(target: b2Vec2): void;
    GetMaxForce(): number;
    SetMaxForce(maxForce: number): void;
    GetFrequency(): number;
    SetFrequency(hz: number): void;
    GetDampingRatio(): number;
    SetDampingRatio(ratio: number): void;
    /** @private */
    constructor(def: b2MouseJointDef);
    private K;
    private K1;
    private K2;
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_localAnchor;
    private m_target;
    private m_impulse;
    private m_mass;
    private m_C;
    private m_maxForce;
    private m_frequencyHz;
    private m_dampingRatio;
    private m_beta;
    private m_gamma;
}
//# sourceMappingURL=b2MouseJoint.d.ts.map