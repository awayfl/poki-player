import { b2Vec2, b2Mat22, b2Transform } from '../Math';
/**
* @private
*/
export declare class b2Math {
    /**
    * This function is used to ensure that a floating point number is
    * not a NaN or infinity.
    */
    static IsValid(x: number): boolean;
    static Dot(a: b2Vec2, b: b2Vec2): number;
    static CrossVV(a: b2Vec2, b: b2Vec2): number;
    static CrossVF(a: b2Vec2, s: number): b2Vec2;
    static CrossFV(s: number, a: b2Vec2): b2Vec2;
    static MulMV(A: b2Mat22, v: b2Vec2): b2Vec2;
    static MulTMV(A: b2Mat22, v: b2Vec2): b2Vec2;
    static MulX(T: b2Transform, v: b2Vec2): b2Vec2;
    static MulXT(T: b2Transform, v: b2Vec2): b2Vec2;
    static AddVV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static SubtractVV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static Distance(a: b2Vec2, b: b2Vec2): Number;
    static DistanceSquared(a: b2Vec2, b: b2Vec2): Number;
    static MulFV(s: number, a: b2Vec2): b2Vec2;
    static AddMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static MulMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static MulTMM(A: b2Mat22, B: b2Mat22): b2Mat22;
    static Abs(a: number): number;
    static AbsV(a: b2Vec2): b2Vec2;
    static AbsM(A: b2Mat22): b2Mat22;
    static Min(a: number, b: number): number;
    static MinV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static Max(a: number, b: number): number;
    static MaxV(a: b2Vec2, b: b2Vec2): b2Vec2;
    static Clamp(a: number, low: number, high: number): number;
    static ClampV(a: b2Vec2, low: b2Vec2, high: b2Vec2): b2Vec2;
    static Swap(a: Array<any>, b: Array<any>): void;
    static Random(): number;
    static RandomRange(lo: number, hi: number): Number;
    static NextPowerOfTwo(x: number /** uint */): number /** uint */;
    static IsPowerOfTwo(x: number /** uint */): boolean;
    static readonly b2Vec2_zero: b2Vec2;
    static readonly b2Mat22_identity: b2Mat22;
    static readonly b2Transform_identity: b2Transform;
}
//# sourceMappingURL=b2Math.d.ts.map