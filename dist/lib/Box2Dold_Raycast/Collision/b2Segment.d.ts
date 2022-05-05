import { b2Vec2 } from '../Common/Math';
import { b2AABB } from "./b2AABB";
export declare class b2Segment {
    TestSegment(lambda: number[], // float pointer
    normal: b2Vec2, // pointer
    segment: b2Segment, maxLambda: number): boolean;
    Extend(aabb: b2AABB): void;
    ExtendForward(aabb: b2AABB): void;
    ExtendBackward(aabb: b2AABB): void;
    p1: b2Vec2;
    p2: b2Vec2;
}
//# sourceMappingURL=b2Segment.d.ts.map