import { b2Vec2, b2Math, b2Transform, b2Sweep } from '../Common/Math';
import { b2Island } from './b2Island';
import { b2Body } from './b2Body';
import { b2Contact, b2ContactSolver } from './Contacts';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2Settings } from '../Common/b2Settings';
import { b2Joint } from './Joints';
import { b2TimeStep } from './b2TimeStep';
import { b2Color } from '../Common/b2Color';
import { b2DebugDraw } from './b2DebugDraw';
import { b2DestructionListener } from './b2DestructionListener';
import { b2BodyDef } from './b2BodyDef';
import { b2ContactListener } from './b2ContactListener';
import { b2ContactManager } from './b2ContactManager';
import { b2RayCastInput } from '../Collision/b2RayCastInput';
import { b2RayCastOutput } from '../Collision/b2RayCastOutput';
import { b2AABB } from '../Collision/b2AABB';
import { b2ContactFilter } from './b2ContactFilter';
// unbox methods from ASClass to real class prototupe
function unBoxMethods(object, prototype) {
    if (!object || typeof object['traits'] === 'undefined') {
        return object;
    }
    var names = Object.getOwnPropertyNames(prototype);
    var mangle = '$Bg';
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        if (!object[name_1] && object[mangle + name_1]) {
            object[name_1] = object[mangle + name_1];
        }
    }
    return object;
}
/**
* The world class manages all physics entities, dynamic simulation,
* and asynchronous queries.
*/
var b2World = /** @class */ (function () {
    // Construct a world object.
    /**
    * @param gravity the world gravity vector.
    * @param doSleep improve performance by not simulating inactive bodies.
    */
    function b2World(gravity, doSleep) {
        this.__fast__ = true;
        //--------------- Internals Below -------------------
        // Internal yet public to make life easier.
        // Find islands, integrate and solve constraints, solve position constraints
        this.s_stack = new Array();
        this.m_contactManager = new b2ContactManager();
        // These two are stored purely for efficiency purposes, they don't maintain
        // any data outside of a call to Step
        this.m_contactSolver = new b2ContactSolver();
        this.m_island = new b2Island();
        this.m_destructionListener = null;
        this.m_debugDraw = null;
        this.m_bodyList = null;
        this.m_contactList = null;
        this.m_jointList = null;
        this.m_controllerList = null;
        this.m_bodyCount = 0;
        this.m_contactCount = 0;
        this.m_jointCount = 0;
        this.m_controllerCount = 0;
        b2World.m_warmStarting = true;
        b2World.m_continuousPhysics = true;
        this.m_allowSleep = doSleep;
        this.m_gravity = gravity;
        this.m_inv_dt0 = 0.0;
        this.m_contactManager.m_world = this;
        var bd = new b2BodyDef();
        this.m_groundBody = this.CreateBody(bd);
    }
    /**
    * Destruct the world. All physics entities are destroyed and all heap memory is released.
    */
    //~b2World();
    /**
    * Register a destruction listener.
    */
    b2World.prototype.SetDestructionListener = function (listener) {
        this.m_destructionListener = unBoxMethods(listener, b2DestructionListener.prototype);
    };
    /**
    * Register a contact filter to provide specific control over collision.
    * Otherwise the default filter is used (b2_defaultFilter).
    */
    b2World.prototype.SetContactFilter = function (filter) {
        this.m_contactManager.m_contactFilter = unBoxMethods(filter, b2ContactFilter.prototype);
    };
    /**
    * Register a contact event listener
    */
    b2World.prototype.SetContactListener = function (listener) {
        this.m_contactManager.m_contactListener = unBoxMethods(listener, b2ContactListener.prototype);
    };
    /**
    * Register a routine for debug drawing. The debug draw functions are called
    * inside the b2World::Step method, so make sure your renderer is ready to
    * consume draw commands when you call Step().
    */
    b2World.prototype.SetDebugDraw = function (debugDraw) {
        this.m_debugDraw = debugDraw;
    };
    /**
     * Use the given object as a broadphase.
     * The old broadphase will not be cleanly emptied.
     * @warning It is not recommended you call this except immediately after constructing the world.
     * @warning This function is locked during callbacks.
     */
    b2World.prototype.SetBroadPhase = function (broadPhase) {
        var oldBroadPhase = this.m_contactManager.m_broadPhase;
        this.m_contactManager.m_broadPhase = broadPhase;
        for (var b = this.m_bodyList; b; b = b.m_next) {
            for (var f = b.m_fixtureList; f; f = f.m_next) {
                f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
            }
        }
    };
    /**
    * Perform validation of internal data structures.
    */
    b2World.prototype.Validate = function () {
        this.m_contactManager.m_broadPhase.Validate();
    };
    /**
    * Get the number of broad-phase proxies.
    */
    b2World.prototype.GetProxyCount = function () {
        return this.m_contactManager.m_broadPhase.GetProxyCount();
    };
    /**
    * Create a rigid body given a definition. No reference to the definition
    * is retained.
    * @warning This function is locked during callbacks.
    */
    b2World.prototype.CreateBody = function (def) {
        //b2Settings.b2Assert(this.m_lock == false);
        if (this.IsLocked() == true) {
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
    /**
    * Destroy a rigid body given a definition. No reference to the definition
    * is retained. This function is locked during callbacks.
    * @warning This automatically deletes all associated shapes and joints.
    * @warning This function is locked during callbacks.
    */
    b2World.prototype.DestroyBody = function (b) {
        //b2Settings.b2Assert(this.m_bodyCount > 0);
        //b2Settings.b2Assert(this.m_lock == false);
        if (this.IsLocked() == true) {
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
        // Detach controllers attached to this body
        var coe = b.m_controllerList;
        while (coe) {
            var coe0 = coe;
            coe = coe.nextController;
            coe0.controller.RemoveBody(b);
        }
        // Delete the attached contacts.
        var ce = b.m_contactList;
        while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_contactManager.Destroy(ce0.contact);
        }
        b.m_contactList = null;
        // Delete the attached fixtures. This destroys broad-phase
        // proxies.
        var f = b.m_fixtureList;
        while (f) {
            var f0 = f;
            f = f.m_next;
            if (this.m_destructionListener) {
                this.m_destructionListener.SayGoodbyeFixture(f0);
            }
            f0.DestroyProxy(this.m_contactManager.m_broadPhase);
            f0.Destroy();
            //f0->~b2Fixture();
            //this.m_blockAllocator.Free(f0, sizeof(b2Fixture));
        }
        b.m_fixtureList = null;
        b.m_fixtureCount = 0;
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
    /**
    * Create a joint to constrain bodies together. No reference to the definition
    * is retained. This may cause the connected bodies to cease colliding.
    * @warning This function is locked during callbacks.
    */
    b2World.prototype.CreateJoint = function (def) {
        //b2Settings.b2Assert(this.m_lock == false);
        var j = b2Joint.Create(def, null);
        // Connect to the world list.
        j.m_prev = null;
        j.m_next = this.m_jointList;
        if (this.m_jointList) {
            this.m_jointList.m_prev = j;
        }
        this.m_jointList = j;
        ++this.m_jointCount;
        // Connect to the bodies' doubly linked lists.
        j.m_edgeA.joint = j;
        j.m_edgeA.other = j.m_bodyB;
        j.m_edgeA.prev = null;
        j.m_edgeA.next = j.m_bodyA.m_jointList;
        if (j.m_bodyA.m_jointList)
            j.m_bodyA.m_jointList.prev = j.m_edgeA;
        j.m_bodyA.m_jointList = j.m_edgeA;
        j.m_edgeB.joint = j;
        j.m_edgeB.other = j.m_bodyA;
        j.m_edgeB.prev = null;
        j.m_edgeB.next = j.m_bodyB.m_jointList;
        if (j.m_bodyB.m_jointList)
            j.m_bodyB.m_jointList.prev = j.m_edgeB;
        j.m_bodyB.m_jointList = j.m_edgeB;
        var bodyA = def.bodyA;
        var bodyB = def.bodyB;
        // If the joint prevents collisions, then flag any contacts for filtering.
        if (def.collideConnected == false) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other == bodyA) {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
        // Note: creating a joint doesn't wake the bodies.
        return j;
    };
    /**
    * Destroy a joint. This may cause the connected bodies to begin colliding.
    * @warning This function is locked during callbacks.
    */
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
        var bodyA = j.m_bodyA;
        var bodyB = j.m_bodyB;
        // Wake up connected bodies.
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);
        // Remove from body 1.
        if (j.m_edgeA.prev) {
            j.m_edgeA.prev.next = j.m_edgeA.next;
        }
        if (j.m_edgeA.next) {
            j.m_edgeA.next.prev = j.m_edgeA.prev;
        }
        if (j.m_edgeA == bodyA.m_jointList) {
            bodyA.m_jointList = j.m_edgeA.next;
        }
        j.m_edgeA.prev = null;
        j.m_edgeA.next = null;
        // Remove from body 2
        if (j.m_edgeB.prev) {
            j.m_edgeB.prev.next = j.m_edgeB.next;
        }
        if (j.m_edgeB.next) {
            j.m_edgeB.next.prev = j.m_edgeB.prev;
        }
        if (j.m_edgeB == bodyB.m_jointList) {
            bodyB.m_jointList = j.m_edgeB.next;
        }
        j.m_edgeB.prev = null;
        j.m_edgeB.next = null;
        b2Joint.Destroy(j, null);
        //b2Settings.b2Assert(this.m_jointCount > 0);
        --this.m_jointCount;
        // If the joint prevents collisions, then flag any contacts for filtering.
        if (collideConnected == false) {
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other == bodyA) {
                    // Flag the contact for filtering at the next time step (where either
                    // body is awake).
                    edge.contact.FlagForFiltering();
                }
                edge = edge.next;
            }
        }
    };
    /**
     * Add a controller to the world list
     */
    b2World.prototype.AddController = function (c) {
        c.m_next = this.m_controllerList;
        c.m_prev = null;
        this.m_controllerList = c;
        c.m_world = this;
        this.m_controllerCount++;
        return c;
    };
    b2World.prototype.RemoveController = function (c) {
        //TODO: Remove bodies from controller
        if (c.m_prev)
            c.m_prev.m_next = c.m_next;
        if (c.m_next)
            c.m_next.m_prev = c.m_prev;
        if (this.m_controllerList == c)
            this.m_controllerList = c.m_next;
        this.m_controllerCount--;
    };
    b2World.prototype.CreateController = function (controller) {
        if (controller.m_world != this)
            throw new Error('Controller can only be a member of one world');
        controller.m_next = this.m_controllerList;
        controller.m_prev = null;
        if (this.m_controllerList)
            this.m_controllerList.m_prev = controller;
        this.m_controllerList = controller;
        ++this.m_controllerCount;
        controller.m_world = this;
        return controller;
    };
    b2World.prototype.DestroyController = function (controller) {
        //b2Settings.b2Assert(this.m_controllerCount > 0);
        controller.Clear();
        if (controller.m_next)
            controller.m_next.m_prev = controller.m_prev;
        if (controller.m_prev)
            controller.m_prev.m_next = controller.m_next;
        if (controller == this.m_controllerList)
            this.m_controllerList = controller.m_next;
        --this.m_controllerCount;
    };
    /**
    * Enable/disable warm starting. For testing.
    */
    b2World.prototype.SetWarmStarting = function (flag) { b2World.m_warmStarting = flag; };
    /**
    * Enable/disable continuous physics. For testing.
    */
    b2World.prototype.SetContinuousPhysics = function (flag) { b2World.m_continuousPhysics = flag; };
    /**
    * Get the number of bodies.
    */
    b2World.prototype.GetBodyCount = function () {
        return this.m_bodyCount;
    };
    /**
    * Get the number of joints.
    */
    b2World.prototype.GetJointCount = function () {
        return this.m_jointCount;
    };
    /**
    * Get the number of contacts (each may have 0 or more contact points).
    */
    b2World.prototype.GetContactCount = function () {
        return this.m_contactCount;
    };
    /**
    * Change the global gravity vector.
    */
    b2World.prototype.SetGravity = function (gravity) {
        this.m_gravity = gravity;
    };
    /**
    * Get the global gravity vector.
    */
    b2World.prototype.GetGravity = function () {
        return this.m_gravity;
    };
    /**
    * The world provides a single static ground body with no collision shapes.
    * You can use this to simplify the creation of joints and static shapes.
    */
    b2World.prototype.GetGroundBody = function () {
        return this.m_groundBody;
    };
    /**
    * Take a time step. This performs collision detection, integration,
    * and constraint solution.
    * @param timeStep the amount of time to simulate, this should not vary.
    * @param velocityIterations for the velocity constraint solver.
    * @param positionIterations for the position constraint solver.
    */
    b2World.prototype.Step = function (dt, velocityIterations /** int */, positionIterations /** int */) {
        if (this.m_flags & b2World.e_newFixture) {
            this.m_contactManager.FindNewContacts();
            this.m_flags &= ~b2World.e_newFixture;
        }
        this.m_flags |= b2World.e_locked;
        var step = b2World.s_timestep2;
        step.dt = dt;
        step.velocityIterations = velocityIterations;
        step.positionIterations = positionIterations;
        if (dt > 0.0) {
            step.inv_dt = 1.0 / dt;
        }
        else {
            step.inv_dt = 0.0;
        }
        step.dtRatio = this.m_inv_dt0 * dt;
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
        if (step.dt > 0.0) {
            this.m_inv_dt0 = step.inv_dt;
        }
        this.m_flags &= ~b2World.e_locked;
    };
    /**
     * Call this after you are done with time steps to clear the forces. You normally
     * call this after each call to Step, unless you are performing sub-steps.
     */
    b2World.prototype.ClearForces = function () {
        for (var body = this.m_bodyList; body; body = body.m_next) {
            body.m_force.SetZero();
            body.m_torque = 0.0;
        }
    };
    /**
     * Call this to draw shapes and other debug draw data.
     */
    b2World.prototype.DrawDebugData = function () {
        if (this.m_debugDraw == null) {
            return;
        }
        this.m_debugDraw.m_sprite.graphics.clear();
        var flags = this.m_debugDraw.GetFlags();
        var i /** int */;
        var b;
        var f;
        var s;
        var j;
        var bp;
        var invQ = new b2Vec2;
        var x1 = new b2Vec2;
        var x2 = new b2Vec2;
        var xf;
        var b1 = new b2AABB();
        var b2 = new b2AABB();
        var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
        // Store color here and reuse, to reduce allocations
        var color = new b2Color(0, 0, 0);
        if (flags & b2DebugDraw.e_shapeBit) {
            for (b = this.m_bodyList; b; b = b.m_next) {
                xf = b.m_xf;
                for (f = b.GetFixtureList(); f; f = f.m_next) {
                    s = f.GetShape();
                    if (b.IsActive() == false) {
                        color.Set(0.5, 0.5, 0.3);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.GetType() == b2Body.b2_staticBody) {
                        color.Set(0.5, 0.9, 0.5);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.GetType() == b2Body.b2_kinematicBody) {
                        color.Set(0.5, 0.5, 0.9);
                        this.DrawShape(s, xf, color);
                    }
                    else if (b.IsAwake() == false) {
                        color.Set(0.6, 0.6, 0.6);
                        this.DrawShape(s, xf, color);
                    }
                    else {
                        color.Set(0.9, 0.7, 0.7);
                        this.DrawShape(s, xf, color);
                    }
                }
            }
        }
        if (flags & b2DebugDraw.e_jointBit) {
            for (j = this.m_jointList; j; j = j.m_next) {
                this.DrawJoint(j);
            }
        }
        if (flags & b2DebugDraw.e_controllerBit) {
            for (var c = this.m_controllerList; c; c = c.m_next) {
                c.Draw(this.m_debugDraw);
            }
        }
        if (flags & b2DebugDraw.e_pairBit) {
            color.Set(0.3, 0.9, 0.9);
            for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
                var cA = fixtureA.GetAABB().GetCenter();
                var cB = fixtureB.GetAABB().GetCenter();
                this.m_debugDraw.DrawSegment(cA, cB, color);
            }
        }
        if (flags & b2DebugDraw.e_aabbBit) {
            bp = this.m_contactManager.m_broadPhase;
            vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
            for (b = this.m_bodyList; b; b = b.GetNext()) {
                if (b.IsActive() == false) {
                    continue;
                }
                for (f = b.GetFixtureList(); f; f = f.GetNext()) {
                    var aabb = bp.GetFatAABB(f.m_proxy);
                    vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
                    vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
                    vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
                    vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
                    this.m_debugDraw.DrawPolygon(vs, 4, color);
                }
            }
        }
        if (flags & b2DebugDraw.e_centerOfMassBit) {
            for (b = this.m_bodyList; b; b = b.m_next) {
                xf = b2World.s_xf;
                xf.R = b.m_xf.R;
                xf.position = b.GetWorldCenter();
                this.m_debugDraw.DrawTransform(xf);
            }
        }
    };
    /**
     * Query the world for all fixtures that potentially overlap the
     * provided AABB.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @param aabb the query box.
     */
    b2World.prototype.QueryAABB = function (callback, aabb) {
        var broadPhase = this.m_contactManager.m_broadPhase;
        function WorldQueryWrapper(proxy) {
            if (typeof callback === 'function') {
                return callback(broadPhase.GetUserData(proxy));
            }
            else {
                return callback.axApply(null, [broadPhase.GetUserData(proxy)]);
            }
        }
        broadPhase.Query(WorldQueryWrapper, aabb);
    };
    /**
     * Query the world for all fixtures that precisely overlap the
     * provided transformed shape.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @asonly
     */
    b2World.prototype.QueryShape = function (callback, shape, transform) {
        if (transform === void 0) { transform = null; }
        if (transform == null) {
            transform = new b2Transform();
            transform.SetIdentity();
        }
        var broadPhase = this.m_contactManager.m_broadPhase;
        function WorldQueryWrapper(proxy) {
            var fixture = broadPhase.GetUserData(proxy);
            if (b2Shape.TestOverlap(shape, transform, fixture.GetShape(), fixture.GetBody().GetTransform()))
                return callback(fixture);
            return true;
        }
        var aabb = new b2AABB();
        shape.ComputeAABB(aabb, transform);
        broadPhase.Query(WorldQueryWrapper, aabb);
    };
    /**
     * Query the world for all fixtures that contain a point.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @asonly
     */
    b2World.prototype.QueryPoint = function (callback, p) {
        var broadPhase = this.m_contactManager.m_broadPhase;
        function WorldQueryWrapper(proxy) {
            var fixture = broadPhase.GetUserData(proxy);
            if (fixture.TestPoint(p))
                return callback(fixture);
            return true;
        }
        // Make a small box.
        var aabb = new b2AABB();
        aabb.lowerBound.Set(p.x - b2Settings.b2_linearSlop, p.y - b2Settings.b2_linearSlop);
        aabb.upperBound.Set(p.x + b2Settings.b2_linearSlop, p.y + b2Settings.b2_linearSlop);
        broadPhase.Query(WorldQueryWrapper, aabb);
    };
    /**
     * Ray-cast the world for all fixtures in the path of the ray. Your callback
     * Controls whether you get the closest point, any point, or n-points
     * The ray-cast ignores shapes that contain the starting point
     * @param callback A callback function which must be of signature:
     * <code>function Callback(fixture:b2Fixture,    // The fixture hit by the ray
     * point:b2Vec2,         // The point of initial intersection
     * normal:b2Vec2,        // The normal vector at the point of intersection
     * fraction:number       // The fractional length along the ray of the intersection
     * ):number
     * </code>
     * Callback should return the new length of the ray as a fraction of the original length.
     * By returning 0, you immediately terminate.
     * By returning 1, you continue wiht the original ray.
     * By returning the current fraction, you proceed to find the closest point.
     * @param point1 the ray starting point
     * @param point2 the ray ending point
     */
    b2World.prototype.RayCast = function (callback, point1, point2) {
        var broadPhase = this.m_contactManager.m_broadPhase;
        var output = new b2RayCastOutput;
        function RayCastWrapper(input, proxy) {
            var userData = broadPhase.GetUserData(proxy);
            var fixture = userData;
            var hit = fixture.RayCast(output, input);
            if (hit) {
                var fraction = output.fraction;
                var point = new b2Vec2((1.0 - fraction) * point1.x + fraction * point2.x, (1.0 - fraction) * point1.y + fraction * point2.y);
                return callback(fixture, point, output.normal, fraction);
            }
            return input.maxFraction;
        }
        var input = new b2RayCastInput(point1, point2);
        broadPhase.RayCast(RayCastWrapper, input);
    };
    b2World.prototype.RayCastOne = function (point1, point2) {
        var result;
        function RayCastOneWrapper(fixture, point, normal, fraction) {
            result = fixture;
            return fraction;
        }
        this.RayCast(RayCastOneWrapper, point1, point2);
        return result;
    };
    b2World.prototype.RayCastAll = function (point1, point2) {
        var result = new Array();
        function RayCastAllWrapper(fixture, point, normal, fraction) {
            result[result.length] = fixture;
            return 1;
        }
        this.RayCast(RayCastAllWrapper, point1, point2);
        return result;
    };
    /**
    * Get the world body list. With the returned body, use b2Body::GetNext to get
    * the next body in the world list. A NULL body indicates the end of the list.
    * @return the head of the world body list.
    */
    b2World.prototype.GetBodyList = function () {
        return this.m_bodyList;
    };
    /**
    * Get the world joint list. With the returned joint, use b2Joint::GetNext to get
    * the next joint in the world list. A NULL joint indicates the end of the list.
    * @return the head of the world joint list.
    */
    b2World.prototype.GetJointList = function () {
        return this.m_jointList;
    };
    /**
     * Get the world contact list. With the returned contact, use b2Contact::GetNext to get
     * the next contact in the world list. A NULL contact indicates the end of the list.
     * @return the head of the world contact list.
     * @warning contacts are
     */
    b2World.prototype.GetContactList = function () {
        return this.m_contactList;
    };
    /**
     * Is the world locked (in the middle of a time step).
     */
    b2World.prototype.IsLocked = function () {
        return (this.m_flags & b2World.e_locked) > 0;
    };
    b2World.prototype.Solve = function (step) {
        var b;
        // Step all controllers
        for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
            controller.Step(step);
        }
        // Size the island for the worst case.
        var island = this.m_island;
        island.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
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
        var stack = this.s_stack;
        for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
            if (seed.m_flags & b2Body.e_islandFlag) {
                continue;
            }
            if (seed.IsAwake() == false || seed.IsActive() == false) {
                continue;
            }
            // The seed can be dynamic or kinematic.
            if (seed.GetType() == b2Body.b2_staticBody) {
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
                //b2Assert(b.IsActive() == true);
                island.AddBody(b);
                // Make sure the body is awake.
                if (b.IsAwake() == false) {
                    b.SetAwake(true);
                }
                // To keep islands as small as possible, we don't
                // propagate islands across static bodies.
                if (b.GetType() == b2Body.b2_staticBody) {
                    continue;
                }
                var other;
                // Search all contacts connected to this body.
                for (var ce = b.m_contactList; ce; ce = ce.next) {
                    // Has this contact already been added to an island?
                    if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                        continue;
                    }
                    // Is this contact solid and touching?
                    if (ce.contact.IsSensor() == true ||
                        ce.contact.IsEnabled() == false ||
                        ce.contact.IsTouching() == false) {
                        continue;
                    }
                    island.AddContact(ce.contact);
                    ce.contact.m_flags |= b2Contact.e_islandFlag;
                    //var other:b2Body = ce.other;
                    other = ce.other;
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
                    other = jn.other;
                    // Don't simulate joints connected to inactive bodies.
                    if (other.IsActive() == false) {
                        continue;
                    }
                    island.AddJoint(jn.joint);
                    jn.joint.m_islandFlag = true;
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    //b2Settings.b2Assert(stackCount < stackSize);
                    stack[stackCount++] = other;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            island.Solve(step, this.m_gravity, this.m_allowSleep);
            // Post solve cleanup.
            for (var i = 0; i < island.m_bodyCount; ++i) {
                // Allow static bodies to participate in other islands.
                b = island.m_bodies[i];
                if (b.GetType() == b2Body.b2_staticBody) {
                    b.m_flags &= ~b2Body.e_islandFlag;
                }
            }
        }
        //this.m_stackAllocator.Free(stack);
        for (i = 0; i < stack.length; ++i) {
            if (!stack[i])
                break;
            stack[i] = null;
        }
        // Synchronize fixutres, check for out of range bodies.
        for (b = this.m_bodyList; b; b = b.m_next) {
            if (b.IsAwake() == false || b.IsActive() == false) {
                continue;
            }
            if (b.GetType() == b2Body.b2_staticBody) {
                continue;
            }
            // Update fixtures (for broad-phase).
            b.SynchronizeFixtures();
        }
        // Look for new contacts.
        this.m_contactManager.FindNewContacts();
    };
    // Find TOI contacts and solve them.
    b2World.prototype.SolveTOI = function (step) {
        var b;
        var fA;
        var fB;
        var bA;
        var bB;
        var cEdge;
        var j;
        // Reserve an island and a queue for TOI island solution.
        var island = this.m_island;
        island.Initialize(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, b2Settings.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
        //Simple one pass queue
        //Relies on the fact that we're only making one pass
        //through and each body can only be pushed/popped one.
        //To push:
        //  queue[queueStart+queueSize++] = newElement;
        //To pop:
        //  poppedElement = queue[queueStart++];
        //  --queueSize;
        var queue = b2World.s_queue;
        for (b = this.m_bodyList; b; b = b.m_next) {
            b.m_flags &= ~b2Body.e_islandFlag;
            b.m_sweep.t0 = 0.0;
        }
        var c;
        for (c = this.m_contactList; c; c = c.m_next) {
            // Invalidate TOI
            c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
        }
        for (j = this.m_jointList; j; j = j.m_next) {
            j.m_islandFlag = false;
        }
        // Find TOI events and solve them.
        for (;;) {
            // Find the first TOI.
            var minContact = null;
            var minTOI = 1.0;
            for (c = this.m_contactList; c; c = c.m_next) {
                // Can this contact generate a solid TOI contact?
                if (c.IsSensor() == true ||
                    c.IsEnabled() == false ||
                    c.IsContinuous() == false) {
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
                    fA = c.m_fixtureA;
                    fB = c.m_fixtureB;
                    bA = fA.m_body;
                    bB = fB.m_body;
                    if ((bA.GetType() != b2Body.b2_dynamicBody || bA.IsAwake() == false) &&
                        (bB.GetType() != b2Body.b2_dynamicBody || bB.IsAwake() == false)) {
                        continue;
                    }
                    // Put the sweeps onto the same time interval.
                    var t0 = bA.m_sweep.t0;
                    if (bA.m_sweep.t0 < bB.m_sweep.t0) {
                        t0 = bB.m_sweep.t0;
                        bA.m_sweep.Advance(t0);
                    }
                    else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
                        t0 = bA.m_sweep.t0;
                        bB.m_sweep.Advance(t0);
                    }
                    //b2Settings.b2Assert(t0 < 1.0f);
                    // Compute the time of impact.
                    toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
                    b2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
                    // If the TOI is in range ...
                    if (toi > 0.0 && toi < 1.0) {
                        // Interpolate on the actual range.
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
            fA = minContact.m_fixtureA;
            fB = minContact.m_fixtureB;
            bA = fA.m_body;
            bB = fB.m_body;
            b2World.s_backupA.Set(bA.m_sweep);
            b2World.s_backupB.Set(bB.m_sweep);
            bA.Advance(minTOI);
            bB.Advance(minTOI);
            // The TOI contact likely has some new contact points.
            minContact.Update(this.m_contactManager.m_contactListener);
            minContact.m_flags &= ~b2Contact.e_toiFlag;
            // Is the contact solid?
            if (minContact.IsSensor() == true ||
                minContact.IsEnabled() == false) {
                // Restore the sweeps
                bA.m_sweep.Set(b2World.s_backupA);
                bB.m_sweep.Set(b2World.s_backupB);
                bA.SynchronizeTransform();
                bB.SynchronizeTransform();
                continue;
            }
            // Did numerical issues prevent;,ontact pointjrom being generated
            if (minContact.IsTouching() == false) {
                // Give up on this TOI
                continue;
            }
            // Build the TOI island. We need a dynamic seed.
            var seed = bA;
            if (seed.GetType() != b2Body.b2_dynamicBody) {
                seed = bB;
            }
            // Reset island and queue.
            island.Clear();
            var queueStart = 0; //start index for queue
            var queueSize = 0; //elements in queue
            queue[queueStart + queueSize++] = seed;
            seed.m_flags |= b2Body.e_islandFlag;
            // Perform a breadth first search (BFS) on the contact graph.
            while (queueSize > 0) {
                // Grab the next body off the stack and add it to the island.
                b = queue[queueStart++];
                --queueSize;
                island.AddBody(b);
                // Make sure the body is awake.
                if (b.IsAwake() == false) {
                    b.SetAwake(true);
                }
                // To keep islands as small as possible, we don't
                // propagate islands across static or kinematic bodies.
                if (b.GetType() != b2Body.b2_dynamicBody) {
                    continue;
                }
                // Search all contacts connected to this body.
                for (cEdge = b.m_contactList; cEdge; cEdge = cEdge.next) {
                    // Does the TOI island still have space for contacts?
                    if (island.m_contactCount == island.m_contactCapacity) {
                        break;
                    }
                    // Has this contact already been added to an island?
                    if (cEdge.contact.m_flags & b2Contact.e_islandFlag) {
                        continue;
                    }
                    // Skip sperate, sensor, or disabled contacts.
                    if (cEdge.contact.IsSensor() == true ||
                        cEdge.contact.IsEnabled() == false ||
                        cEdge.contact.IsTouching() == false) {
                        continue;
                    }
                    island.AddContact(cEdge.contact);
                    cEdge.contact.m_flags |= b2Contact.e_islandFlag;
                    // Update other body.
                    var other = cEdge.other;
                    // Was the other body already added to this island?
                    if (other.m_flags & b2Body.e_islandFlag) {
                        continue;
                    }
                    // Synchronize the connected body.
                    if (other.GetType() != b2Body.b2_staticBody) {
                        other.Advance(minTOI);
                        other.SetAwake(true);
                    }
                    //b2Settings.b2Assert(queueStart + queueSize < queueCapacity);
                    queue[queueStart + queueSize] = other;
                    ++queueSize;
                    other.m_flags |= b2Body.e_islandFlag;
                }
                for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
                    if (island.m_jointCount == island.m_jointCapacity)
                        continue;
                    if (jEdge.joint.m_islandFlag == true)
                        continue;
                    other = jEdge.other;
                    if (other.IsActive() == false) {
                        continue;
                    }
                    island.AddJoint(jEdge.joint);
                    jEdge.joint.m_islandFlag = true;
                    if (other.m_flags & b2Body.e_islandFlag)
                        continue;
                    // Synchronize the connected body.
                    if (other.GetType() != b2Body.b2_staticBody) {
                        other.Advance(minTOI);
                        other.SetAwake(true);
                    }
                    //b2Settings.b2Assert(queueStart + queueSize < queueCapacity);
                    queue[queueStart + queueSize] = other;
                    ++queueSize;
                    other.m_flags |= b2Body.e_islandFlag;
                }
            }
            var subStep = b2World.s_timestep;
            subStep.warmStarting = false;
            subStep.dt = (1.0 - minTOI) * step.dt;
            subStep.inv_dt = 1.0 / subStep.dt;
            subStep.dtRatio = 0.0;
            subStep.velocityIterations = step.velocityIterations;
            subStep.positionIterations = step.positionIterations;
            island.SolveTOI(subStep);
            var i /** int */;
            // Post solve cleanup.
            for (i = 0; i < island.m_bodyCount; ++i) {
                // Allow bodies to participate in future TOI islands.
                b = island.m_bodies[i];
                b.m_flags &= ~b2Body.e_islandFlag;
                if (b.IsAwake() == false) {
                    continue;
                }
                if (b.GetType() != b2Body.b2_dynamicBody) {
                    continue;
                }
                // Update fixtures (for broad-phase).
                b.SynchronizeFixtures();
                // Invalidate all contact TOIs associated with this body. Some of these
                // may not be in the island because they were not touching.
                for (cEdge = b.m_contactList; cEdge; cEdge = cEdge.next) {
                    cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
                }
            }
            for (i = 0; i < island.m_contactCount; ++i) {
                // Allow contacts to participate in future TOI islands.
                c = island.m_contacts[i];
                c.m_flags &= ~(b2Contact.e_toiFlag | b2Contact.e_islandFlag);
            }
            for (i = 0; i < island.m_jointCount; ++i) {
                // Allow joints to participate in future TOI islands
                j = island.m_joints[i];
                j.m_islandFlag = false;
            }
            // Commit fixture proxy movements to the broad-phase so that new contacts are created.
            // Also, some contacts can be destroyed.
            this.m_contactManager.FindNewContacts();
        }
        //this.m_stackAllocator.Free(queue);
    };
    //
    b2World.prototype.DrawJoint = function (joint) {
        var b1 = joint.GetBodyA();
        var b2 = joint.GetBodyB();
        var xf1 = b1.m_xf;
        var xf2 = b2.m_xf;
        var x1 = xf1.position;
        var x2 = xf2.position;
        var p1 = joint.GetAnchorA();
        var p2 = joint.GetAnchorB();
        //b2Color color(0.5f, 0.8f, 0.8f);
        var color = b2World.s_jointColor;
        switch (joint.m_type) {
            case b2Joint.e_distanceJoint:
                this.m_debugDraw.DrawSegment(p1, p2, color);
                break;
            case b2Joint.e_pulleyJoint:
                {
                    var pulley = joint;
                    var s1 = pulley.GetGroundAnchorA();
                    var s2 = pulley.GetGroundAnchorB();
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
    b2World.prototype.DrawShape = function (shape, xf, color) {
        switch (shape.m_type) {
            case b2Shape.e_circleShape:
                {
                    var circle = shape;
                    var center = b2Math.MulX(xf, circle.m_p);
                    var radius = circle.m_radius;
                    var axis = xf.R.col1;
                    this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                }
                break;
            case b2Shape.e_polygonShape:
                {
                    var i = void 0 /** int */;
                    var poly = shape;
                    var vertexCount = poly.GetVertexCount();
                    var localVertices = poly.GetVertices();
                    var vertices = new Array(vertexCount);
                    for (i = 0; i < vertexCount; ++i) {
                        vertices[i] = b2Math.MulX(xf, localVertices[i]);
                    }
                    this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                }
                break;
            case b2Shape.e_edgeShape:
                {
                    var edge = shape;
                    this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
                }
                break;
        }
    };
    b2World.s_timestep2 = new b2TimeStep();
    b2World.s_xf = new b2Transform();
    b2World.s_backupA = new b2Sweep();
    b2World.s_backupB = new b2Sweep();
    b2World.s_timestep = new b2TimeStep();
    b2World.s_queue = new Array();
    b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
    // this.m_flags
    b2World.e_newFixture = 0x0001;
    b2World.e_locked = 0x0002;
    return b2World;
}());
export { b2World };
