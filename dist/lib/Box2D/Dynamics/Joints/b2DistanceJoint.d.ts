import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
import { b2Joint, b2DistanceJointDef } from '../Joints';
/**
* A distance joint constrains two points on two bodies
* to remain at a fixed distance from each other. You can view
* this as a massless, rigid rod.
* @see b2DistanceJointDef
*/
export declare class b2DistanceJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    GetLength(): number;
    SetLength(length: number): void;
    GetFrequency(): number;
    SetFrequency(hz: number): void;
    GetDampingRatio(): number;
    SetDampingRatio(ratio: number): void;
    /** @private */
    constructor(def: b2DistanceJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_localAnchor1;
    private m_localAnchor2;
    private m_u;
    private m_frequencyHz;
    private m_dampingRatio;
    private m_gamma;
    private m_bias;
    private m_impulse;
    private m_mass;
    private m_length;
}
//# sourceMappingURL=b2DistanceJoint.d.ts.map