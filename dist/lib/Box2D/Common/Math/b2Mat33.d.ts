import { b2Vec3, b2Vec2 } from '../Math';
/**
* A 3-by-3 matrix. Stored in column-major order.
*/
export declare class b2Mat33 {
    constructor(c1?: b2Vec3, c2?: b2Vec3, c3?: b2Vec3);
    SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): void;
    Copy(): b2Mat33;
    SetM(m: b2Mat33): void;
    AddM(m: b2Mat33): void;
    SetIdentity(): void;
    SetZero(): void;
    Solve22(out: b2Vec2, bX: number, bY: number): b2Vec2;
    Solve33(out: b2Vec3, bX: number, bY: number, bZ: number): b2Vec3;
    col1: b2Vec3;
    col2: b2Vec3;
    col3: b2Vec3;
}
//# sourceMappingURL=b2Mat33.d.ts.map