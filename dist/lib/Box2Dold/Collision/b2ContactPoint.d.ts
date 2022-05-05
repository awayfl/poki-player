import { b2ContactID } from './b2ContactID';
import { b2Shape } from './Shapes/b2Shape';
import { b2Vec2 } from '../Common/Math';
export declare class b2ContactPoint {
    readonly __fast__ = true;
    shape1: b2Shape;
    shape2: b2Shape;
    position: b2Vec2;
    velocity: b2Vec2;
    normal: b2Vec2;
    separation: number;
    friction: number;
    restitution: number;
    id: b2ContactID;
}
//# sourceMappingURL=b2ContactPoint.d.ts.map