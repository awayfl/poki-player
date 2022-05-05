import { b2Vec2 } from '../../Common/Math';
export declare class b2Jacobian {
    linear1: b2Vec2;
    angular1: number;
    linear2: b2Vec2;
    angular2: number;
    SetZero(): void;
    Set(x1: b2Vec2, a1: number, x2: b2Vec2, a2: number): void;
    Compute(x1: b2Vec2, a1: number, x2: b2Vec2, a2: number): number;
}
//# sourceMappingURL=b2Jacobian.d.ts.map