import { b2Body } from '../b2Body';
/**
* Joint definitions are used to construct joints.
* @see b2Joint
*/
export declare class b2JointDef {
    constructor();
    /**
    * The joint type is set automatically for concrete joint types.
    */
    type: number /** int */;
    /**
    * Use this to attach application specific data to your joints.
    */
    userData: any;
    /**
    * The first attached body.
    */
    bodyA: b2Body;
    /**
    * The second attached body.
    */
    bodyB: b2Body;
    /**
    * Set this flag to true if the attached bodies should collide.
    */
    collideConnected: boolean;
}
//# sourceMappingURL=b2JointDef.d.ts.map