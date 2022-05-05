import { b2ContactConstraintPoint } from './b2ContactConstraintPoint';
import { b2Vec2 } from '../../Common/Math';
import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Body } from '../b2Body';
export declare class b2ContactConstraint {
    constructor();
    points: b2ContactConstraintPoint[];
    normal: b2Vec2;
    manifold: b2Manifold;
    body1: b2Body;
    body2: b2Body;
    friction: number;
    restitution: number;
    pointCount: number /** int */;
}
//# sourceMappingURL=b2ContactConstraint.d.ts.map