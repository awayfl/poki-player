import { b2Vec2, b2Mat22, b2XForm } from '../Math';
export declare class b2Math {
    static b2IsValid(x: number): boolean;
    static b2Dot(a: b2Vec2, b: b2Vec2): number;
    static b2CrossVV(a: b2Vec2, b: b2Vec2): number;
    static b2CrossVF(a: b2Vec2, s: number): b2Vec2;
    static b2CrossFV(s: number, a: b2Vec2): b2Vec2;
    static b2MulMV(A: b2Mat22, v: b2Vec2): b2Vec2;
    static b2MulTMV(A: b2Mat22, v: b2Vec2): b2Vec2;
    static b2MulX(T: b2XForm, v: b2Vec2): b2Vec2;
    static b2MulXT(T: b2XForm, v: b2Vec2): b2Vec2;
    static AddVV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static SubtractVV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static b2Distance(a: b2Vec2, b: b2Vec2): number;
    static b2DistanceSquared(a: b2Vec2, b: b2Vec2): number;
    static MulFV(s: number, a: b2Vec2): b2Vec2;
    static AddMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static b2MulMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static b2MulTMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static b2Abs(a: number): number;
    static b2AbsV(a: b2Vec2): b2Vec2;
    static b2AbsM(A: b2Mat22): b2Mat22;
    static b2Min(a: number, b: number): number;
    static b2MinV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static b2Max(a: number, b: number): number;
    static b2MaxV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static b2Clamp(a: number, low: number, high: number): number;
    static b2ClampV(a: b2Vec2, low: b2Vec2, high: b2Vec2): b2Vec2;
    static b2Swap(a: any[], b: any[]): void;
    static b2Random(): number;
    static b2RandomRange(lo: number, hi: number): number;
    static b2NextPowerOfTwo(x: number /** uint */): number /** uint */;
    static b2IsPowerOfTwo(x: number /** uint */): boolean;
    static readonly b2Vec2_zero: b2Vec2;
    static readonly b2Mat22_identity: b2Mat22;
    static readonly b2XForm_identity: b2XForm;
}
//# sourceMappingURL=b2Math.d.ts.map