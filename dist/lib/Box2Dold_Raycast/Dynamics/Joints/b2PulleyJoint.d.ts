import { b2Joint, b2PulleyJointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2Body } from '../b2Body';
import { b2TimeStep } from '../b2TimeStep';
export declare class b2PulleyJoint extends b2Joint {
    GetAnchor1(): b2Vec2;
    GetAnchor2(): b2Vec2;
    GetReactionForce(): b2Vec2;
    GetReactionTorque(): number;
    GetGroundAnchor1(): b2Vec2;
    GetGroundAnchor2(): b2Vec2;
    GetLength1(): number;
    GetLength2(): number;
    GetRatio(): number;
    constructor(def: b2PulleyJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(): boolean;
    m_ground: b2Body;
    m_groundAnchor1: b2Vec2;
    m_groundAnchor2: b2Vec2;
    m_localAnchor1: b2Vec2;
    m_localAnchor2: b2Vec2;
    m_u1: b2Vec2;
    m_u2: b2Vec2;
    m_constant: number;
    m_ratio: number;
    m_maxLength1: number;
    m_maxLength2: number;
    m_pulleyMass: number;
    m_limitMass1: number;
    m_limitMass2: number;
    m_force: number;
    m_limitForce1: number;
    m_limitForce2: number;
    m_positionImpulse: number;
    m_limitPositionImpulse1: number;
    m_limitPositionImpulse2: number;
    m_state: number /** int */;
    m_limitState1: number /** int */;
    m_limitState2: number /** int */;
    static readonly b2_minPulleyLength: number;
}
//# sourceMappingURL=b2PulleyJoint.d.ts.map