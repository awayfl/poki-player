import { b2DistanceInput } from '../b2DistanceInput';
import { b2DistanceProxy } from '../b2DistanceProxy';
import { b2SimplexCache } from '../b2SimplexCache';
import { b2DistanceOutput } from '../b2DistanceOutput';
import { b2Distance } from '../b2Distance';
import { b2Settings } from '../../Common/b2Settings';
/**
* A shape is used for collision detection. Shapes are created in b2Body.
* You can use shape for collision detection before they are attached to the world.
* @warning you cannot reuse shapes.
*/
var b2Shape = /** @class */ (function () {
    //--------------- Internals Below -------------------
    /**
     * @private
     */
    function b2Shape() {
        this.__fast__ = true;
        this.m_type = b2Shape.e_unknownShape;
        this.m_radius = b2Settings.b2_linearSlop;
    }
    /**
     * Clone the shape
     */
    b2Shape.prototype.Copy = function () {
        //var s:b2Shape = new b2Shape();
        //s.Set(this);
        //return s;
        return null; // Abstract type
    };
    /**
     * Assign the properties of anther shape to this
     */
    b2Shape.prototype.Set = function (other) {
        //Don't copy m_type?
        //m_type = other.m_type;
        this.m_radius = other.m_radius;
    };
    /**
    * Get the type of this shape. You can use this to down cast to the concrete shape.
    * @return the shape type.
    */
    b2Shape.prototype.GetType = function () {
        return this.m_type;
    };
    /**
    * Test a point for containment in this shape. This only works for convex shapes.
    * @param xf the shape world transform.
    * @param p a point in world coordinates.
    */
    b2Shape.prototype.TestPoint = function (xf, p) { return false; };
    /**
     * Cast a ray against this shape.
     * @param output the ray-cast results.
     * @param input the ray-cast input parameters.
     * @param transform the transform to be applied to the shape.
     */
    b2Shape.prototype.RayCast = function (output, input, transform) {
        return false;
    };
    /**
    * Given a transform, compute the associated axis aligned bounding box for this shape.
    * @param aabb returns the axis aligned box.
    * @param xf the world transform of the shape.
    */
    b2Shape.prototype.ComputeAABB = function (aabb, xf) { };
    /**
    * Compute the mass properties of this shape using its dimensions and density.
    * The inertia tensor is computed about the local origin, not the centroid.
    * @param massData returns the mass data for this shape.
    */
    b2Shape.prototype.ComputeMass = function (massData, density) { };
    /**
     * Compute the volume and centroid of this shape intersected with a half plane
     * @param normal the surface normal
     * @param offset the surface offset along normal
     * @param xf the shape transform
     * @param c returns the centroid
     * @return the total volume less than offset along normal
     */
    b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) { return 0; };
    b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
        var input = new b2DistanceInput();
        input.proxyA = new b2DistanceProxy();
        input.proxyA.Set(shape1);
        input.proxyB = new b2DistanceProxy();
        input.proxyB.Set(shape2);
        input.transformA = transform1;
        input.transformB = transform2;
        input.useRadii = true;
        var simplexCache = new b2SimplexCache();
        simplexCache.count = 0;
        var output = new b2DistanceOutput();
        b2Distance.Distance(output, simplexCache, input);
        return output.distance < 10.0 * Number.MIN_VALUE;
    };
    /**
    * The various collision shape types supported by Box2D.
    */
    //enum b2ShapeType
    //{
    b2Shape.e_unknownShape = -1;
    b2Shape.e_circleShape = 0;
    b2Shape.e_polygonShape = 1;
    b2Shape.e_edgeShape = 2;
    b2Shape.e_shapeTypeCount = 3;
    //};
    /**
     * Possible return values for TestSegment
     */
    /** Return value for TestSegment indicating a hit. */
    b2Shape.e_hitCollide = 1;
    /** Return value for TestSegment indicating a miss. */
    b2Shape.e_missCollide = 0;
    /** Return value for TestSegment indicating that the segment starting point, p1, is already inside the shape. */
    b2Shape.e_startsInsideCollide = -1;
    return b2Shape;
}());
export { b2Shape };
