import { b2Vec2 } from '../Common/Math';
import { b2RayCastOutput } from './b2RayCastOutput';
import { b2RayCastInput } from './b2RayCastInput';
/**
* An axis aligned bounding box.
*/
export declare class b2AABB {
    readonly __fast__ = true;
    /**
    * Verify that the bounds are sorted.
    */
    IsValid(): boolean;
    /** Get the center of the AABB. */
    GetCenter(): b2Vec2;
    /** Get the extents of the AABB (half-widths). */
    GetExtents(): b2Vec2;
    /**
     * Is an AABB contained within this one.
     */
    Contains(aabb: b2AABB): boolean;
    /**
     * Perform a precise raycast against the AABB.
     */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
    /**
     * Tests if another AABB overlaps this one.
     */
    TestOverlap(other: b2AABB): boolean;
    /** Combine two AABBs into one. */
    static Combine(aabb1: b2AABB, aabb2: b2AABB): b2AABB;
    /** Combine two AABBs into one. */
    Combine(aabb1: b2AABB, aabb2: b2AABB): void;
    /** The lower vertex */
    lowerBound: b2Vec2;
    /** The upper vertex */
    upperBound: b2Vec2;
}
//# sourceMappingURL=b2AABB.d.ts.map