import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Body } from '../b2Body';
import { b2Mat22, b2Vec2 } from '../../Common/Math';
import { b2ContactConstraintPoint } from '../Contacts';
/**
* @private
*/
export declare class b2ContactConstraint {
    constructor();
    points: Array<b2ContactConstraintPoint>;
    localPlaneNormal: b2Vec2;
    localPoint: b2Vec2;
    normal: b2Vec2;
    normalMass: b2Mat22;
    K: b2Mat22;
    bodyA: b2Body;
    bodyB: b2Body;
    type: number /** int */;
    radius: number;
    friction: number;
    restitution: number;
    pointCount: number /** int */;
    manifold: b2Manifold;
}
//# sourceMappingURL=b2ContactConstraint.d.ts.map