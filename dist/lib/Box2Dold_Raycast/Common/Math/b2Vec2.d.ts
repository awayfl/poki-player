import { b2Mat22 } from '../Math';
export declare class b2Vec2 {
    __fast__: boolean;
    constructor(x_?: number, y_?: number);
    toString(): String;
    SetZero(): void;
    Set(x_?: number, y_?: number): void;
    SetV(v: b2Vec2): void;
    Negative(): b2Vec2;
    static Make(x_: number, y_: number): b2Vec2;
    Copy(): b2Vec2;
    Add(v: b2Vec2): void;
    Subtract(v: b2Vec2): void;
    Multiply(a: number): void;
    MulM(A: b2Mat22): void;
    MulTM(A: b2Mat22): void;
    CrossVF(s: number): void;
    CrossFV(s: number): void;
    MinV(b: b2Vec2): void;
    MaxV(b: b2Vec2): void;
    Abs(): void;
    Length(): number;
    LengthSquared(): number;
    Normalize(): number;
    IsValid(): boolean;
    x: number;
    y: number;
}
//# sourceMappingURL=b2Vec2.d.ts.map