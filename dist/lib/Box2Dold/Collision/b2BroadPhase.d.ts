import { b2Bound } from './b2Bound';
import { b2Proxy } from './b2Proxy';
import { b2PairManager } from './b2PairManager';
import { b2Vec2 } from '../Common/Math';
import { b2AABB } from './b2AABB';
import { b2PairCallback } from './b2PairCallback';
import { b2BoundValues } from './b2BoundValues';
export declare class b2BroadPhase {
    constructor(worldAABB: b2AABB, callback: b2PairCallback);
    InRange(aabb: b2AABB): boolean;
    GetProxy(proxyId: number /** int */): b2Proxy;
    CreateProxy(aabb: b2AABB, userData: any): number /** uint */;
    DestroyProxy(proxyId: number /** uint */): void;
    MoveProxy(proxyId: number /** uint */, aabb: b2AABB): void;
    Commit(): void;
    QueryAABB(aabb: b2AABB, userData: any, maxCount: number /** int */): number /** int */;
    Validate(): void;
    private ComputeBounds;
    private TestOverlapValidate;
    TestOverlap(b: b2BoundValues, p: b2Proxy): boolean;
    private Query;
    private IncrementOverlapCount;
    private IncrementTimeStamp;
    m_pairManager: b2PairManager;
    m_proxyPool: b2Proxy[];
    m_freeProxy: number /** uint */;
    m_bounds: b2Bound[][];
    m_queryResults: number[];
    m_queryResultCount: number /** int */;
    m_worldAABB: b2AABB;
    m_quantizationFactor: b2Vec2;
    m_proxyCount: number /** int */;
    m_timeStamp: number /** uint */;
    static s_validate: boolean;
    static readonly b2_invalid: number /** uint */;
    static readonly b2_nullEdge: number /** uint */;
    static BinarySearch(bounds: b2Bound[], count: number /** int */, value: number /** uint */): number /** uint */;
}
//# sourceMappingURL=b2BroadPhase.d.ts.map