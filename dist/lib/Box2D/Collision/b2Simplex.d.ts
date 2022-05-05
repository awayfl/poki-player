import { b2DistanceProxy } from './b2DistanceProxy';
import { b2Transform, b2Vec2 } from '../Common/Math';
import { b2SimplexVertex } from './b2SimplexVertex';
import { b2SimplexCache } from './b2SimplexCache';
export declare class b2Simplex {
    __fast__: boolean;
    constructor();
    ReadCache(cache: b2SimplexCache, proxyA: b2DistanceProxy, transformA: b2Transform, proxyB: b2DistanceProxy, transformB: b2Transform): void;
    WriteCache(cache: b2SimplexCache): void;
    GetSearchDirection(): b2Vec2;
    GetClosestPoint(): b2Vec2;
    GetWitnessPoints(pA: b2Vec2, pB: b2Vec2): void;
    GetMetric(): number;
    Solve2(): void;
    Solve3(): void;
    m_v1: b2SimplexVertex;
    m_v2: b2SimplexVertex;
    m_v3: b2SimplexVertex;
    m_vertices: Array<b2SimplexVertex>;
    m_count: number /** int */;
}
//# sourceMappingURL=b2Simplex.d.ts.map