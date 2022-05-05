import { b2JointDef, b2Joint } from '../Joints';
/**
* Gear joint definition. This definition requires two existing
* revolute or prismatic joints (any combination will work).
* The provided joints must attach a dynamic body to a static body.
* @see b2GearJoint
*/
export declare class b2GearJointDef extends b2JointDef {
    constructor();
    /**
    * The first revolute/prismatic joint attached to the gear joint.
    */
    joint1: b2Joint;
    /**
    * The second revolute/prismatic joint attached to the gear joint.
    */
    joint2: b2Joint;
    /**
    * The gear ratio.
    * @see b2GearJoint for explanation.
    */
    ratio: number;
}
//# sourceMappingURL=b2GearJointDef.d.ts.map