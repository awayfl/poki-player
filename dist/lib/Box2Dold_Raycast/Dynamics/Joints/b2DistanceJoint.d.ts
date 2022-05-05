import { b2Joint, b2DistanceJointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
export declare class b2DistanceJoint extends b2Joint {
    constructor(def: b2DistanceJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(): boolean;
    GetAnchor1(): b2Vec2;
    GetAnchor2(): b2Vec2;
    GetReactionForce(): b2Vec2;
    GetReactionTorque(): number;
    m_localAnchor1: b2Vec2;
    m_localAnchor2: b2Vec2;
    m_u: b2Vec2;
    m_frequencyHz: number;
    m_dampingRatio: number;
    m_gamma: number;
    m_bias: number;
    m_impulse: number;
    m_mass: number;
    m_length: number;
}
//# sourceMappingURL=b2DistanceJoint.d.ts.map