import { b2Joint, b2WeldJointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2TimeStep } from '../b2TimeStep';
/**
 * A weld joint essentially glues two bodies together. A weld joint may
 * distort somewhat because the island constraint solver is approximate.
 */
export declare class b2WeldJoint extends b2Joint {
    /** @inheritDoc */
    GetAnchorA(): b2Vec2;
    /** @inheritDoc */
    GetAnchorB(): b2Vec2;
    /** @inheritDoc */
    GetReactionForce(inv_dt: number): b2Vec2;
    /** @inheritDoc */
    GetReactionTorque(inv_dt: number): number;
    /** @private */
    constructor(def: b2WeldJointDef);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(step: b2TimeStep): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_localAnchorA;
    private m_localAnchorB;
    private m_referenceAngle;
    private m_impulse;
    private m_mass;
}
//# sourceMappingURL=b2WeldJoint.d.ts.map