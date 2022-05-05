/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { b2Pair } from '../b2Pair';
import { b2AABB } from '../b2AABB';
/// A shape is used for collision detection. Shapes are created in b2World.
/// You can use shape for collision detection before they are attached to the world.
/// @warning you cannot reuse shapes.
var b2Shape = /** @class */ (function () {
    function b2Shape(def) {
        this.__fast__ = true;
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_density = def.density;
        this.m_body = null;
        this.m_sweepRadius = 0.0;
        this.m_next = null;
        this.m_proxyId = b2Pair.b2_nullProxy;
        this.m_filter = def.filter.Copy();
        this.m_isSensor = def.isSensor;
    }
    /// Get the type of this shape. You can use this to down cast to the concrete shape.
    /// @return the shape type.
    b2Shape.prototype.GetType = function () {
        return this.m_type;
    };
    /// Is this shape a sensor (non-solid)?
    /// @return the true if the shape is a sensor.
    b2Shape.prototype.IsSensor = function () {
        return this.m_isSensor;
    };
    /// Set the contact filtering data. You must call b2World::Refilter to correct
    /// existing contacts/non-contacts.
    b2Shape.prototype.SetFilterData = function (filter) {
        this.m_filter = filter.Copy();
    };
    /// Get the contact filtering data.
    b2Shape.prototype.GetFilterData = function () {
        return this.m_filter.Copy();
    };
    /// Get the parent body of this shape. This is NULL if the shape is not attached.
    /// @return the parent body.
    b2Shape.prototype.GetBody = function () {
        return this.m_body;
    };
    /// Get the next shape in the parent body's shape list.
    /// @return the next shape.
    b2Shape.prototype.GetNext = function () {
        return this.m_next;
    };
    /// Get the user data that was assigned in the shape definition. Use this to
    /// store your application specific data.
    b2Shape.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /// Set the user data. Use this to store your application specific data.
    b2Shape.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    /// Test a point for containment in this shape. This only works for convex shapes.
    /// @param xf the shape world transform.
    /// @param p a point in world coordinates.
    b2Shape.prototype.TestPoint = function (xf, p) { return false; };
    /// Perform a ray cast against this shape.
    /// @param xf the shape world transform.
    /// @param lambda returns the hit fraction. You can use this to compute the contact point
    /// p = (1 - lambda) * segment.p1 + lambda * segment.p2.
    /// @param normal returns the normal at the contact point. If there is no intersection, the normal
    /// is not set.
    /// @param segment defines the begin and end point of the ray cast.
    /// @param maxLambda a number typically in the range [0,1].
    /// @return true if there was an intersection.
    b2Shape.prototype.TestSegment = function (xf, lambda, // float pointer
    normal, // pointer
    segment, maxLambda) { return b2Shape.e_missCollide; };
    /// Given a transform, compute the associated axis aligned bounding box for this shape.
    /// @param aabb returns the axis aligned box.
    /// @param xf the world transform of the shape.
    b2Shape.prototype.ComputeAABB = function (aabb, xf) { };
    /// Given two transforms, compute the associated swept axis aligned bounding box for this shape.
    /// @param aabb returns the axis aligned box.
    /// @param xf1 the starting shape world transform.
    /// @param xf2 the ending shape world transform.
    b2Shape.prototype.ComputeSweptAABB = function (aabb, xf1, xf2) { };
    /// Compute the mass properties of this shape using its dimensions and density.
    /// The inertia tensor is computed about the local origin, not the centroid.
    /// @param massData returns the mass data for this shape.
    b2Shape.prototype.ComputeMass = function (massData) { };
    /// Get the maximum radius about the parent body's center of mass.
    b2Shape.prototype.GetSweepRadius = function () {
        return this.m_sweepRadius;
    };
    /// Get the coefficient of friction.
    b2Shape.prototype.GetFriction = function () {
        return this.m_friction;
    };
    /// Get the coefficient of restitution.
    b2Shape.prototype.GetRestitution = function () {
        return this.m_restitution;
    };
    //--------------- Internals Below -------------------
    b2Shape.Destroy = function (shape, allocator) {
        /*switch (s.m_type)
        {
        case e_circleShape:
            //s->~b2Shape();
            //allocator->Free(s, sizeof(b2CircleShape));
            break;

        case e_polygonShape:
            //s->~b2Shape();
            //allocator->Free(s, sizeof(b2PolygonShape));
            break;

        default:
            //b2Settings.b2Assert(false);
        }*/
    };
    b2Shape.prototype.CreateProxy = function (broadPhase, transform) {
        //b2Settings.b2Assert(this.m_proxyId == b2_nullProxy);
        var aabb = b2Shape.s_proxyAABB;
        this.ComputeAABB(aabb, transform);
        var inRange = broadPhase.InRange(aabb);
        // You are creating a shape outside the world box.
        //b2Settings.b2Assert(inRange);
        if (inRange) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        }
        else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    };
    b2Shape.prototype.DestroyProxy = function (broadPhase) {
        if (this.m_proxyId != b2Pair.b2_nullProxy) {
            broadPhase.DestroyProxy(this.m_proxyId);
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    };
    //
    b2Shape.prototype.Synchronize = function (broadPhase, transform1, transform2) {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return false;
        }
        // Compute an AABB that covers the swept shape (may miss some rotation effect).
        var aabb = b2Shape.s_syncAABB;
        this.ComputeSweptAABB(aabb, transform1, transform2);
        if (broadPhase.InRange(aabb)) {
            broadPhase.MoveProxy(this.m_proxyId, aabb);
            return true;
        }
        else {
            return false;
        }
    };
    b2Shape.prototype.RefilterProxy = function (broadPhase, transform) {
        if (this.m_proxyId == b2Pair.b2_nullProxy) {
            return;
        }
        broadPhase.DestroyProxy(this.m_proxyId);
        var aabb = b2Shape.s_resetAABB;
        this.ComputeAABB(aabb, transform);
        var inRange = broadPhase.InRange(aabb);
        if (inRange) {
            this.m_proxyId = broadPhase.CreateProxy(aabb, this);
        }
        else {
            this.m_proxyId = b2Pair.b2_nullProxy;
        }
    };
    b2Shape.prototype.UpdateSweepRadius = function (center) { };
    //virtual ~b2Shape();
    //
    b2Shape.s_proxyAABB = new b2AABB();
    //
    b2Shape.s_syncAABB = new b2AABB();
    b2Shape.s_resetAABB = new b2AABB();
    /// The various collision shape types supported by Box2D.
    //enum b2ShapeType
    //{
    b2Shape.e_unknownShape = -1;
    b2Shape.e_circleShape = 0;
    b2Shape.e_polygonShape = 1;
    b2Shape.e_shapeTypeCount = 2;
    /// Possible return values for TestSegment
    b2Shape.e_hitCollide = 1;
    b2Shape.e_missCollide = 0;
    b2Shape.e_startsInsideCollide = -1;
    return b2Shape;
}());
export { b2Shape };
