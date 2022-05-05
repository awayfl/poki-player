import { b2Shape } from './b2Shape';
import { b2XForm, b2Vec2 } from '../../Common/Math';
import { b2Segment } from '../b2Segment';
import { b2AABB } from '../b2AABB';
import { b2MassData } from './b2MassData';
import { b2ShapeDef } from './b2ShapeDef';
export declare class b2CircleShape extends b2Shape {
    TestPoint(transform: b2XForm, p: b2Vec2): boolean;
    TestSegment(transform: b2XForm, lambda: number[], // float pointer
    normal: b2Vec2, // pointer
    segment: b2Segment, maxLambda: number): boolean;
    ComputeAABB(aabb: b2AABB, transform: b2XForm): void;
    ComputeSweptAABB(aabb: b2AABB, transform1: b2XForm, transform2: b2XForm): void;
    ComputeMass(massData: b2MassData): void;
    GetLocalPosition(): b2Vec2;
    GetRadius(): number;
    constructor(def: b2ShapeDef);
    UpdateSweepRadius(center: b2Vec2): void;
    m_localPosition: b2Vec2;
    m_radius: number;
}
//# sourceMappingURL=b2CircleShape.d.ts.map