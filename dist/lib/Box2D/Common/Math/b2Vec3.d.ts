/**
* A 2D column vector with 3 elements.
*/
export declare class b2Vec3 {
    __fast__: boolean;
    /**
     * Construct using co-ordinates
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Sets this vector to all zeros
     */
    SetZero(): void;
    /**
     * Set this vector to some specified coordinates.
     */
    Set(x: number, y: number, z: number): void;
    SetV(v: b2Vec3): void;
    /**
     * Negate this vector
     */
    GetNegative(): b2Vec3;
    NegativeSelf(): void;
    Copy(): b2Vec3;
    Add(v: b2Vec3): void;
    Subtract(v: b2Vec3): void;
    Multiply(a: number): void;
    x: number;
    y: number;
    z: number;
}
//# sourceMappingURL=b2Vec3.d.ts.map