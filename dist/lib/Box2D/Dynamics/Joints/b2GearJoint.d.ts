import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
import { b2Joint, b2GearJointDef } from '../Joints';
/**
* A gear joint is used to connect two joints together. Either joint
* can be a revolute or prismatic joint. You specify a gear ratio
* to bind the motions together:
* coordinate1 + ratio * coordinate2 = constant
* The ratio can be negative or positive. If one joint is a revolute joint
* and the other joint is a prismatic joint, then the ratio will have units
* of length or units of 1/length.
* @warning The revolute and prismatic joints must be attached to
* fixed bodies (which must be body1 on those joints).
* @see b2GearJointDef
*/
export declare class b2GearJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    /**
     * Get the gear ratio.
     */
    GetRatio(): number;
    /**
     * Set the gear ratio.
     */
    SetRatio(ratio: number): void;
    /** @private */
    constructor(def: b2GearJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_ground1;
    private m_ground2;
    private m_revolute1;
    private m_prismatic1;
    private m_revolute2;
    private m_prismatic2;
    private m_groundAnchor1;
    private m_groundAnchor2;
    private m_localAnchor1;
    private m_localAnchor2;
    private m_J;
    private m_constant;
    private m_ratio;
    private m_mass;
    private m_impulse;
}
//# sourceMappingURL=b2GearJoint.d.ts.map