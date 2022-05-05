import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef } from '../Joints';
/**
* Distance joint definition. This requires defining an
* anchor point on both bodies and the non-zero length of the
* distance joint. The definition uses local anchor points
* so that the initial configuration can violate the constraint
* slightly. This helps when saving and loading a game.
* @warning Do not use a zero or short length.
* @see b2DistanceJoint
*/
export declare class b2DistanceJointDef extends b2JointDef {
    constructor();
    /**
    * Initialize the bodies, anchors, and length using the world
    * anchors.
    */
    Initialize(bA: b2Body, bB: b2Body, anchorA: b2Vec2, anchorB: b2Vec2): void;
    /**
    * The local anchor point relative to body1's origin.
    */
    localAnchorA: b2Vec2;
    /**
    * The local anchor point relative to body2's origin.
    */
    localAnchorB: b2Vec2;
    /**
    * The natural length between the anchor points.
    */
    length: number;
    /**
    * The mass-spring-damper frequency in Hertz.
    */
    frequencyHz: number;
    /**
    * The damping ratio. 0 = no damping, 1 = critical damping.
    */
    dampingRatio: number;
}
//# sourceMappingURL=b2DistanceJointDef.d.ts.map