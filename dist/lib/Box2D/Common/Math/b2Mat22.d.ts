import { b2Vec2 } from '../Math';
/**
* A 2-by-2 matrix. Stored in column-major order.
*/
export declare class b2Mat22 {
    readonly __fast__ = true;
    constructor();
    static FromAngle(angle: number): b2Mat22;
    static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
    Set(angle: number): void;
    SetVV(c1: b2Vec2, c2: b2Vec2): void;
    Copy(): b2Mat22;
    SetM(m: b2Mat22): void;
    AddM(m: b2Mat22): void;
    SetIdentity(): void;
    SetZero(): void;
    GetAngle(): number;
    /**
     * Compute the inverse of this matrix, such that inv(A) * A = identity.
     */
    GetInverse(out: b2Mat22): b2Mat22;
    Solve(out: b2Vec2, bX: number, bY: number): b2Vec2;
    Abs(): void;
    col1: b2Vec2;
    col2: b2Vec2;
}
//# sourceMappingURL=b2Mat22.d.ts.map