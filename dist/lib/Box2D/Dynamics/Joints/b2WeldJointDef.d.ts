import { b2JointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2Body } from '../b2Body';
/**
 * Weld joint definition. You need to specify local anchor points
 * where they are attached and the relative body angle. The position
 * of the anchor points is important for computing the reaction torque.
 * @see b2WeldJoint
 */
export declare class b2WeldJointDef extends b2JointDef {
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
     * The body2 angle minus body1 angle in the reference state (radians).
     */
    referenceAngle: number;
}
//# sourceMappingURL=b2WeldJointDef.d.ts.map