import { b2ManifoldPoint } from './b2ManifoldPoint';
import { b2Vec2 } from '../Common/Math';
export declare class b2Manifold {
    readonly __fast__ = true;
    constructor();
    Reset(): void;
    Set(m: b2Manifold): void;
    points: b2ManifoldPoint[];
    normal: b2Vec2;
    pointCount: number /** int */;
}
//# sourceMappingURL=b2Manifold.d.ts.map