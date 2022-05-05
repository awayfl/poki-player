import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
import { b2JointDef } from '../Joints';
/**
* Pulley joint definition. This requires two ground anchors,
* two dynamic body anchor points, max lengths for each side,
* and a pulley ratio.
* @see b2PulleyJoint
*/
export declare class b2PulleyJointDef extends b2JointDef {
    constructor();
    Initialize(bA: b2Body, bB: b2Body, gaA: b2Vec2, gaB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, r: number): void;
    /**
    * The first ground anchor in world coordinates. This point never moves.
    */
    groundAnchorA: b2Vec2;
    /**
    * The second ground anchor in world coordinates. This point never moves.
    */
    groundAnchorB: b2Vec2;
    /**
    * The local anchor point relative to bodyA's origin.
    */
    localAnchorA: b2Vec2;
    /**
    * The local anchor point relative to bodyB's origin.
    */
    localAnchorB: b2Vec2;
    /**
    * The a reference length for the segment attached to bodyA.
    */
    lengthA: number;
    /**
    * The maximum length of the segment attached to bodyA.
    */
    maxLengthA: number;
    /**
    * The a reference length for the segment attached to bodyB.
    */
    lengthB: number;
    /**
    * The maximum length of the segment attached to bodyB.
    */
    maxLengthB: number;
    /**
    * The pulley ratio, used to simulate a block-and-tackle.
    */
    ratio: number;
}
//# sourceMappingURL=b2PulleyJointDef.d.ts.map