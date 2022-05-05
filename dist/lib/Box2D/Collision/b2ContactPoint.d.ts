import { b2Shape } from './Shapes/b2Shape';
import { b2Vec2 } from '../Common/Math';
import { b2ContactID } from './b2ContactID';
/**
* This structure is used to report contact points.
*/
export declare class b2ContactPoint {
    readonly __fast__ = true;
    /** The first shape */
    shape1: b2Shape;
    /** The second shape */
    shape2: b2Shape;
    /** Position in world coordinates */
    position: b2Vec2;
    /** Velocity of point on body2 relative to point on body1 (pre-solver) */
    velocity: b2Vec2;
    /** Points from shape1 to shape2 */
    normal: b2Vec2;
    /** The separation is negative when shapes are touching */
    separation: number;
    /** The combined friction coefficient */
    friction: number;
    /** The combined restitution coefficient */
    restitution: number;
    /** The contact id identifies the features in contact */
    id: b2ContactID;
}
//# sourceMappingURL=b2ContactPoint.d.ts.map