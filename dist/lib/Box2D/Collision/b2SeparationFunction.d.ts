import { b2SimplexCache } from './b2SimplexCache';
import { b2DistanceProxy } from './b2DistanceProxy';
import { b2Transform, b2Vec2 } from '../Common/Math';
export declare class b2SeparationFunction {
    static readonly e_points: number /** int */;
    static readonly e_faceA: number /** int */;
    static readonly e_faceB: number /** int */;
    Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, transformA: b2Transform, proxyB: b2DistanceProxy, transformB: b2Transform): void;
    Evaluate(transformA: b2Transform, transformB: b2Transform): number;
    m_proxyA: b2DistanceProxy;
    m_proxyB: b2DistanceProxy;
    m_type: number /** int */;
    m_localPoint: b2Vec2;
    m_axis: b2Vec2;
}
//# sourceMappingURL=b2SeparationFunction.d.ts.map