import { b2Shape } from '../../Collision/Shapes/b2Shape';
import { b2Vec2 } from '../../Common/Math';
import { b2ContactID } from '../../Collision/b2ContactID';
export declare class b2ContactResult {
    shape1: b2Shape;
    shape2: b2Shape;
    position: b2Vec2;
    normal: b2Vec2;
    normalImpulse: number;
    tangentImpulse: number;
    id: b2ContactID;
}
//# sourceMappingURL=b2ContactResult.d.ts.map