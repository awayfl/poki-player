import { b2Vec2 } from '../../Common/Math';
import { b2JointDef, b2JointEdge } from '../Joints';
import { b2TimeStep } from '../b2TimeStep';
import { b2Body } from '../b2Body';
export declare class b2Joint {
    readonly __fast__ = true;
    GetType(): number /** int */;
    GetAnchor1(): b2Vec2;
    GetAnchor2(): b2Vec2;
    GetReactionForce(): b2Vec2;
    GetReactionTorque(): number;
    GetBody1(): b2Body;
    GetBody2(): b2Body;
    GetNext(): b2Joint;
    GetUserData(): any;
    SetUserData(data: any): void;
    static Create(def: b2JointDef, allocator: any): b2Joint;
    static Destroy(joint: b2Joint, allocator: any): void;
    constructor(def: b2JointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    InitPositionConstraints(): void;
    SolvePositionConstraints(): boolean;
    m_type: number /** int */;
    m_prev: b2Joint;
    m_next: b2Joint;
    m_node1: b2JointEdge;
    m_node2: b2JointEdge;
    m_body1: b2Body;
    m_body2: b2Body;
    m_inv_dt: number;
    m_islandFlag: boolean;
    m_collideConnected: boolean;
    m_userData: any;
    static readonly e_unknownJoint: number /** int */;
    static readonly e_revoluteJoint: number /** int */;
    static readonly e_prismaticJoint: number /** int */;
    static readonly e_distanceJoint: number /** int */;
    static readonly e_pulleyJoint: number /** int */;
    static readonly e_mouseJoint: number /** int */;
    static readonly e_gearJoint: number /** int */;
    static readonly e_inactiveLimit: number /** int */;
    static readonly e_atLowerLimit: number /** int */;
    static readonly e_atUpperLimit: number /** int */;
    static readonly e_equalLimits: number /** int */;
}
//# sourceMappingURL=b2Joint.d.ts.map