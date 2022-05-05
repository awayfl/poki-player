import { b2ContactID } from './b2ContactID';
import { b2Vec2 } from '../Common/Math';
export declare class b2ManifoldPoint {
    Reset(): void;
    Set(m: b2ManifoldPoint): void;
    localPoint1: b2Vec2;
    localPoint2: b2Vec2;
    separation: number;
    normalImpulse: number;
    tangentImpulse: number;
    id: b2ContactID;
}
//# sourceMappingURL=b2ManifoldPoint.d.ts.map