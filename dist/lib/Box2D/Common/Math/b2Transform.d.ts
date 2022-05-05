import { b2Vec2, b2Mat22 } from '../Math';
/**
* A transform contains translation and rotation. It is used to represent
* the position and orientation of rigid frames.
*/
export declare class b2Transform {
    readonly __fast__ = true;
    /**
    * The default constructor does nothing (for performance).
    */
    constructor(pos?: b2Vec2, r?: b2Mat22);
    /**
    * Initialize using a position vector and a rotation matrix.
    */
    Initialize(pos: b2Vec2, r: b2Mat22): void;
    /**
    * Set this to the identity transform.
    */
    SetIdentity(): void;
    Set(x: b2Transform): void;
    /**
     * Calculate the angle that the rotation matrix represents.
     */
    GetAngle(): number;
    position: b2Vec2;
    R: b2Mat22;
}
//# sourceMappingURL=b2Transform.d.ts.map