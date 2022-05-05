import { b2Vec2 } from '../../Common/Math';
import { b2Body } from '../b2Body';
import { b2JointEdge, b2JointDef } from '../Joints';
import { b2TimeStep } from '../b2TimeStep';
/**
* The base joint class. Joints are used to constraint two bodies together in
* various fashions. Some joints also feature limits and motors.
* @see b2JointDef
*/
export declare class b2Joint {
    /**
    * Get the type of the concrete joint.
    */
    GetType(): number /** int */;
    /**
    * Get the anchor point on bodyA in world coordinates.
    */
    GetAnchorA(): b2Vec2;
    /**
    * Get the anchor point on bodyB in world coordinates.
    */
    GetAnchorB(): b2Vec2;
    /**
    * Get the reaction force on body2 at the joint anchor in Newtons.
    */
    GetReactionForce(inv_dt: number): b2Vec2;
    /**
    * Get the reaction torque on body2 in N*m.
    */
    GetReactionTorque(inv_dt: number): number;
    /**
    * Get the first body attached to this joint.
    */
    GetBodyA(): b2Body;
    /**
    * Get the second body attached to this joint.
    */
    GetBodyB(): b2Body;
    /**
    * Get the next joint the world joint list.
    */
    GetNext(): b2Joint;
    /**
    * Get the user data pointer.
    */
    GetUserData(): any;
    /**
    * Set the user data pointer.
    */
    SetUserData(data: any): void;
    /**
     * Short-cut function to determine if either body is inactive.
     * @return
     */
    IsActive(): boolean;
    static Create(def: b2JointDef, allocator: any): b2Joint;
    static Destroy(joint: b2Joint, allocator: any): void;
    /** @private */
    constructor(def: b2JointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    FinalizeVelocityConstraints(): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    m_type: number /** int */;
    m_prev: b2Joint;
    m_next: b2Joint;
    m_edgeA: b2JointEdge;
    m_edgeB: b2JointEdge;
    m_bodyA: b2Body;
    m_bodyB: b2Body;
    m_islandFlag: boolean;
    m_collideConnected: boolean;
    private m_userData;
    m_localCenterA: b2Vec2;
    m_localCenterB: b2Vec2;
    m_invMassA: number;
    m_invMassB: number;
    m_invIA: number;
    m_invIB: number;
    static readonly e_unknownJoint: number /** int */;
    static readonly e_revoluteJoint: number /** int */;
    static readonly e_prismaticJoint: number /** int */;
    static readonly e_distanceJoint: number /** int */;
    static readonly e_pulleyJoint: number /** int */;
    static readonly e_mouseJoint: number /** int */;
    static readonly e_gearJoint: number /** int */;
    static readonly e_lineJoint: number /** int */;
    static readonly e_weldJoint: number /** int */;
    static readonly e_frictionJoint: number /** int */;
    static readonly e_inactiveLimit: number /** int */;
    static readonly e_atLowerLimit: number /** int */;
    static readonly e_atUpperLimit: number /** int */;
    static readonly e_equalLimits: number /** int */;
}
//# sourceMappingURL=b2Joint.d.ts.map