import { b2Vec2 } from '../../Common/Math';
/**
* @private
*/
export declare class b2Jacobian {
    linearA: b2Vec2;
    angularA: number;
    linearB: b2Vec2;
    angularB: number;
    SetZero(): void;
    Set(x1: b2Vec2, a1: number, x2: b2Vec2, a2: number): void;
    Compute(x1: b2Vec2, a1: number, x2: b2Vec2, a2: number): number;
}
//# sourceMappingURL=b2Jacobian.d.ts.map