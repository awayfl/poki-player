import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef } from '../Joints';
/**
 * Friction joint defintion
 * @see b2FrictionJoint
 */
export declare class b2FrictionJointDef extends b2JointDef {
    constructor();
    /**
     * Initialize the bodies, anchors, axis, and reference angle using the world
     * anchor and world axis.
     */
    Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    /**
    * The local anchor point relative to bodyA's origin.
    */
    localAnchorA: b2Vec2;
    /**
    * The local anchor point relative to bodyB's origin.
    */
    localAnchorB: b2Vec2;
    /**
     * The maximun force in N.
     */
    maxForce: number;
    /**
     * The maximun friction torque in N-m
     */
    maxTorque: number;
}
//# sourceMappingURL=b2FrictionJointDef.d.ts.map