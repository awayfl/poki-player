import { b2JointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
/**
* Mouse joint definition. This requires a world target point,
* tuning parameters, and the time step.
* @see b2MouseJoint
*/
export declare class b2MouseJointDef extends b2JointDef {
    constructor();
    /**
    * The initial world target point. This is assumed
    * to coincide with the body anchor initially.
    */
    target: b2Vec2;
    /**
    * The maximum constraint force that can be exerted
    * to move the candidate body. Usually you will express
    * as some multiple of the weight (multiplier * mass * gravity).
    */
    maxForce: number;
    /**
    * The response speed.
    */
    frequencyHz: number;
    /**
    * The damping ratio. 0 = no damping, 1 = critical damping.
    */
    dampingRatio: number;
}
//# sourceMappingURL=b2MouseJointDef.d.ts.map