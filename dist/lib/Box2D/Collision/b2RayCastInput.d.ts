import { b2Vec2 } from '../Common/Math';
/**
 * Specifies a segment for use with RayCast functions.
 */
export declare class b2RayCastInput {
    __fast__: boolean;
    constructor(p1?: b2Vec2, p2?: b2Vec2, maxFraction?: number);
    /**
     * The start point of the ray
     */
    p1: b2Vec2;
    /**
     * The end point of the ray
     */
    p2: b2Vec2;
    /**
     * Truncate the ray to reach up to this fraction from p1 to p2
     */
    maxFraction: number;
}
//# sourceMappingURL=b2RayCastInput.d.ts.map