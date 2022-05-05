import { b2Vec2 } from '../Math';
export declare class b2Mat22 {
    constructor(angle?: number, c1?: b2Vec2, c2?: b2Vec2);
    Set(angle: number): void;
    SetVV(c1: b2Vec2, c2: b2Vec2): void;
    Copy(): b2Mat22;
    SetM(m: b2Mat22): void;
    AddM(m: b2Mat22): void;
    SetIdentity(): void;
    SetZero(): void;
    GetAngle(): number;
    Invert(out: b2Mat22): b2Mat22;
    Solve(out: b2Vec2, bX: number, bY: number): b2Vec2;
    Abs(): void;
    col1: b2Vec2;
    col2: b2Vec2;
}
//# sourceMappingURL=b2Mat22.d.ts.map