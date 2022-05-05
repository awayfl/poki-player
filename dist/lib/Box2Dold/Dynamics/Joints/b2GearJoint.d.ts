import { b2Joint, b2GearJointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2Body } from '../b2Body';
import { b2TimeStep } from '../b2TimeStep';
import { b2Jacobian } from './b2Jacobian';
import { b2RevoluteJoint } from './b2RevoluteJoint';
import { b2PrismaticJoint } from './b2PrismaticJoint';
export declare class b2GearJoint extends b2Joint {
    GetAnchor1(): b2Vec2;
    GetAnchor2(): b2Vec2;
    GetReactionForce(): b2Vec2;
    GetReactionTorque(): number;
    GetRatio(): number;
    constructor(def: b2GearJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(): boolean;
    m_ground1: b2Body;
    m_ground2: b2Body;
    m_revolute1: b2RevoluteJoint;
    m_prismatic1: b2PrismaticJoint;
    m_revolute2: b2RevoluteJoint;
    m_prismatic2: b2PrismaticJoint;
    m_groundAnchor1: b2Vec2;
    m_groundAnchor2: b2Vec2;
    m_localAnchor1: b2Vec2;
    m_localAnchor2: b2Vec2;
    m_J: b2Jacobian;
    m_constant: number;
    m_ratio: number;
    m_mass: number;
    m_force: number;
}
//# sourceMappingURL=b2GearJoint.d.ts.map