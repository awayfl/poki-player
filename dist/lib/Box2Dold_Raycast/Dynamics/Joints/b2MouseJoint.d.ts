import { b2Joint, b2MouseJointDef } from '../Joints';
import { b2Vec2, b2Mat22 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
export declare class b2MouseJoint extends b2Joint {
    GetAnchor1(): b2Vec2;
    GetAnchor2(): b2Vec2;
    GetReactionForce(): b2Vec2;
    GetReactionTorque(): number;
    SetTarget(target: b2Vec2): void;
    constructor(def: b2MouseJointDef);
    private K;
    private K1;
    private K2;
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(): boolean;
    m_localAnchor: b2Vec2;
    m_target: b2Vec2;
    m_impulse: b2Vec2;
    m_mass: b2Mat22;
    m_C: b2Vec2;
    m_maxForce: number;
    m_beta: number;
    m_gamma: number;
}
//# sourceMappingURL=b2MouseJoint.d.ts.map