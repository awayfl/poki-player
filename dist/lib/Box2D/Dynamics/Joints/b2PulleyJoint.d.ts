import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
import { b2Joint, b2PulleyJointDef } from '../Joints';
/**
* The pulley joint is connected to two bodies and two fixed ground points.
* The pulley supports a ratio such that:
* length1 + ratio * length2 <= constant
* Yes, the force transmitted is scaled by the ratio.
* The pulley also enforces a maximum length limit on both sides. This is
* useful to prevent one side of the pulley hitting the top.
* @see b2PulleyJointDef
*/
export declare class b2PulleyJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    /**
     * Get the first ground anchor.
     */
    GetGroundAnchorA(): b2Vec2;
    /**
     * Get the second ground anchor.
     */
    GetGroundAnchorB(): b2Vec2;
    /**
     * Get the current length of the segment attached to body1.
     */
    GetLength1(): number;
    /**
     * Get the current length of the segment attached to body2.
     */
    GetLength2(): number;
    /**
     * Get the pulley ratio.
     */
    GetRatio(): number;
    /** @private */
    constructor(def: b2PulleyJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_ground;
    private m_groundAnchor1;
    private m_groundAnchor2;
    private m_localAnchor1;
    private m_localAnchor2;
    private m_u1;
    private m_u2;
    private m_constant;
    private m_ratio;
    private m_maxLength1;
    private m_maxLength2;
    private m_pulleyMass;
    private m_limitMass1;
    private m_limitMass2;
    private m_impulse;
    private m_limitImpulse1;
    private m_limitImpulse2;
    private m_state;
    private m_limitState1;
    private m_limitState2;
    static readonly b2_minPulleyLength: number;
}
//# sourceMappingURL=b2PulleyJoint.d.ts.map