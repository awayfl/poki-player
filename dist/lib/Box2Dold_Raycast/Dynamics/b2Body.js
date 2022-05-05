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
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2MassData } from '../Collision/Shapes/b2MassData';
import { b2XForm, b2Sweep, b2Vec2, b2Math } from '../Common/Math';
import { b2CircleShape } from '../Collision/Shapes/b2CircleShape';
import { b2PolygonShape } from '../Collision/Shapes/b2PolygonShape';
/// A rigid body.
var b2Body = /** @class */ (function () {
    //--------------- Internals Below -------------------
    // Constructor
    function b2Body(bd, world) {
        //b2Settings.b2Assert(world.m_lock == false);
        this.__fast__ = true;
        this.m_xf = new b2XForm(); // the body origin transform
        this.m_sweep = new b2Sweep(); // the swept motion for CCD
        this.m_linearVelocity = new b2Vec2();
        this.m_force = new b2Vec2();
        this.m_flags = 0;
        if (bd.isBullet) {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        if (bd.fixedRotation) {
            this.m_flags |= b2Body.e_fixedRotationFlag;
        }
        if (bd.allowSleep) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        if (bd.isSleeping) {
            this.m_flags |= b2Body.e_sleepFlag;
        }
        this.m_world = world;
        this.m_xf.position.SetV(bd.position);
        this.m_xf.R.Set(bd.angle);
        this.m_sweep.localCenter.SetV(bd.massData.center);
        this.m_sweep.t0 = 1.0;
        this.m_sweep.a0 = this.m_sweep.a = bd.angle;
        //this.m_sweep.c0 = this.m_sweep.c = b2Mul(this.m_xf, this.m_sweep.localCenter);
        //b2MulMV(this.m_xf.R, this.m_sweep.localCenter);
        var tMat = this.m_xf.R;
        var tVec = this.m_sweep.localCenter;
        // (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
        this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        // (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
        this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //return T.position + b2Mul(T.R, v);
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        //this.m_sweep.c0 = this.m_sweep.c
        this.m_sweep.c0.SetV(this.m_sweep.c);
        this.m_jointList = null;
        this.m_contactList = null;
        this.m_prev = null;
        this.m_next = null;
        this.m_linearDamping = bd.linearDamping;
        this.m_angularDamping = bd.angularDamping;
        this.m_force.Set(0.0, 0.0);
        this.m_torque = 0.0;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0.0;
        this.m_sleepTime = 0.0;
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_mass = bd.massData.mass;
        if (this.m_mass > 0.0) {
            this.m_invMass = 1.0 / this.m_mass;
        }
        if ((this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            this.m_I = bd.massData.I;
        }
        if (this.m_I > 0.0) {
            this.m_invI = 1.0 / this.m_I;
        }
        if (this.m_invMass == 0.0 && this.m_invI == 0.0) {
            this.m_type = b2Body.e_staticType;
        }
        else {
            this.m_type = b2Body.e_dynamicType;
        }
        this.m_userData = bd.userData;
        this.m_shapeList = null;
        this.m_shapeCount = 0;
    }
    /// Creates a shape and attach it to this body.
    /// @param shapeDef the shape definition.
    /// @warning This function is locked during callbacks.
    b2Body.prototype.CreateShape = function (def) {
        //b2Settings.b2Assert(this.m_world.m_lock == false);
        if (this.m_world.m_lock == true) {
            return null;
        }
        var s;
        switch (def.type) {
            case b2Shape.e_circleShape:
                {
                    //void* mem = allocator->Allocate(sizeof(b2CircleShape));
                    s = new b2CircleShape(def);
                    break;
                }
            case b2Shape.e_polygonShape:
                {
                    //void* mem = allocator->Allocate(sizeof(b2PolygonShape));
                    s = new b2PolygonShape(def);
                    break;
                }
        }
        s.m_next = this.m_shapeList;
        this.m_shapeList = s;
        ++this.m_shapeCount;
        s.m_body = this;
        // Add the shape to the world's broad-phase.
        s.CreateProxy(this.m_world.m_broadPhase, this.m_xf);
        // Compute the sweep radius for CCD.
        s.UpdateSweepRadius(this.m_sweep.localCenter);
        return s;
    };
    /// Destroy a shape. This removes the shape from the broad-phase and
    /// therefore destroys any contacts associated with this shape. All shapes
    /// attached to a body are implicitly destroyed when the body is destroyed.
    /// @param shape the shape to be removed.
    /// @warning This function is locked during callbacks.
    b2Body.prototype.DestroyShape = function (s) {
        //b2Settings.b2Assert(this.m_world.m_lock == false);
        if (this.m_world.m_lock == true) {
            return;
        }
        //b2Settings.b2Assert(s.m_body == this);
        s.DestroyProxy(this.m_world.m_broadPhase);
        //b2Settings.b2Assert(this.m_shapeCount > 0);
        //b2Shape** node = &this.m_shapeList;
        var node = this.m_shapeList;
        var ppS = null; // Fix pointer-pointer stuff
        var found = false;
        while (node != null) {
            if (node == s) {
                if (ppS)
                    ppS.m_next = s.m_next;
                else
                    this.m_shapeList = s.m_next;
                //node = s.m_next;
                found = true;
                break;
            }
            ppS = node;
            node = node.m_next;
        }
        // You tried to remove a shape that is not attached to this body.
        //b2Settings.b2Assert(found);
        s.m_body = null;
        s.m_next = null;
        --this.m_shapeCount;
        b2Shape.Destroy(s, this.m_world.m_blockAllocator);
    };
    /// Set the mass properties. Note that this changes the center of mass position.
    /// If you are not sure how to compute mass properties, use SetMassFromShapes.
    /// The inertia tensor is assumed to be relative to the center of mass.
    /// @param massData the mass properties.
    b2Body.prototype.SetMass = function (massData) {
        var s;
        //b2Settings.b2Assert(this.m_world.m_lock == false);
        if (this.m_world.m_lock == true) {
            return;
        }
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_mass = massData.mass;
        if (this.m_mass > 0.0) {
            this.m_invMass = 1.0 / this.m_mass;
        }
        if ((this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            this.m_I = massData.I;
        }
        if (this.m_I > 0.0) {
            this.m_invI = 1.0 / this.m_I;
        }
        // Move center of mass.
        this.m_sweep.localCenter.SetV(massData.center);
        //this.m_sweep.c0 = this.m_sweep.c = b2Mul(this.m_xf, this.m_sweep.localCenter);
        //b2MulMV(this.m_xf.R, this.m_sweep.localCenter);
        var tMat = this.m_xf.R;
        var tVec = this.m_sweep.localCenter;
        // (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
        this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        // (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
        this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //return T.position + b2Mul(T.R, v);
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        //this.m_sweep.c0 = this.m_sweep.c
        this.m_sweep.c0.SetV(this.m_sweep.c);
        // Update the sweep radii of all child shapes.
        for (s = this.m_shapeList; s; s = s.m_next) {
            s.UpdateSweepRadius(this.m_sweep.localCenter);
        }
        var oldType = this.m_type;
        if (this.m_invMass == 0.0 && this.m_invI == 0.0) {
            this.m_type = b2Body.e_staticType;
        }
        else {
            this.m_type = b2Body.e_dynamicType;
        }
        // If the body type changed, we need to refilter the broad-phase proxies.
        if (oldType != this.m_type) {
            for (s = this.m_shapeList; s; s = s.m_next) {
                s.RefilterProxy(this.m_world.m_broadPhase, this.m_xf);
            }
        }
    };
    b2Body.prototype.SetMassFromShapes = function () {
        var s;
        //b2Settings.b2Assert(this.m_world.m_lock == false);
        if (this.m_world.m_lock == true) {
            return;
        }
        // Compute mass data from shapes. Each shape has its own density.
        this.m_mass = 0.0;
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        //b2Vec2 center = b2Vec2_zero;
        var centerX = 0.0;
        var centerY = 0.0;
        var massData = b2Body.s_massData;
        for (s = this.m_shapeList; s; s = s.m_next) {
            s.ComputeMass(massData);
            if (massData.mass < 1e-10)
                continue; // CHRIS EDIT: if mass is 0, center gets set to NaN
            this.m_mass += massData.mass;
            //center += massData.mass * massData.center;
            centerX += massData.mass * massData.center.x;
            centerY += massData.mass * massData.center.y;
            this.m_I += massData.I;
        }
        // Compute center of mass, and shift the origin to the COM.
        if (this.m_mass > 0.0) {
            this.m_invMass = 1.0 / this.m_mass;
            centerX *= this.m_invMass;
            centerY *= this.m_invMass;
        }
        if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            // Center the inertia about the center of mass.
            //this.m_I -= this.m_mass * b2Dot(center, center);
            this.m_I -= this.m_mass * (centerX * centerX + centerY * centerY);
            //b2Settings.b2Assert(this.m_I > 0.0);
            this.m_invI = 1.0 / this.m_I;
        }
        else {
            this.m_I = 0.0;
            this.m_invI = 0.0;
        }
        // Move center of mass.
        this.m_sweep.localCenter.Set(centerX, centerY);
        //this.m_sweep.c0 = this.m_sweep.c = b2Mul(this.m_xf, this.m_sweep.localCenter);
        //b2MulMV(this.m_xf.R, this.m_sweep.localCenter);
        var tMat = this.m_xf.R;
        var tVec = this.m_sweep.localCenter;
        // (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
        this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        // (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
        this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //return T.position + b2Mul(T.R, v);
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        //this.m_sweep.c0 = this.m_sweep.c
        this.m_sweep.c0.SetV(this.m_sweep.c);
        // Update the sweep radii of all child shapes.
        for (s = this.m_shapeList; s; s = s.m_next) {
            s.UpdateSweepRadius(this.m_sweep.localCenter);
        }
        var oldType = this.m_type;
        if (this.m_invMass == 0.0 && this.m_invI == 0.0) {
            this.m_type = b2Body.e_staticType;
        }
        else {
            this.m_type = b2Body.e_dynamicType;
        }
        // If the body type changed, we need to refilter the broad-phase proxies.
        if (oldType != this.m_type) {
            for (s = this.m_shapeList; s; s = s.m_next) {
                s.RefilterProxy(this.m_world.m_broadPhase, this.m_xf);
            }
        }
    };
    /// Set the position of the body's origin and rotation (radians).
    /// This breaks any contacts and wakes the other bodies.
    /// @param position the new world position of the body's origin (not necessarily
    /// the center of mass).
    /// @param angle the new world rotation angle of the body in radians.
    /// @return false if the movement put a shape outside the world. In this case the
    /// body is automatically frozen.
    b2Body.prototype.SetXForm = function (position, angle) {
        var s;
        //b2Settings.b2Assert(this.m_world.m_lock == false);
        if (this.m_world.m_lock == true) {
            return true;
        }
        if (this.IsFrozen()) {
            return false;
        }
        this.m_xf.R.Set(angle);
        this.m_xf.position.SetV(position);
        //this.m_sweep.c0 = this.m_sweep.c = b2Mul(this.m_xf, this.m_sweep.localCenter);
        //b2MulMV(this.m_xf.R, this.m_sweep.localCenter);
        var tMat = this.m_xf.R;
        var tVec = this.m_sweep.localCenter;
        // (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
        this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        // (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
        this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        //return T.position + b2Mul(T.R, v);
        this.m_sweep.c.x += this.m_xf.position.x;
        this.m_sweep.c.y += this.m_xf.position.y;
        //this.m_sweep.c0 = this.m_sweep.c
        this.m_sweep.c0.SetV(this.m_sweep.c);
        this.m_sweep.a0 = this.m_sweep.a = angle;
        var freeze = false;
        for (s = this.m_shapeList; s; s = s.m_next) {
            var inRange = s.Synchronize(this.m_world.m_broadPhase, this.m_xf, this.m_xf);
            if (inRange == false) {
                freeze = true;
                break;
            }
        }
        if (freeze == true) {
            this.m_flags |= b2Body.e_frozenFlag;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
            for (s = this.m_shapeList; s; s = s.m_next) {
                s.DestroyProxy(this.m_world.m_broadPhase);
            }
            // Failure
            return false;
        }
        // Success
        this.m_world.m_broadPhase.Commit();
        return true;
    };
    /// Get the body transform for the body's origin.
    /// @return the world transform of the body's origin.
    b2Body.prototype.GetXForm = function () {
        return this.m_xf;
    };
    /// Get the world body origin position.
    /// @return the world position of the body's origin.
    b2Body.prototype.GetPosition = function () {
        return this.m_xf.position;
    };
    /// Get the angle in radians.
    /// @return the current world rotation angle in radians.
    b2Body.prototype.GetAngle = function () {
        return this.m_sweep.a;
    };
    /// Get the world position of the center of mass.
    b2Body.prototype.GetWorldCenter = function () {
        return this.m_sweep.c;
    };
    /// Get the local position of the center of mass.
    b2Body.prototype.GetLocalCenter = function () {
        return this.m_sweep.localCenter;
    };
    /// Set the linear velocity of the center of mass.
    /// @param v the new linear velocity of the center of mass.
    b2Body.prototype.SetLinearVelocity = function (v) {
        this.m_linearVelocity.SetV(v);
    };
    /// Get the linear velocity of the center of mass.
    /// @return the linear velocity of the center of mass.
    b2Body.prototype.GetLinearVelocity = function () {
        return this.m_linearVelocity;
    };
    /// Set the angular velocity.
    /// @param omega the new angular velocity in radians/second.
    b2Body.prototype.SetAngularVelocity = function (omega) {
        this.m_angularVelocity = omega;
    };
    /// Get the angular velocity.
    /// @return the angular velocity in radians/second.
    b2Body.prototype.GetAngularVelocity = function () {
        return this.m_angularVelocity;
    };
    /// Apply a force at a world point. If the force is not
    /// applied at the center of mass, it will generate a torque and
    /// affect the angular velocity. This wakes up the body.
    /// @param force the world force vector, usually in Newtons (N).
    /// @param point the world position of the point of application.
    b2Body.prototype.ApplyForce = function (force, point) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        //this.m_force += force;
        this.m_force.x += force.x;
        this.m_force.y += force.y;
        //this.m_torque += b2Cross(point - this.m_sweep.c, force);
        this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
    };
    /// Apply a torque. This affects the angular velocity
    /// without affecting the linear velocity of the center of mass.
    /// This wakes up the body.
    /// @param torque about the z-axis (out of the screen), usually in N-m.
    b2Body.prototype.ApplyTorque = function (torque) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        this.m_torque += torque;
    };
    /// Apply an impulse at a point. This immediately modifies the velocity.
    /// It also modifies the angular velocity if the point of application
    /// is not at the center of mass. This wakes up the body.
    /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
    /// @param point the world position of the point of application.
    b2Body.prototype.ApplyImpulse = function (impulse, point) {
        if (this.IsSleeping()) {
            this.WakeUp();
        }
        //this.m_linearVelocity += this.m_invMass * impulse;
        this.m_linearVelocity.x += this.m_invMass * impulse.x;
        this.m_linearVelocity.y += this.m_invMass * impulse.y;
        //this.m_angularVelocity += this.m_invI * b2Cross(point - this.m_sweep.c, impulse);
        this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
    };
    /// Get the total mass of the body.
    /// @return the mass, usually in kilograms (kg).
    b2Body.prototype.GetMass = function () {
        return this.m_mass;
    };
    /// Get the central rotational inertia of the body.
    /// @return the rotational inertia, usually in kg-m^2.
    b2Body.prototype.GetInertia = function () {
        return this.m_I;
    };
    /// Get the world coordinates of a point given the local coordinates.
    /// @param localPoint a point on the body measured relative the the body's origin.
    /// @return the same point expressed in world coordinates.
    b2Body.prototype.GetWorldPoint = function (localPoint) {
        //return b2Math.b2MulX(this.m_xf, localPoint);
        var A = this.m_xf.R;
        var u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
        u.x += this.m_xf.position.x;
        u.y += this.m_xf.position.y;
        return u;
    };
    /// Get the world coordinates of a vector given the local coordinates.
    /// @param localVector a vector fixed in the body.
    /// @return the same vector expressed in world coordinates.
    b2Body.prototype.GetWorldVector = function (localVector) {
        return b2Math.b2MulMV(this.m_xf.R, localVector);
    };
    /// Gets a local point relative to the body's origin given a world point.
    /// @param a point in world coordinates.
    /// @return the corresponding local point relative to the body's origin.
    b2Body.prototype.GetLocalPoint = function (worldPoint) {
        return b2Math.b2MulXT(this.m_xf, worldPoint);
    };
    /// Gets a local vector given a world vector.
    /// @param a vector in world coordinates.
    /// @return the corresponding local vector.
    b2Body.prototype.GetLocalVector = function (worldVector) {
        return b2Math.b2MulTMV(this.m_xf.R, worldVector);
    };
    /// Get the world linear velocity of a world point attached to this body.
    /// @param a point in world coordinates.
    /// @return the world velocity of a point.
    b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
        //return          this.m_linearVelocity   + b2Cross(this.m_angularVelocity,   worldPoint   - this.m_sweep.c);
        return new b2Vec2(this.m_linearVelocity.x + this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y - this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
    };
    /// Get the world velocity of a local point.
    /// @param a point in local coordinates.
    /// @return the world velocity of a point.
    b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
        //return GetLinearVelocityFromWorldPoint(GetWorldPoint(localPoint));
        var A = this.m_xf.R;
        var worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
        worldPoint.x += this.m_xf.position.x;
        worldPoint.y += this.m_xf.position.y;
        return new b2Vec2(this.m_linearVelocity.x + this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y - this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
    };
    /// Is this body treated like a bullet for continuous collision detection?
    b2Body.prototype.IsBullet = function () {
        return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
    };
    /// Should this body be treated like a bullet for continuous collision detection?
    b2Body.prototype.SetBullet = function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        else {
            this.m_flags &= ~b2Body.e_bulletFlag;
        }
    };
    /// Is this body static (immovable)?
    b2Body.prototype.IsStatic = function () {
        return this.m_type == b2Body.e_staticType;
    };
    /// Is this body dynamic (movable)?
    b2Body.prototype.IsDynamic = function () {
        return this.m_type == b2Body.e_dynamicType;
    };
    /// Is this body frozen?
    b2Body.prototype.IsFrozen = function () {
        return (this.m_flags & b2Body.e_frozenFlag) == b2Body.e_frozenFlag;
    };
    /// Is this body sleeping (not simulating).
    b2Body.prototype.IsSleeping = function () {
        return (this.m_flags & b2Body.e_sleepFlag) == b2Body.e_sleepFlag;
    };
    /// You can disable sleeping on this body.
    b2Body.prototype.AllowSleeping = function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        else {
            this.m_flags &= ~b2Body.e_allowSleepFlag;
            this.WakeUp();
        }
    };
    /// Wake up this body so it will begin simulating.
    b2Body.prototype.WakeUp = function () {
        this.m_flags &= ~b2Body.e_sleepFlag;
        this.m_sleepTime = 0.0;
    };
    /// Put this body to sleep so it will stop simulating.
    /// This also sets the velocity to zero.
    b2Body.prototype.PutToSleep = function () {
        this.m_flags |= b2Body.e_sleepFlag;
        this.m_sleepTime = 0.0;
        this.m_linearVelocity.SetZero();
        this.m_angularVelocity = 0.0;
        this.m_force.SetZero();
        this.m_torque = 0.0;
    };
    /// Get the list of all shapes attached to this body.
    b2Body.prototype.GetShapeList = function () {
        return this.m_shapeList;
    };
    /// Get the list of all joints attached to this body.
    b2Body.prototype.GetJointList = function () {
        return this.m_jointList;
    };
    /// Get the next body in the world's body list.
    b2Body.prototype.GetNext = function () {
        return this.m_next;
    };
    /// Get the user data pointer that was provided in the body definition.
    b2Body.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /// Set the user data. Use this to store your application specific data.
    b2Body.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    /// Get the parent world of this body.
    b2Body.prototype.GetWorld = function () {
        return this.m_world;
    };
    //
    b2Body.prototype.SynchronizeShapes = function () {
        var xf1 = b2Body.s_xf1;
        xf1.R.Set(this.m_sweep.a0);
        //xf1.position = this.m_sweep.c0 - b2Mul(xf1.R, this.m_sweep.localCenter);
        var tMat = xf1.R;
        var tVec = this.m_sweep.localCenter;
        xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        var s;
        var inRange = true;
        for (s = this.m_shapeList; s; s = s.m_next) {
            inRange = s.Synchronize(this.m_world.m_broadPhase, xf1, this.m_xf);
            if (inRange == false) {
                break;
            }
        }
        if (inRange == false) {
            this.m_flags |= b2Body.e_frozenFlag;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
            for (s = this.m_shapeList; s; s = s.m_next) {
                s.DestroyProxy(this.m_world.m_broadPhase);
            }
            // Failure
            return false;
        }
        // Success
        return true;
    };
    b2Body.prototype.SynchronizeTransform = function () {
        this.m_xf.R.Set(this.m_sweep.a);
        //this.m_xf.position = this.m_sweep.c - b2Mul(this.m_xf.R, this.m_sweep.localCenter);
        var tMat = this.m_xf.R;
        var tVec = this.m_sweep.localCenter;
        this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
    };
    // This is used to prevent connected bodies from colliding.
    // It may lie, depending on the collideConnected flag.
    b2Body.prototype.IsConnected = function (other) {
        for (var jn = this.m_jointList; jn; jn = jn.next) {
            if (jn.other == other)
                return jn.joint.m_collideConnected == false;
        }
        return false;
    };
    b2Body.prototype.Advance = function (t) {
        // Advance to the new safe time.
        this.m_sweep.Advance(t);
        this.m_sweep.c.SetV(this.m_sweep.c0);
        this.m_sweep.a = this.m_sweep.a0;
        this.SynchronizeTransform();
    };
    /// Compute the mass properties from the attached shapes. You typically call this
    /// after adding all the shapes. If you add or remove shapes later, you may want
    /// to call this again. Note that this changes the center of mass position.
    b2Body.s_massData = new b2MassData();
    // Destructor
    //~b2Body();
    //
    b2Body.s_xf1 = new b2XForm();
    // this.m_flags
    //enum
    //{
    b2Body.e_frozenFlag = 0x0002;
    b2Body.e_islandFlag = 0x0004;
    b2Body.e_sleepFlag = 0x0008;
    b2Body.e_allowSleepFlag = 0x0010;
    b2Body.e_bulletFlag = 0x0020;
    b2Body.e_fixedRotationFlag = 0x0040;
    //};
    // this.m_type
    //enum
    //{
    b2Body.e_staticType = 1;
    b2Body.e_dynamicType = 2;
    b2Body.e_maxTypes = 3;
    return b2Body;
}());
export { b2Body };
