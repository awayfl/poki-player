import { b2Vec2, b2Transform } from '../../Common/Math';
import { b2AABB } from '../../Collision/b2AABB';
import { b2RayCastOutput } from '../b2RayCastOutput';
import { b2RayCastInput } from '../b2RayCastInput';
import { b2MassData } from './b2MassData';
/**
* A shape is used for collision detection. Shapes are created in b2Body.
* You can use shape for collision detection before they are attached to the world.
* @warning you cannot reuse shapes.
*/
export declare class b2Shape {
    __fast__: boolean;
    /**
     * Clone the shape
     */
    Copy(): b2Shape;
    /**
     * Assign the properties of anther shape to this
     */
    Set(other: b2Shape): void;
    /**
    * Get the type of this shape. You can use this to down cast to the concrete shape.
    * @return the shape type.
    */
    GetType(): number /** int */;
    /**
    * Test a point for containment in this shape. This only works for convex shapes.
    * @param xf the shape world transform.
    * @param p a point in world coordinates.
    */
    TestPoint(xf: b2Transform, p: b2Vec2): boolean;
    /**
     * Cast a ray against this shape.
     * @param output the ray-cast results.
     * @param input the ray-cast input parameters.
     * @param transform the transform to be applied to the shape.
     */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform): boolean;
    /**
    * Given a transform, compute the associated axis aligned bounding box for this shape.
    * @param aabb returns the axis aligned box.
    * @param xf the world transform of the shape.
    */
    ComputeAABB(aabb: b2AABB, xf: b2Transform): void;
    /**
    * Compute the mass properties of this shape using its dimensions and density.
    * The inertia tensor is computed about the local origin, not the centroid.
    * @param massData returns the mass data for this shape.
    */
    ComputeMass(massData: b2MassData, density: number): void;
    /**
     * Compute the volume and centroid of this shape intersected with a half plane
     * @param normal the surface normal
     * @param offset the surface offset along normal
     * @param xf the shape transform
     * @param c returns the centroid
     * @return the total volume less than offset along normal
     */
    ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
    static TestOverlap(shape1: b2Shape, transform1: b2Transform, shape2: b2Shape, transform2: b2Transform): boolean;
    /**
     * @private
     */
    constructor();
    m_type: number /** int */;
    m_radius: number;
    /**
    * The various collision shape types supported by Box2D.
    */
    static readonly e_unknownShape: number /** int */;
    static readonly e_circleShape: number /** int */;
    static readonly e_polygonShape: number /** int */;
    static readonly e_edgeShape: number /** int */;
    static readonly e_shapeTypeCount: number /** int */;
    /**
     * Possible return values for TestSegment
     */
    /** Return value for TestSegment indicating a hit. */
    static readonly e_hitCollide: number /** int */;
    /** Return value for TestSegment indicating a miss. */
    static readonly e_missCollide: number /** int */;
    /** Return value for TestSegment indicating that the segment starting point, p1, is already inside the shape. */
    static readonly e_startsInsideCollide: number /** int */;
}
//# sourceMappingURL=b2Shape.d.ts.map