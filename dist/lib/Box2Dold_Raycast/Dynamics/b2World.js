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
//import { ASArray, ASClass } from '@awayfl/avm2';
import { b2AABB } from '../Collision/b2AABB';
import { b2Vec2, b2XForm, b2Math } from '../Common/Math';
import { b2ContactFilter } from './b2ContactFilter';
import { b2BodyDef } from './b2BodyDef';
import { b2BroadPhase } from '../Collision/b2BroadPhase';
import { b2ContactListener } from './b2ContactListener';
import { b2DebugDraw } from './b2DebugDraw';
import { b2Body } from './b2Body';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2Joint } from './Joints';
import { b2TimeStep } from './b2TimeStep';
import { b2Island } from './b2Island';
import { b2Contact } from './Contacts/b2Contact';
import { b2Settings } from '../Common/b2Settings';
import { b2TimeOfImpact } from '../Collision/b2TimeOfImpact';
import { b2Color } from '../Common/b2Color';
import { b2Pair } from '../Collision/b2Pair';
import { b2ContactManager } from './b2ContactManager';
var b2World = /** @class */ (function () {
    // Construct a world object.
    /// @param worldAABB a bounding box that completely encompasses all your shapes.
    /// @param gravity the world gravity vector.
    /// @param doSleep improve performance by not simulating inactive bodies.
    function b2World(worldAABB, gravity, doSleep) {
        var _this = this;
        this.__fast__ = true;
        this.m_raycastNormal = new b2Vec2();
        this.RaycastSortKey = function (shape) {
            if (_this.m_contactFilter && !_this.m_contactFilter.RayCollide(_this.m_raycastUserData, shape))
                return -1;
            var body = shape.GetBody();
            var xf = body.GetXForm();
            var lambda = [0];
            if (shape.TestSegment(xf, lambda, _this.m_raycastNormal, _this.m_raycastSegment, 1) == b2Shape.e_missCollide)
                return -1;
            return lambda[0];
        };
        this.RaycastSortKey2 = function (shape) {
            if (_this.m_contactFilter && !_this.m_contactFilter.RayCollide(_this.m_raycastUserData, shape))
                return -1;
            var body = shape.GetBody();
            var xf = body.GetXForm();
            var lambda = [0];
            if (shape.TestSegment(xf, lambda, _this.m_raycastNormal, _this.m_raycastSegment, 1) != b2Shape.e_hitCollide)
                return -1;
            return lambda[0];
        };
        this.m_contactManager = new b2ContactManager();
        this.m_destructionListener = null;
        this.m_boundaryListener = null;
        this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
        this.m_contactListener = null;
        this.m_debugDraw = null;
        this.m_bodyList = null;
        this.m_contactList = null;
        this.m_jointList = null;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
        b2World.m_positionCorrection = true;
        b2World.m_warmStarting = true;
        b2World.m_continuousPhysics = true;
        this.m_allowSleep = doSleep;
        this.m_gravity = gravity;
        this.m_lock = false;
        this.m_inv_dt0 = 0.0;
        this.m_contactManager.m_world = this;
        //void* mem = b2Alloc(sizeof(b2BroadPhase));
        this.m_broadPhase = new b2BroadPhase(worldAABB, this.m_contactManager);
        var bd = new b2BodyDef();
        this.m_groundBody = this.CreateBody(bd);
    }
    /// Destruct the world. All physics entities are destroyed and all heap memory is released.
    //~b2World();
    /// Register a destruction listener.
    b2World.prototype.SetDestructionListener = function (listener) {
        this.m_destructionListener = listener;
    };
    /// Register a broad-phase boundary listener.
    b2World.prototype.SetBoundaryListener = function (listener) {
        this.m_boundaryListener = listener;
    };
    /// Register a contact filter to provide specific control over collision.
    /// Otherwise the default filter is used (b2_defaultFilter).
    b2World.prototype.SetContactFilter = function (filter) {
        this.m_contactFilter = filter;
    };
    /// Register a contact event listener
    b2World.prototype.SetContactListener = function (listener) {
        // maybe nulled for reset
        if (!listener) {
            this.m_contactListener = null;
            return;
        }
        var v_listener = listener;
        // ASClass, cool! Inject real class names, because box2D should call it by real name
        if (typeof listener['traits'] !== 'undefined' && this.__fast__) {
            // unwrapp to real class;
            var names = Object.getOwnPropertyNames(b2ContactListener.prototype);
            var mangle = '$Bg';
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_1 = names_1[_i];
                if (!v_listener[name_1] && v_listener[mangle + name_1]) {
                    v_listener[name_1] = v_listener[mangle + name_1];
                }
            }
        }
        this.m_contactListener = v_listener;
    };
    /// Register a routine for debug drawing. The debug draw functions are called
    /// inside the b2World::Step method, so make sure your renderer is ready to
    /// consume draw commands when you call Step().
    b2World.prototype.SetDebugDraw = function (debugDraw) {
        this.m_debugDraw = debugDraw;
    };
    /// Perform validation of internal data structures.
    b2World.prototype.Validate = function () {
        this.m_broadPhase.Validate();
    };
    /// Get the number of broad-phase proxies.
    b2World.prototype.GetProxyCount = function () {
        return this.m_broadPhase.m_proxyCount;
    };
    /// Get the number of broad-phase pairs.
    b2World.prototype.GetPairCount = function () {
        return this.m_broadPhase.m_pairManager.m_pairCount;
    };
    /// Create a rigid body given a definition. No reference to the definition
    /// is retained.
    /// @warning This function is locked during callbacks.
    b2World.prototype.CreateBody = function (def) {
        //b2Settings.b2Assert(this.m_lock == false);
        if (this.m_lock == true) {
            return null;
        }
        //void* mem = this.m_blockAllocator.Allocate(sizeof(b2Body));
        var b = new b2Body(def, this);
        // Add to world doubly linked list.
        b.m_prev = null;
        b.m_next = this.m_bodyList;
        if (this.m_bodyList) {
            this.m_bodyList.m_prev = b;
        }
        this.m_bodyList = b;
        ++this.m_bodyCount;
        return b;
    };
    /// Destroy a rigid body given a definition. No reference to the definition
    /// is retained. This function is locked during callbacks.
    /// @warning This automatically deletes all associated shapes and joints.
    /// @warning This function is locked during callbacks.
    b2World.prototype.DestroyBody = function (b) {
        //b2Settings.b2Assert(this.m_bodyCount > 0);
        //b2Settings.b2Assert(this.m_lock == false);
        if (this.m_lock == true) {
            return;
        }
        // Delete the attached joints.
        var jn = b.m_jointList;
        while (jn) {
            var jn0 = jn;
            jn = jn.next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
            }
            this.DestroyJoint(jn0.joint);
        }
        // Delete the attached shapes. This destroys broad-phase
        // proxies and pairs, leading to the destruction of contacts.
        var s = b.m_shapeList;
        while (s) {
            var s0 = s;
            s = s.m_next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeShape(s0);
            }
            s0.DestroyProxy(this.m_broadPhase);
            b2Shape.Destroy(s0, this.m_blockAllocator);
        }
        // Remove world body list.
        if (b.m_prev) {
            b.m_prev.m_next = b.m_next;
        }
        if (b.m_next) {
            b.m_next.m_prev = b.m_prev;
        }
        if (b == this.m_bodyList) {
            this.m_bodyList = b.m_next;
        }
        --this.m_bodyCount;
        //b->~b2Body();
        //this.m_blockAllocator.Free(b, sizeof(b2Body));
    };
    /// Create a joint to constrain bodies together. No reference to the definition
    /// is retained. This may cause the connected bodies to cease colliding.
    /// @warning This function is locked during callbacks.
    b2World.prototype.CreateJoint = function (def) {
        //b2Settings.b2Assert(this.m_lock == false);
        var j = b2Joint.Create(def, this.m_blockAllocator);
        // Connect to the world list.
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList) {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;
        // Connect to the bodies' doubly linked lists.
        j.m_node1.joint = j;
        j.m_node1.other = j.m_body2;
        j.m_node1.prev = null;
        j.m_node1.next = j.m_body1.m_jointList;
        if (j.m_body1.m_jointList)
            j.m_body1.m_jointList.prev = j.m_node1;
        j.m_body1.m_jointList = j.m_node1;
        j.m_node2.joint = j;
        j.m_node2.other = j.m_body1;
        j.m_node2.prev = null;
        j.m_node2.next = j.m_body2.m_jointList;
        if (j.m_body2.m_jointList)
            j.m_body2.m_jointList.prev = j.m_node2;
        j.m_body2.m_jointList = j.m_node2;
        // If the joint prevents collisions, then reset collision filtering.
        if (def.collideConnected == false) {
            // Reset the proxies on the body with the minimum number of shapes.
            var b = def.body1.m_shapeCount < def.body2.m_shapeCount ? def.body1 : def.body2;
            for (var s = b.m_shapeList; s; s = s.m_next) {
                s.RefilterProxy(this.m_broadPhase, b.m_xf);
            }
        }
        return j;
    };
    /// Destroy a joint. This may cause the connected bodies to begin colliding.
    /// @warning This function is locked during callbacks.
    b2World.prototype.DestroyJoint = function (j) {
        //b2Settings.b2Assert(this.m_lock == false);
        var collideConnected = j.m_collideConnected;
        // Remove from the doubly linked list.
        if (j.m_prev) {
            j.m_prev.m_next = j.m_next;
        }
        if (j.m_next) {
            j.m_next.m_prev = j.m_prev;
        }
        if (j == this.m_jointList) {
            this.m_jointList = j.m_next;
        }
        // Disconnect from island graph.
        var body1 = j.m_body1;
        var body2 = j.m_body2;
        // Wake up connected bodies.
        body1.WakeUp();
        body2.WakeUp();
        // Remove from body 1.
        if (j.m_node1.prev) {
            j.m_node1.prev.next = j.m_node1.next;
        }
        if (j.m_node1.next) {
            j.m_node1.next.prev = j.m_node1.prev;
        }
        if (j.m_node1 == body1.m_jointList) {
            body1.m_jointList = j.m_node1.next;
        }
        j.m_node1.prev = null;
        j.m_node1.next = null;
        // Remove from body 2
        if (j.m_node2.prev) {
            j.m_node2.prev.next = j.m_node2.next;
        }
        if (j.m_node2.next) {
            j.m_node2.next.prev = j.m_node2.prev;
        }
        if (j.m_node2 == body2.m_jointList) {
            body2.m_jointList = j.m_node2.next;
        }
        j.m_node2.prev = null;
        j.m_node2.next = null;
        b2Joint.Destroy(j, this.m_blockAllocator);
        //b2Settings.b2Assert(this.m_jointCount > 0);
        --this.m_jointCount;
        // If the joint prevents collisions, then reset collision filtering.
        if (collideConnected == false) {
            // Reset the proxies on the body with the minimum number of shapes.
            var b = body1.m_shapeCount < body2.m_shapeCount ? body1 : body2;
            for (var s = b.m_shapeList; s; s = s.m_next) {
                s.RefilterProxy(this.m_broadPhase, b.m_xf);
            }
        }
    };
    /// Re-filter a shape. This re-runs contact filtering on a shape.
    b2World.prototype.Refilter = function (shape) {
        shape.RefilterProxy(this.m_broadPhase, shape.m_body.m_xf);
    };
    /// Enable/disable warm starting. For testing.
    b2World.prototype.SetWarmStarting = function (flag) { b2World.m_warmStarting = flag; };
    /// Enable/disable position correction. For testing.
    b2World.prototype.SetPositionCorrection = function (flag) { b2World.m_positionCorrection = flag; };
    /// Enable/disable continuous physics. For testing.
    b2World.prototype.SetContinuousPhysics = function (flag) { b2World.m_continuousPhysics = flag; };
    /// Get the number of bodies.
    b2World.prototype.GetBodyCount = function () {
        return this.m_bodyCount;
    };
    /// Get the number joints.
    b2World.prototype.GetJointCount = function () {
        return this.m_jointCount;
    };
    /// Get the number of contacts (each may have 0 or more contact points).
    b2World.prototype.GetContactCount = function () {
        return this.m_contactCount;
    };
    /// Change the global gravity vector.
    b2World.prototype.SetGravity = function (gravity) {
        this.m_gravity = gravity;
    };
    /// The world provides a single static ground body with no collision shapes.
    /// You can use this to simplify the creation of joints and static shapes.
    b2World.prototype.GetGroundBody = function () {
        return this.m_groundBody;
    };
    /// Take a time step. This performs collision detection, integration,
    /// and constraint solution.
    /// @param timeStep the amount of time to simulate, this should not vary.
    /// @param iterations the number of iterations to be used by the constraint solver.
    b2World.prototype.Step = function (dt, iterations /** int */) {
        this.m_lock = true;
        var step = new b2TimeStep();
        step.dt = dt;
        step.maxIterations = iterations;
        if (dt > 0.0) {
            step.inv_dt = 1.0 / dt;
        }
        else {
            step.inv_dt = 0.0;
        }
        step.dtRatio = this.m_inv_dt0 * dt;
        step.positionCorrection = b2World.m_positionCorrection;
        step.warmStarting = b2World.m_warmStarting;
        // Update contacts.
        this.m_contactManager.Collide();
        // Integrate velocities, solve velocity constraints, and integrate positions.
        if (step.dt > 0.0) {
            this.Solve(step);
        }
        // Handle TOI events.
        if (b2World.m_continuousPhysics && step.dt > 0.0) {
            this.SolveTOI(step);
        }
        // Draw debug information.
        this.DrawDebugData();
        this.m_inv_dt0 = step.inv_dt;
        this.m_lock = false;
    };
    /// Query the world for all shapes that potentially overlap the
    /// provided AABB. You provide a shape pointer buffer of specified
    /// size. The number of shapes found is returned.
    /// @param aabb the query box.
    /// @param shapes a user allocated shape pointer array of size maxCount (or greater).
    /// @param maxCount the capacity of the shapes array.
    /// @return the number of shapes found in aabb.
    b2World.prototype.Query = function (aabb, shapes /*| ASArray*/, maxCount /** int */) {
        //void** results = (void**)this.m_stackAllocator.Allocate(maxCount * sizeof(void*));
        var results = new Array(maxCount);
        var count = this.m_broadPhase.QueryAABB(aabb, results, maxCount);
        var v_arr = shapes;
        // ASArray
        if (typeof (v_arr['traits']) !== 'undefined') {
            v_arr = v_arr['value'];
        }
        for (var i = 0; i < count; ++i) {
            v_arr[i] = results[i];
        }
        //this.m_stackAllocator.Free(results);
        return count;
    };
    /// Query the world for all shapes that intersect a given segment. You provide a shap
    /// pointer buffer of specified size. The number of shapes found is returned, and the buffer
    /// is filled in order of intersection
    /// @param segment defines the begin and end point of the ray cast, from p1 to p2.
    /// Use b2Segment.Extend to create (semi-)infinite rays
    /// @param shapes a user allocated shape pointer array of size maxCount (or greater).
    /// @param maxCount the capacity of the shapes array
    /// @param solidShapes determines if shapes that the ray starts in are counted as hits.
    /// @param userData passed through the worlds contact filter, with method RayCollide. This can be used to filter valid shapes
    /// @returns the number of shapes found
    b2World.prototype.Raycast = function (segment, shapes /*| ASArray*/, maxCount, solidShapes, userData) {
        var results = new Array(maxCount);
        this.m_raycastSegment = segment;
        this.m_raycastUserData = userData;
        var count = 0;
        if (solidShapes) {
            count = this.m_broadPhase.QuerySegment(segment, results, maxCount, this.RaycastSortKey);
        }
        else {
            count = this.m_broadPhase.QuerySegment(segment, results, maxCount, this.RaycastSortKey2);
        }
        // ASArray
        if (typeof (shapes['traits']) !== 'undefined') {
            shapes = shapes['value'];
        }
        for (var i = 0; i < count; ++i) {
            shapes[i] = results[i];
        }
        return count;
    };
    /// Performs a raycast as with Raycast, finding the first intersecting shape.
    /// @param segment defines the begin and end point of the ray cast, from p1 to p2.
    /// Use b2Segment.Extend to create (semi-)infinite rays
    /// @param lambda returns the hit fraction. You can use this to compute the contact point
    /// p = (1 - lambda) * segment.p1 + lambda * segment.p2.
    /// @param normal returns the normal at the contact point. If there is no intersection, the normal
    /// is not set.
    /// @param solidShapes determines if shapes that the ray starts in are counted as hits.
    /// @returns the colliding shape shape, or null if not found
    b2World.prototype.RaycastOne = function (segment, lambda, // float pointer
    normal, // pointer
    solidShapes, userData) {
        var shapes = new Array(1);
        var count = this.Raycast(segment, shapes, 1, solidShapes, userData);
        if (count == 0)
            return null;
        //if(count>1)
        //	trace(count);
        //Redundantly do TestSegment a second time, as the previous one's results are inaccessible
        var shape = shapes[0];
        var xf = shape.GetBody().GetXForm();
        shape.TestSegment(xf, lambda, normal, segment, 1);
        //We already know it returned true
        return shape;
    };
    /// Get the world body list. With the returned body, use b2Body::GetNext to get
    /// the next body in the world list. A NULL body indicates the end of the list.
    /// @return the head of the world body list.
    b2World.prototype.GetBodyList = function () {
        return this.m_bodyList;
    };
    /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
    /// the next joint in the world list. A NULL joint indicates the end of the list.
    /// @return the head of the world joint list.
    b2World.prototype.GetJointList = function () {
        return this.m_jointList;
    };
    //--------------- Internals Below -------------------
    // Internal yet public to make life easier.
    // Find islands, integrate and solve constraints, solve position constraints
    b2World.prototype.Solve = function (step) {
        var b;
        this.m_positionIterationCount = 0;
        // Size the island for the worst case.
        var island = new b2Island(this.m_bodyCount, this.m_contactCount, this.m_jointCount, this.m_stackAllocator, this.m_contactListener);
        // Clear all the island flags.
        for (b = this.m_bodyList; b; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
        }
        for (var c = this.m_contactList; c; c = c.m_next) {
            c.m_flags &= ~b2Contact.e_islandFlag;
        }
        for (var j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
        }
        // Build and simulate all awake islands.
        var stackSize = this.m_bodyCount;
        //b2Body** stack = (b2Body**)this.m_stackAllocator.Allocate(stackSize * sizeof(b2Body*));
        var stack = new Array(stackSize);
        for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
            if (seed.m_flags & (b2Body.e_islandFlag | b2Body.e_sleepFlag | b2Body.e_frozenFlag)) {
                continue;
            }
            if (seed.IsStatic()) {
                continue;
            }
            // Reset island and stack.
            island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;
            // Perform a depth first search (DFS) on the constraint graph.
            while (stackCount > 0) {
                // Grab the next body off the stack and add it to the island.
                b = stack[--stackCount];
                island.AddBody(b);
                // Make sure the body is awake.
                b.m_flags &= ~b2Body.e_sleepFlag;
                // To keep islands as small as possible, we don't
                // propagate islands across static bodies.
                if (b.IsStatic()) {
                    continue;
                }
                var other;
                // Search all contacts connected to this body.
                for (var cn = b.m_contactList; cn; cn = cn.next) {
                    // Has this contact already been added to an island?
                    if (cn.contact.m_flags & (b2Contact.e_islandFlag | b2Contact.e_nonSolidFlag)) {
                        continue;
                    }
                    // Is this contact touching?
                    if (cn.contact.m_manifoldCount == 0) {
                        continue;
                    }
                    island.AddContact(cn.contact);
                    cn.contact.m_flags |= b2Contact.e_islandFlag;
                    //var other:b2Body = cn.other;
                    other = cn.other;
                    // Was the other body already added to this island?
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    //b2Settings.b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
                // Search all joints connect to this body.
                for (var jn = b.m_jointList; jn; jn = jn.next) {
                    if (jn.joint.m_islandFlag == true) {
                        continue;
                    }
                    island.AddJoint(jn.joint);
                    jn.joint.m_islandFlag = true;
                    //var other:b2Body = jn.other;
                    other = jn.other;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    //b2Settings.b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            island.Solve(step, this.m_gravity, b2World.m_positionCorrection, this.m_allowSleep);
            //this.m_positionIterationCount = Math.max(this.m_positionIterationCount, island.m_positionIterationCount);
            if (island.m_positionIterationCount > this.m_positionIterationCount) {
                this.m_positionIterationCount = island.m_positionIterationCount;
            }
            // Post solve cleanup.
            for (var i = 0; i < island.m_bodyCount; ++i) {
                // Allow static bodies to participate in other islands.
                b = island.m_bodies[i];
                if (b.IsStatic()) {
                    b.m_flags &= ~b2Body.e_islandFlag;
                }
            }
        }
        //this.m_stackAllocator.Free(stack);
        // Synchronize shapes, check for out of range bodies.
        for (b = this.m_bodyList; b; b = b.m_next) {
            if (b.m_flags & (b2Body.e_sleepFlag | b2Body.e_frozenFlag)) {
                continue;
            }
            if (b.IsStatic()) {
                continue;
            }
            // Update shapes (for broad-phase). If the shapes go out of
            // the world AABB then shapes and contacts may be destroyed,
            // including contacts that are
            var inRange = b.SynchronizeShapes();
            // Did the body's shapes leave the world?
            if (inRange == false && this.m_boundaryListener != null) {
                this.m_boundaryListener.Violation(b);
            }
        }
        // Commit shape proxy movements to the broad-phase so that new contacts are created.
        // Also, some contacts can be destroyed.
        this.m_broadPhase.Commit();
    };
    // Find TOI contacts and solve them.
    b2World.prototype.SolveTOI = function (step) {
        var b;
        var s1;
        var s2;
        var b1;
        var b2;
        var cn;
        // Reserve an island and a stack for TOI island solution.
        var island = new b2Island(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, 0, this.m_stackAllocator, this.m_contactListener);
        var stackSize = this.m_bodyCount;
        //b2Body** stack = (b2Body**)this.m_stackAllocator.Allocate(stackSize * sizeof(b2Body*));
        var stack = new Array(stackSize);
        for (b = this.m_bodyList; b; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
            b.m_sweep.t0 = 0.0;
        }
        var c;
        for (c = this.m_contactList; c; c = c.m_next) {
            // Invalidate TOI
            c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
        }
        // Find TOI events and solve them.
        for (;;) {
            // Find the first TOI.
            var minContact = null;
            var minTOI = 1.0;
            for (c = this.m_contactList; c; c = c.m_next) {
                if (c.m_flags & (b2Contact.e_slowFlag | b2Contact.e_nonSolidFlag)) {
                    continue;
                }
                // TODO_ERIN keep a counter on the contact, only respond to M TOIs per contact.
                var toi = 1.0;
                if (c.m_flags & b2Contact.e_toiFlag) {
                    // This contact has a valid cached TOI.
                    toi = c.m_toi;
                }
                else {
                    // Compute the TOI for this contact.
                    s1 = c.m_shape1;
                    s2 = c.m_shape2;
                    b1 = s1.m_body;
                    b2 = s2.m_body;
                    if ((b1.IsStatic() || b1.IsSleeping()) && (b2.IsStatic() || b2.IsSleeping())) {
                        continue;
                    }
                    // Put the sweeps onto the same time interval.
                    var t0 = b1.m_sweep.t0;
                    if (b1.m_sweep.t0 < b2.m_sweep.t0) {
                        t0 = b2.m_sweep.t0;
                        b1.m_sweep.Advance(t0);
                    }
                    else if (b2.m_sweep.t0 < b1.m_sweep.t0) {
                        t0 = b1.m_sweep.t0;
                        b2.m_sweep.Advance(t0);
                    }
                    //b2Settings.b2Assert(t0 < 1.0f);
                    // Compute the time of impact.
                    toi = b2TimeOfImpact.TimeOfImpact(c.m_shape1, b1.m_sweep, c.m_shape2, b2.m_sweep);
                    //b2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
                    if (toi > 0.0 && toi < 1.0) {
                        //toi = Math.min((1.0 - toi) * t0 + toi, 1.0);
                        toi = (1.0 - toi) * t0 + toi;
                        if (toi > 1)
                            toi = 1;
                    }
                    c.m_toi = toi;
                    c.m_flags |= b2Contact.e_toiFlag;
                }
                if (Number.MIN_VALUE < toi && toi < minTOI) {
                    // This is the minimum TOI found so far.
                    minContact = c;
                    minTOI = toi;
                }
            }
            if (minContact == null || 1.0 - 100.0 * Number.MIN_VALUE < minTOI) {
                // No more TOI events. Done!
                break;
            }
            // Advance the bodies to the TOI.
            s1 = minContact.m_shape1;
            s2 = minContact.m_shape2;
            b1 = s1.m_body;
            b2 = s2.m_body;
            b1.Advance(minTOI);
            b2.Advance(minTOI);
            // The TOI contact likely has some new contact points.
            minContact.Update(this.m_contactListener);
            minContact.m_flags &= ~b2Contact.e_toiFlag;
            if (minContact.m_manifoldCount == 0) {
                // This shouldn't happen. Numerical error?
                //b2Assert(false);
                continue;
            }
            // Build the TOI island. We need a dynamic seed.
            var seed = b1;
            if (seed.IsStatic()) {
                seed = b2;
            }
            // Reset island and stack.
            island.Clear();
            var stackCount = 0;
            stack[stackCount++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;
            // Perform a depth first search (DFS) on the contact graph.
            while (stackCount > 0) {
                // Grab the next body off the stack and add it to the island.
                b = stack[--stackCount];
                island.AddBody(b);
                // Make sure the body is awake.
                b.m_flags &= ~b2Body.e_sleepFlag;
                // To keep islands as small as possible, we don't
                // propagate islands across static bodies.
                if (b.IsStatic()) {
                    continue;
                }
                // Search all contacts connected to this body.
                for (cn = b.m_contactList; cn; cn = cn.next) {
                    // Does the TOI island still have space for contacts?
                    if (island.m_contactCount == island.m_contactCapacity) {
                        continue;
                    }
                    // Has this contact already been added to an island? Skip slow or non-solid contacts.
                    if (cn.contact.m_flags & (b2Contact.e_islandFlag | b2Contact.e_slowFlag | b2Contact.e_nonSolidFlag)) {
                        continue;
                    }
                    // Is this contact touching? For performance we are not updating this contact.
                    if (cn.contact.m_manifoldCount == 0) {
                        continue;
                    }
                    island.AddContact(cn.contact);
                    cn.contact.m_flags |= b2Contact.e_islandFlag;
                    // Update other body.
                    var other = cn.other;
                    // Was the other body already added to this island?
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    // March forward, this can do no harm since this is the min TOI.
                    if (other.IsStatic() == false) {
                        other.Advance(minTOI);
                        other.WakeUp();
                    }
                    //b2Settings.b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            var subStep = new b2TimeStep();
            subStep.dt = (1.0 - minTOI) * step.dt;
            //b2Settings.b2Assert(subStep.dt > Number.MIN_VALUE);
            subStep.inv_dt = 1.0 / subStep.dt;
            subStep.maxIterations = step.maxIterations;
            island.SolveTOI(subStep);
            var i /** int */;
            // Post solve cleanup.
            for (i = 0; i < island.m_bodyCount; ++i) {
                // Allow bodies to participate in future TOI islands.
                b = island.m_bodies[i];
                b.m_flags &= ~b2Body.e_islandFlag;
                if (b.m_flags & (b2Body.e_sleepFlag | b2Body.e_frozenFlag)) {
                    continue;
                }
                if (b.IsStatic()) {
                    continue;
                }
                // Update shapes (for broad-phase). If the shapes go out of
                // the world AABB then shapes and contacts may be destroyed,
                // including contacts that are
                var inRange = b.SynchronizeShapes();
                // Did the body's shapes leave the world?
                if (inRange == false && this.m_boundaryListener != null) {
                    this.m_boundaryListener.Violation(b);
                }
                // Invalidate all contact TOIs associated with this body. Some of these
                // may not be in the island because they were not touching.
                for (cn = b.m_contactList; cn; cn = cn.next) {
                    cn.contact.m_flags &= ~b2Contact.e_toiFlag;
                }
            }
            for (i = 0; i < island.m_contactCount; ++i) {
                // Allow contacts to participate in future TOI islands.
                c = island.m_contacts[i];
                c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
            }
            // Commit shape proxy movements to the broad-phase so that new contacts are created.
            // Also, some contacts can be destroyed.
            this.m_broadPhase.Commit();
        }
        //this.m_stackAllocator.Free(stack);
    };
    //
    b2World.prototype.DrawJoint = function (joint) {
        var b1 = joint.m_body1;
        var b2 = joint.m_body2;
        var xf1 = b1.m_xf;
        var xf2 = b2.m_xf;
        var x1 = xf1.position;
        var x2 = xf2.position;
        var p1 = joint.GetAnchor1();
        var p2 = joint.GetAnchor2();
        //b2Color color(0.5f, 0.8f, 0.8f);
        var color = b2World.s_jointColor;
        switch (joint.m_type) {
            case b2Joint.e_distanceJoint:
                this.m_debugDraw.DrawSegment(p1, p2, color);
                break;
            case b2Joint.e_pulleyJoint:
                {
                    var pulley = joint;
                    var s1 = pulley.GetGroundAnchor1();
                    var s2 = pulley.GetGroundAnchor2();
                    this.m_debugDraw.DrawSegment(s1, p1, color);
                    this.m_debugDraw.DrawSegment(s2, p2, color);
                    this.m_debugDraw.DrawSegment(s1, s2, color);
                }
                break;
            case b2Joint.e_mouseJoint:
                this.m_debugDraw.DrawSegment(p1, p2, color);
                break;
            default:
                if (b1 != this.m_groundBody)
                    this.m_debugDraw.DrawSegment(x1, p1, color);
                this.m_debugDraw.DrawSegment(p1, p2, color);
                if (b2 != this.m_groundBody)
                    this.m_debugDraw.DrawSegment(x2, p2, color);
        }
    };
    b2World.prototype.DrawShape = function (shape, xf, color, core) {
        var coreColor = b2World.s_coreColor;
        switch (shape.m_type) {
            case b2Shape.e_circleShape:
                {
                    var circle = shape;
                    var center = b2Math.b2MulX(xf, circle.m_localPosition);
                    var radius = circle.m_radius;
                    var axis = xf.R.col1;
                    this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                    if (core) {
                        this.m_debugDraw.DrawCircle(center, radius - b2Settings.b2_toiSlop, coreColor);
                    }
                }
                break;
            case b2Shape.e_polygonShape:
                {
                    var i = void 0 /** int */;
                    var poly = shape;
                    var vertexCount = poly.GetVertexCount();
                    var localVertices = poly.GetVertices();
                    //b2Assert(vertexCount <= b2_maxPolygonVertices);
                    var vertices = new Array(b2Settings.b2_maxPolygonVertices);
                    for (i = 0; i < vertexCount; ++i) {
                        vertices[i] = b2Math.b2MulX(xf, localVertices[i]);
                    }
                    this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                    if (core) {
                        var localCoreVertices = poly.GetCoreVertices();
                        for (i = 0; i < vertexCount; ++i) {
                            vertices[i] = b2Math.b2MulX(xf, localCoreVertices[i]);
                        }
                        this.m_debugDraw.DrawPolygon(vertices, vertexCount, coreColor);
                    }
                }
                break;
        }
    };
    b2World.prototype.DrawDebugData = function () {
        if (this.m_debugDraw == null) {
            return;
        }
        this.m_debugDraw.m_sprite.graphics.clear();
        var flags = this.m_debugDraw.GetFlags();
        var i /** int */;
        var b;
        var s;
        var j;
        var bp;
        var invQ = new b2Vec2;
        var x1 = new b2Vec2;
        var x2 = new b2Vec2;
        var color = new b2Color(0, 0, 0);
        var xf;
        var b1 = new b2AABB();
        var b2 = new b2AABB();
        var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
        if (flags & b2DebugDraw.e_shapeBit) {
            var core = (flags & b2DebugDraw.e_coreShapeBit) == b2DebugDraw.e_coreShapeBit;
            for (b = this.m_bodyList; b; b = b.m_next) {
                xf = b.m_xf;
                for (s = b.GetShapeList(); s; s = s.m_next) {
                    if (b.IsStatic()) {
                        this.DrawShape(s, xf, new b2Color(0.5, 0.9, 0.5), core);
                    }
                    else if (b.IsSleeping()) {
                        this.DrawShape(s, xf, new b2Color(0.5, 0.5, 0.9), core);
                    }
                    else {
                        this.DrawShape(s, xf, new b2Color(0.9, 0.9, 0.9), core);
                    }
                }
            }
        }
        if (flags & b2DebugDraw.e_jointBit) {
            for (j = this.m_jointList; j; j = j.m_next) {
                //if (j.m_type != b2Joint.e_mouseJoint)
                //{
                this.DrawJoint(j);
                //}
            }
        }
        if (flags & b2DebugDraw.e_pairBit) {
            bp = this.m_broadPhase;
            //b2Vec2 invQ;
            invQ.Set(1.0 / bp.m_quantizationFactor.x, 1.0 / bp.m_quantizationFactor.y);
            //b2Color color(0.9f, 0.9f, 0.3f);
            color.Set(0.9, 0.9, 0.3);
            for (i = 0; i < b2Pair.b2_tableCapacity; ++i) {
                var index = bp.m_pairManager.m_hashTable[i];
                while (index != b2Pair.b2_nullPair) {
                    var pair = bp.m_pairManager.m_pairs[index];
                    var p1 = bp.m_proxyPool[pair.proxyId1];
                    var p2 = bp.m_proxyPool[pair.proxyId2];
                    //b2AABB b1, b2;
                    b1.lowerBound.x = bp.m_worldAABB.lowerBound.x + invQ.x * bp.m_bounds[0][p1.lowerBounds[0]].value;
                    b1.lowerBound.y = bp.m_worldAABB.lowerBound.y + invQ.y * bp.m_bounds[1][p1.lowerBounds[1]].value;
                    b1.upperBound.x = bp.m_worldAABB.lowerBound.x + invQ.x * bp.m_bounds[0][p1.upperBounds[0]].value;
                    b1.upperBound.y = bp.m_worldAABB.lowerBound.y + invQ.y * bp.m_bounds[1][p1.upperBounds[1]].value;
                    b2.lowerBound.x = bp.m_worldAABB.lowerBound.x + invQ.x * bp.m_bounds[0][p2.lowerBounds[0]].value;
                    b2.lowerBound.y = bp.m_worldAABB.lowerBound.y + invQ.y * bp.m_bounds[1][p2.lowerBounds[1]].value;
                    b2.upperBound.x = bp.m_worldAABB.lowerBound.x + invQ.x * bp.m_bounds[0][p2.upperBounds[0]].value;
                    b2.upperBound.y = bp.m_worldAABB.lowerBound.y + invQ.y * bp.m_bounds[1][p2.upperBounds[1]].value;
                    //b2Vec2 x1 = 0.5f * (b1.lowerBound + b1.upperBound);
                    x1.x = 0.5 * (b1.lowerBound.x + b1.upperBound.x);
                    x1.y = 0.5 * (b1.lowerBound.y + b1.upperBound.y);
                    //b2Vec2 x2 = 0.5f * (b2.lowerBound + b2.upperBound);
                    x2.x = 0.5 * (b2.lowerBound.x + b2.upperBound.x);
                    x2.y = 0.5 * (b2.lowerBound.y + b2.upperBound.y);
                    this.m_debugDraw.DrawSegment(x1, x2, color);
                    index = pair.next;
                }
            }
        }
        if (flags & b2DebugDraw.e_aabbBit) {
            bp = this.m_broadPhase;
            var worldLower = bp.m_worldAABB.lowerBound;
            var worldUpper = bp.m_worldAABB.upperBound;
            //b2Vec2 invQ;
            invQ.Set(1.0 / bp.m_quantizationFactor.x, 1.0 / bp.m_quantizationFactor.y);
            //b2Color color(0.9f, 0.3f, 0.9f);
            color.Set(0.9, 0.3, 0.9);
            for (i = 0; i < b2Settings.b2_maxProxies; ++i) {
                var p = bp.m_proxyPool[i];
                if (p.IsValid() == false) {
                    continue;
                }
                //b2AABB b1;
                b1.lowerBound.x = worldLower.x + invQ.x * bp.m_bounds[0][p.lowerBounds[0]].value;
                b1.lowerBound.y = worldLower.y + invQ.y * bp.m_bounds[1][p.lowerBounds[1]].value;
                b1.upperBound.x = worldLower.x + invQ.x * bp.m_bounds[0][p.upperBounds[0]].value;
                b1.upperBound.y = worldLower.y + invQ.y * bp.m_bounds[1][p.upperBounds[1]].value;
                //b2Vec2 vs[4];
                vs[0].Set(b1.lowerBound.x, b1.lowerBound.y);
                vs[1].Set(b1.upperBound.x, b1.lowerBound.y);
                vs[2].Set(b1.upperBound.x, b1.upperBound.y);
                vs[3].Set(b1.lowerBound.x, b1.upperBound.y);
                this.m_debugDraw.DrawPolygon(vs, 4, color);
            }
            //b2Vec2 vs[4];
            vs[0].Set(worldLower.x, worldLower.y);
            vs[1].Set(worldUpper.x, worldLower.y);
            vs[2].Set(worldUpper.x, worldUpper.y);
            vs[3].Set(worldLower.x, worldUpper.y);
            this.m_debugDraw.DrawPolygon(vs, 4, new b2Color(0.3, 0.9, 0.9));
        }
        if (flags & b2DebugDraw.e_obbBit) {
            //b2Color color(0.5f, 0.3f, 0.5f);
            color.Set(0.5, 0.3, 0.5);
            for (b = this.m_bodyList; b; b = b.m_next) {
                xf = b.m_xf;
                for (s = b.GetShapeList(); s; s = s.m_next) {
                    if (s.m_type != b2Shape.e_polygonShape) {
                        continue;
                    }
                    var poly = s;
                    var obb = poly.GetOBB();
                    var h = obb.extents;
                    //b2Vec2 vs[4];
                    vs[0].Set(-h.x, -h.y);
                    vs[1].Set(h.x, -h.y);
                    vs[2].Set(h.x, h.y);
                    vs[3].Set(-h.x, h.y);
                    for (i = 0; i < 4; ++i) {
                        //vs[i] = obb.center + b2Mul(obb.R, vs[i]);
                        var tMat = obb.R;
                        var tVec = vs[i];
                        var tX;
                        tX = obb.center.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                        vs[i].y = obb.center.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                        vs[i].x = tX;
                        //vs[i] = b2Mul(xf, vs[i]);
                        tMat = xf.R;
                        tX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
                        vs[i].y = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
                        vs[i].x = tX;
                    }
                    this.m_debugDraw.DrawPolygon(vs, 4, color);
                }
            }
        }
        if (flags & b2DebugDraw.e_centerOfMassBit) {
            for (b = this.m_bodyList; b; b = b.m_next) {
                xf = b2World.s_xf;
                xf.R = b.m_xf.R;
                xf.position = b.GetWorldCenter();
                this.m_debugDraw.DrawXForm(xf);
            }
        }
    };
    b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
    b2World.s_coreColor = new b2Color(0.9, 0.6, 0.6);
    b2World.s_xf = new b2XForm();
    return b2World;
}());
export { b2World };
