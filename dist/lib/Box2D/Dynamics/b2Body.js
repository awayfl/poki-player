import { b2Math, b2Vec2, b2Transform, b2Sweep } from '../Common/Math';
import { b2Settings } from '../Common/b2Settings';
import { b2BodyDef } from './b2BodyDef';
import { b2Fixture } from './b2Fixture';
import { b2FixtureDef } from './b2FixtureDef';
import { b2World } from './b2World';
/**
* A rigid body.
*/
var b2Body = /** @class */ (function () {
    //--------------- Internals Below -------------------
    // Constructor
    /**
     * @private
     */
    function b2Body(bd, world) {
        //b2Settings.b2Assert(world.IsLocked() == false);
        this.__fast__ = true;
        this.m_xf = new b2Transform(); // the body origin transform
        this.m_sweep = new b2Sweep(); // the swept motion for CCD
        this.m_linearVelocity = new b2Vec2();
        this.m_force = new b2Vec2();
        //b2Settings.b2Assert(bd.position.IsValid());
        //b2Settings.b2Assert(bd.linearVelocity.IsValid());
        //b2Settings.b2Assert(b2Math.b2IsValid(bd.angle));
        //b2Settings.b2Assert(b2Math.b2IsValid(bd.angularVelocity));
        //b2Settings.b2Assert(b2Math.b2IsValid(bd.inertiaScale) && bd.inertiaScale >= 0.0);
        //b2Settings.b2Assert(b2Math.b2IsValid(bd.angularDamping) && bd.angularDamping >= 0.0);
        //b2Settings.b2Assert(b2Math.b2IsValid(bd.linearDamping) && bd.linearDamping >= 0.0);
        this.m_flags = 0;
        if (bd.bullet) {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        if (bd.fixedRotation) {
            this.m_flags |= b2Body.e_fixedRotationFlag;
        }
        if (bd.allowSleep) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        if (bd.awake) {
            this.m_flags |= b2Body.e_awakeFlag;
        }
        if (bd.active) {
            this.m_flags |= b2Body.e_activeFlag;
        }
        this.m_world = world;
        this.m_xf.position.SetV(bd.position);
        this.m_xf.R.Set(bd.angle);
        this.m_sweep.localCenter.SetZero();
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
        this.m_controllerList = null;
        this.m_contactList = null;
        this.m_controllerCount = 0;
        this.m_prev = null;
        this.m_next = null;
        this.m_linearVelocity.SetV(bd.linearVelocity);
        this.m_angularVelocity = bd.angularVelocity;
        this.m_linearDamping = bd.linearDamping;
        this.m_angularDamping = bd.angularDamping;
        this.m_force.Set(0.0, 0.0);
        this.m_torque = 0.0;
        this.m_sleepTime = 0.0;
        this.m_type = bd.type;
        if (this.m_type == b2Body.b2_dynamicBody) {
            this.m_mass = 1.0;
            this.m_invMass = 1.0;
        }
        else {
            this.m_mass = 0.0;
            this.m_invMass = 0.0;
        }
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_inertiaScale = bd.inertiaScale;
        this.m_userData = bd.userData;
        this.m_fixtureList = null;
        this.m_fixtureCount = 0;
    }
    b2Body.prototype.connectEdges = function (s1, s2, angle1) {
        var angle2 = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x);
        var coreOffset = Math.tan((angle2 - angle1) * 0.5);
        var core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
        core = b2Math.SubtractVV(core, s2.GetNormalVector());
        core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
        core = b2Math.AddVV(core, s2.GetVertex1());
        var cornerDir = b2Math.AddVV(s1.GetDirectionVector(), s2.GetDirectionVector());
        cornerDir.Normalize();
        var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0.0;
        s1.SetNextEdge(s2, core, cornerDir, convex);
        s2.SetPrevEdge(s1, core, cornerDir, convex);
        return angle2;
    };
    /**
     * Creates a fixture and attach it to this body. Use this function if you need
     * to set some fixture parameters, like friction. Otherwise you can create the
     * fixture directly from a shape.
     * If the density is non-zero, this function automatically updates the mass of the body.
     * Contacts are not created until the next time step.
     * @param fixtureDef the fixture definition.
     * @warning This function is locked during callbacks.
     */
    b2Body.prototype.CreateFixture = function (def) {
        //b2Settings.b2Assert(this.m_world.IsLocked() == false);
        if (this.m_world.IsLocked() == true) {
            return null;
        }
        // TODO: Decide on a better place to initialize edgeShapes. (b2Shape::Create() can't
        //       return more than one shape to add to parent body... maybe it should add
        //       shapes directly to the body instead of returning them?)
        /*
        if (def.type == b2Shape.e_edgeShape) {
            var edgeDef: b2EdgeChainDef = def as b2EdgeChainDef;
            var v1: b2Vec2;
            var v2: b2Vec2;
            var i: int;

            if (edgeDef.isALoop) {
                v1 = edgeDef.vertices[edgeDef.vertexCount-1];
                i = 0;
            } else {
                v1 = edgeDef.vertices[0];
                i = 1;
            }

            var s0: b2EdgeShape = null;
            var s1: b2EdgeShape = null;
            var s2: b2EdgeShape = null;
            var angle: number = 0.0;
            for (; i < edgeDef.vertexCount; i++) {
                v2 = edgeDef.vertices[i];

                //void* mem = this.m_world->m_blockAllocator.Allocate(sizeof(b2EdgeShape));
                s2 = new b2EdgeShape(v1, v2, def);
                s2.this.m_next = m_shapeList;
                m_shapeList = s2;
                ++m_shapeCount;
                s2.m_body = this;
                s2.CreateProxy(this.m_world.m_broadPhase, this.m_xf);
                s2.UpdateSweepRadius(this.m_sweep.localCenter);

                if (s1 == null) {
                    s0 = s2;
                    angle = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x);
                } else {
                    angle = connectEdges(s1, s2, angle);
                }
                s1 = s2;
                v1 = v2;
            }
            if (edgeDef.isALoop) connectEdges(s1, s0, angle);
            return s0;
        }*/
        var fixture = new b2Fixture();
        fixture.Create(this, this.m_xf, def);
        if (this.m_flags & b2Body.e_activeFlag) {
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.CreateProxy(broadPhase, this.m_xf);
        }
        fixture.m_next = this.m_fixtureList;
        this.m_fixtureList = fixture;
        ++this.m_fixtureCount;
        fixture.m_body = this;
        // Adjust mass properties if needed
        if (fixture.m_density > 0.0) {
            this.ResetMassData();
        }
        // Let the world know we have a new fixture. This will cause new contacts to be created
        // at the beginning of the next time step.
        this.m_world.m_flags |= b2World.e_newFixture;
        return fixture;
    };
    /**
     * Creates a fixture from a shape and attach it to this body.
     * This is a convenience function. Use b2FixtureDef if you need to set parameters
     * like friction, restitution, user data, or filtering.
     * This function automatically updates the mass of the body.
     * @param shape the shape to be cloned.
     * @param density the shape density (set to zero for static bodies).
     * @warning This function is locked during callbacks.
     */
    b2Body.prototype.CreateFixture2 = function (shape, density) {
        if (density === void 0) { density = 0.0; }
        var def = new b2FixtureDef();
        def.shape = shape;
        def.density = density;
        return this.CreateFixture(def);
    };
    /**
     * Destroy a fixture. This removes the fixture from the broad-phase and
     * destroys all contacts associated with this fixture. This will
     * automatically adjust the mass of the body if the body is dynamic and the
     * fixture has positive density.
     * All fixtures attached to a body are implicitly destroyed when the body is destroyed.
     * @param fixture the fixture to be removed.
     * @warning This function is locked during callbacks.
     */
    b2Body.prototype.DestroyFixture = function (fixture) {
        //b2Settings.b2Assert(this.m_world.IsLocked() == false);
        if (this.m_world.IsLocked() == true) {
            return;
        }
        //b2Settings.b2Assert(this.m_fixtureCount > 0);
        //b2Fixture** node = &this.m_fixtureList;
        var node = this.m_fixtureList;
        var ppF = null; // Fix pointer-pointer stuff
        var found = false;
        while (node != null) {
            if (node == fixture) {
                if (ppF)
                    ppF.m_next = fixture.m_next;
                else
                    this.m_fixtureList = fixture.m_next;
                //node = fixture.this.m_next;
                found = true;
                break;
            }
            ppF = node;
            node = node.m_next;
        }
        // You tried to remove a shape that is not attached to this body.
        //b2Settings.b2Assert(found);
        // Destroy any contacts associated with the fixture.
        var edge = this.m_contactList;
        while (edge) {
            var c = edge.contact;
            edge = edge.next;
            var fixtureA = c.GetFixtureA();
            var fixtureB = c.GetFixtureB();
            if (fixture == fixtureA || fixture == fixtureB) {
                // This destros the contact and removes it from
                // this body's contact list
                this.m_world.m_contactManager.Destroy(c);
            }
        }
        if (this.m_flags & b2Body.e_activeFlag) {
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            fixture.DestroyProxy(broadPhase);
        }
        else {
            //b2Assert(fixture->m_proxyId == b2BroadPhase::e_nullProxy);
        }
        fixture.Destroy();
        fixture.m_body = null;
        fixture.m_next = null;
        --this.m_fixtureCount;
        // Reset the mass data.
        this.ResetMassData();
    };
    /**
    * Set the position of the body's origin and rotation (radians).
    * This breaks any contacts and wakes the other bodies.
    * @param position the new world position of the body's origin (not necessarily
    * the center of mass).
    * @param angle the new world rotation angle of the body in radians.
    */
    b2Body.prototype.SetPositionAndAngle = function (position, angle) {
        var f;
        //b2Settings.b2Assert(this.m_world.IsLocked() == false);
        if (this.m_world.IsLocked() == true) {
            return;
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
        var broadPhase = this.m_world.m_contactManager.m_broadPhase;
        for (f = this.m_fixtureList; f; f = f.m_next) {
            f.Synchronize(broadPhase, this.m_xf, this.m_xf);
        }
        this.m_world.m_contactManager.FindNewContacts();
    };
    /**
     * Set the position of the body's origin and rotation (radians).
     * This breaks any contacts and wakes the other bodies.
     * Note this is less efficient than the other overload - you should use that
     * if the angle is available.
     * @param xf the transform of position and angle to set the bdoy to.
     */
    b2Body.prototype.SetTransform = function (xf) {
        this.SetPositionAndAngle(xf.position, xf.GetAngle());
    };
    /**
    * Get the body transform for the body's origin.
    * @return the world transform of the body's origin.
    */
    b2Body.prototype.GetTransform = function () {
        return this.m_xf;
    };
    /**
    * Get the world body origin position.
    * @return the world position of the body's origin.
    */
    b2Body.prototype.GetPosition = function () {
        return this.m_xf.position;
    };
    /**
     * Setthe world body origin position.
     * @param position the new position of the body
     */
    b2Body.prototype.SetPosition = function (position) {
        this.SetPositionAndAngle(position, this.GetAngle());
    };
    /**
    * Get the angle in radians.
    * @return the current world rotation angle in radians.
    */
    b2Body.prototype.GetAngle = function () {
        return this.m_sweep.a;
    };
    /**
     * Set the world body angle
     * @param angle the new angle of the body.
     */
    b2Body.prototype.SetAngle = function (angle) {
        this.SetPositionAndAngle(this.GetPosition(), angle);
    };
    /**
    * Get the world position of the center of mass.
    */
    b2Body.prototype.GetWorldCenter = function () {
        return this.m_sweep.c;
    };
    /**
    * Get the local position of the center of mass.
    */
    b2Body.prototype.GetLocalCenter = function () {
        return this.m_sweep.localCenter;
    };
    /**
    * Set the linear velocity of the center of mass.
    * @param v the new linear velocity of the center of mass.
    */
    b2Body.prototype.SetLinearVelocity = function (v) {
        if (this.m_type == b2Body.b2_staticBody) {
            return;
        }
        this.m_linearVelocity.SetV(v);
    };
    /**
    * Get the linear velocity of the center of mass.
    * @return the linear velocity of the center of mass.
    */
    b2Body.prototype.GetLinearVelocity = function () {
        return this.m_linearVelocity;
    };
    /**
    * Set the angular velocity.
    * @param omega the new angular velocity in radians/second.
    */
    b2Body.prototype.SetAngularVelocity = function (omega) {
        if (this.m_type == b2Body.b2_staticBody) {
            return;
        }
        this.m_angularVelocity = omega;
    };
    /**
    * Get the angular velocity.
    * @return the angular velocity in radians/second.
    */
    b2Body.prototype.GetAngularVelocity = function () {
        return this.m_angularVelocity;
    };
    /**
     * Get the definition containing the body properties.
     * @asonly
     */
    b2Body.prototype.GetDefinition = function () {
        var bd = new b2BodyDef();
        bd.type = this.GetType();
        bd.allowSleep = (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
        bd.angle = this.GetAngle();
        bd.angularDamping = this.m_angularDamping;
        bd.angularVelocity = this.m_angularVelocity;
        bd.fixedRotation = (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
        bd.bullet = (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
        bd.awake = (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
        bd.linearDamping = this.m_linearDamping;
        bd.linearVelocity.SetV(this.GetLinearVelocity());
        bd.position = this.GetPosition();
        bd.userData = this.GetUserData();
        return bd;
    };
    /**
    * Apply a force at a world point. If the force is not
    * applied at the center of mass, it will generate a torque and
    * affect the angular velocity. This wakes up the body.
    * @param force the world force vector, usually in Newtons (N).
    * @param point the world position of the point of application.
    */
    b2Body.prototype.ApplyForce = function (force, point) {
        if (this.m_type != b2Body.b2_dynamicBody) {
            return;
        }
        if (this.IsAwake() == false) {
            this.SetAwake(true);
        }
        //this.m_force += force;
        this.m_force.x += force.x;
        this.m_force.y += force.y;
        //this.m_torque += b2Cross(point - this.m_sweep.c, force);
        this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
    };
    /**
    * Apply a torque. This affects the angular velocity
    * without affecting the linear velocity of the center of mass.
    * This wakes up the body.
    * @param torque about the z-axis (out of the screen), usually in N-m.
    */
    b2Body.prototype.ApplyTorque = function (torque) {
        if (this.m_type != b2Body.b2_dynamicBody) {
            return;
        }
        if (this.IsAwake() == false) {
            this.SetAwake(true);
        }
        this.m_torque += torque;
    };
    /**
    * Apply an impulse at a point. This immediately modifies the velocity.
    * It also modifies the angular velocity if the point of application
    * is not at the center of mass. This wakes up the body.
    * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
    * @param point the world position of the point of application.
    */
    b2Body.prototype.ApplyImpulse = function (impulse, point) {
        if (this.m_type != b2Body.b2_dynamicBody) {
            return;
        }
        if (this.IsAwake() == false) {
            this.SetAwake(true);
        }
        //this.m_linearVelocity += this.m_invMass * impulse;
        this.m_linearVelocity.x += this.m_invMass * impulse.x;
        this.m_linearVelocity.y += this.m_invMass * impulse.y;
        //this.m_angularVelocity += this.m_invI * b2Cross(point - this.m_sweep.c, impulse);
        this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
    };
    /**
     * Splits a body into two, preserving dynamic properties
     * @param	callback Called once per fixture, return true to move this fixture to the new body
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * @return The newly created bodies
     * @asonly
     */
    b2Body.prototype.Split = function (callback) {
        var linearVelocity = this.GetLinearVelocity().Copy(); //Reset mass will alter this
        var angularVelocity = this.GetAngularVelocity();
        var center = this.GetWorldCenter();
        var body1 = this;
        var body2 = this.m_world.CreateBody(this.GetDefinition());
        var prev;
        for (var f = body1.m_fixtureList; f;) {
            if (callback(f)) {
                var next = f.m_next;
                // Remove fixture
                if (prev) {
                    prev.m_next = next;
                }
                else {
                    body1.m_fixtureList = next;
                }
                body1.m_fixtureCount--;
                // Add fixture
                f.m_next = body2.m_fixtureList;
                body2.m_fixtureList = f;
                body2.m_fixtureCount++;
                f.m_body = body2;
                f = next;
            }
            else {
                prev = f;
                f = f.m_next;
            }
        }
        body1.ResetMassData();
        body2.ResetMassData();
        // Compute consistent velocites for new bodies based on cached velocity
        var center1 = body1.GetWorldCenter();
        var center2 = body2.GetWorldCenter();
        var velocity1 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center)));
        var velocity2 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center)));
        body1.SetLinearVelocity(velocity1);
        body2.SetLinearVelocity(velocity2);
        body1.SetAngularVelocity(angularVelocity);
        body2.SetAngularVelocity(angularVelocity);
        body1.SynchronizeFixtures();
        body2.SynchronizeFixtures();
        return body2;
    };
    /**
     * Merges another body into this. Only fixtures, mass and velocity are effected,
     * Other properties are ignored
     * @asonly
     */
    b2Body.prototype.Merge = function (other) {
        var f;
        for (f = other.m_fixtureList; f;) {
            var next = f.m_next;
            // Remove fixture
            other.m_fixtureCount--;
            // Add fixture
            f.m_next = this.m_fixtureList;
            this.m_fixtureList = f;
            this.m_fixtureCount++;
            f.m_body = body2;
            f = next;
        }
        body1.m_fixtureCount = 0;
        // Recalculate velocities
        var body1 = this;
        var body2 = other;
        // Compute consistent velocites for new bodies based on cached velocity
        var center1 = body1.GetWorldCenter();
        var center2 = body2.GetWorldCenter();
        var velocity1 = body1.GetLinearVelocity().Copy();
        var velocity2 = body2.GetLinearVelocity().Copy();
        var angular1 = body1.GetAngularVelocity();
        var angular = body2.GetAngularVelocity();
        // TODO
        body1.ResetMassData();
        this.SynchronizeFixtures();
    };
    /**
    * Get the total mass of the body.
    * @return the mass, usually in kilograms (kg).
    */
    b2Body.prototype.GetMass = function () {
        return this.m_mass;
    };
    /**
    * Get the central rotational inertia of the body.
    * @return the rotational inertia, usually in kg-m^2.
    */
    b2Body.prototype.GetInertia = function () {
        return this.m_I;
    };
    /**
     * Get the mass data of the body. The rotational inertial is relative to the center of mass.
     */
    b2Body.prototype.GetMassData = function (data) {
        data.mass = this.m_mass;
        data.I = this.m_I;
        data.center.SetV(this.m_sweep.localCenter);
    };
    /**
     * Set the mass properties to override the mass properties of the fixtures
     * Note that this changes the center of mass position.
     * Note that creating or destroying fixtures can also alter the mass.
     * This function has no effect if the body isn't dynamic.
     * @warning The supplied rotational inertia should be relative to the center of mass
     * @param	data the mass properties.
     */
    b2Body.prototype.SetMassData = function (massData) {
        b2Settings.b2Assert(this.m_world.IsLocked() == false);
        if (this.m_world.IsLocked() == true) {
            return;
        }
        if (this.m_type != b2Body.b2_dynamicBody) {
            return;
        }
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_mass = massData.mass;
        // Compute the center of mass.
        if (this.m_mass <= 0.0) {
            this.m_mass = 1.0;
        }
        this.m_invMass = 1.0 / this.m_mass;
        if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            // Center the inertia about the center of mass
            this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
            this.m_invI = 1.0 / this.m_I;
        }
        // Move center of mass
        var oldCenter = this.m_sweep.c.Copy();
        this.m_sweep.localCenter.SetV(massData.center);
        this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
        this.m_sweep.c.SetV(this.m_sweep.c0);
        // Update center of mass velocity
        //this.m_linearVelocity += b2Cross(this.m_angularVelocity, this.m_sweep.c - oldCenter);
        this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
        this.m_linearVelocity.y += this.m_angularVelocity * +(this.m_sweep.c.x - oldCenter.x);
    };
    /**
     * This resets the mass properties to the sum of the mass properties of the fixtures.
     * This normally does not need to be called unless you called SetMassData to override
     * the mass and later you want to reset the mass.
     */
    b2Body.prototype.ResetMassData = function () {
        // Compute mass data from shapes. Each shape has it's own density
        this.m_mass = 0.0;
        this.m_invMass = 0.0;
        this.m_I = 0.0;
        this.m_invI = 0.0;
        this.m_sweep.localCenter.SetZero();
        // Static and kinematic bodies have zero mass.
        if (this.m_type == b2Body.b2_staticBody || this.m_type == b2Body.b2_kinematicBody) {
            return;
        }
        //b2Assert(this.m_type == b2Body.b2_dynamicBody);
        // Accumulate mass over all fixtures.
        var center = b2Vec2.Make(0, 0);
        for (var f = this.m_fixtureList; f; f = f.m_next) {
            if (f.m_density == 0.0) {
                continue;
            }
            var massData = f.GetMassData();
            this.m_mass += massData.mass;
            center.x += massData.center.x * massData.mass;
            center.y += massData.center.y * massData.mass;
            this.m_I += massData.I;
        }
        // Compute the center of mass.
        if (this.m_mass > 0.0) {
            this.m_invMass = 1.0 / this.m_mass;
            center.x *= this.m_invMass;
            center.y *= this.m_invMass;
        }
        else {
            // Force all dynamic bodies to have a positive mass.
            this.m_mass = 1.0;
            this.m_invMass = 1.0;
        }
        if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
            // Center the inertia about the center of mass
            this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
            this.m_I *= this.m_inertiaScale;
            b2Settings.b2Assert(this.m_I > 0);
            this.m_invI = 1.0 / this.m_I;
        }
        else {
            this.m_I = 0.0;
            this.m_invI = 0.0;
        }
        // Move center of mass
        var oldCenter = this.m_sweep.c.Copy();
        this.m_sweep.localCenter.SetV(center);
        this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
        this.m_sweep.c.SetV(this.m_sweep.c0);
        // Update center of mass velocity
        //this.m_linearVelocity += b2Cross(this.m_angularVelocity, this.m_sweep.c - oldCenter);
        this.m_linearVelocity.x += this.m_angularVelocity * -(this.m_sweep.c.y - oldCenter.y);
        this.m_linearVelocity.y += this.m_angularVelocity * +(this.m_sweep.c.x - oldCenter.x);
    };
    /**
     * Get the world coordinates of a point given the local coordinates.
     * @param localPoint a point on the body measured relative the the body's origin.
     * @return the same point expressed in world coordinates.
     */
    b2Body.prototype.GetWorldPoint = function (localPoint) {
        //return b2Math.b2MulX(this.m_xf, localPoint);
        var A = this.m_xf.R;
        var u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
        u.x += this.m_xf.position.x;
        u.y += this.m_xf.position.y;
        return u;
    };
    /**
     * Get the world coordinates of a vector given the local coordinates.
     * @param localVector a vector fixed in the body.
     * @return the same vector expressed in world coordinates.
     */
    b2Body.prototype.GetWorldVector = function (localVector) {
        return b2Math.MulMV(this.m_xf.R, localVector);
    };
    /**
     * Gets a local point relative to the body's origin given a world point.
     * @param a point in world coordinates.
     * @return the corresponding local point relative to the body's origin.
     */
    b2Body.prototype.GetLocalPoint = function (worldPoint) {
        return b2Math.MulXT(this.m_xf, worldPoint);
    };
    /**
     * Gets a local vector given a world vector.
     * @param a vector in world coordinates.
     * @return the corresponding local vector.
     */
    b2Body.prototype.GetLocalVector = function (worldVector) {
        return b2Math.MulTMV(this.m_xf.R, worldVector);
    };
    /**
    * Get the world linear velocity of a world point attached to this body.
    * @param a point in world coordinates.
    * @return the world velocity of a point.
    */
    b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
        //return          this.m_linearVelocity   + b2Cross(this.m_angularVelocity,   worldPoint   - this.m_sweep.c);
        return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
    };
    /**
    * Get the world velocity of a local point.
    * @param a point in local coordinates.
    * @return the world velocity of a point.
    */
    b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
        //return GetLinearVelocityFromWorldPoint(GetWorldPoint(localPoint));
        var A = this.m_xf.R;
        var worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
        worldPoint.x += this.m_xf.position.x;
        worldPoint.y += this.m_xf.position.y;
        return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
    };
    /**
    * Get the linear damping of the body.
    */
    b2Body.prototype.GetLinearDamping = function () {
        return this.m_linearDamping;
    };
    /**
    * Set the linear damping of the body.
    */
    b2Body.prototype.SetLinearDamping = function (linearDamping) {
        this.m_linearDamping = linearDamping;
    };
    /**
    * Get the angular damping of the body
    */
    b2Body.prototype.GetAngularDamping = function () {
        return this.m_angularDamping;
    };
    /**
    * Set the angular damping of the body.
    */
    b2Body.prototype.SetAngularDamping = function (angularDamping) {
        this.m_angularDamping = angularDamping;
    };
    /**
     * Set the type of this body. This may alter the mass and velocity
     * @param	type - enum stored as a static member of b2Body
     */
    b2Body.prototype.SetType = function (type /** uint */) {
        if (this.m_type == type) {
            return;
        }
        this.m_type = type;
        this.ResetMassData();
        if (this.m_type == b2Body.b2_staticBody) {
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
        }
        this.SetAwake(true);
        this.m_force.SetZero();
        this.m_torque = 0.0;
        // Since the body type changed, we need to flag contacts for filtering.
        for (var ce = this.m_contactList; ce; ce = ce.next) {
            ce.contact.FlagForFiltering();
        }
    };
    /**
     * Get the type of this body.
     * @return type enum as a uint
     */
    b2Body.prototype.GetType = function () {
        return this.m_type;
    };
    /**
    * Should this body be treated like a bullet for continuous collision detection?
    */
    b2Body.prototype.SetBullet = function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_bulletFlag;
        }
        else {
            this.m_flags &= ~b2Body.e_bulletFlag;
        }
    };
    /**
    * Is this body treated like a bullet for continuous collision detection?
    */
    b2Body.prototype.IsBullet = function () {
        return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
    };
    /**
     * Is this body allowed to sleep
     * @param	flag
     */
    b2Body.prototype.SetSleepingAllowed = function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_allowSleepFlag;
        }
        else {
            this.m_flags &= ~b2Body.e_allowSleepFlag;
            this.SetAwake(true);
        }
    };
    /**
     * Set the sleep state of the body. A sleeping body has vety low CPU cost.
     * @param	flag - set to true to put body to sleep, false to wake it
     */
    b2Body.prototype.SetAwake = function (flag) {
        if (flag) {
            this.m_flags |= b2Body.e_awakeFlag;
            this.m_sleepTime = 0.0;
        }
        else {
            this.m_flags &= ~b2Body.e_awakeFlag;
            this.m_sleepTime = 0.0;
            this.m_linearVelocity.SetZero();
            this.m_angularVelocity = 0.0;
            this.m_force.SetZero();
            this.m_torque = 0.0;
        }
    };
    /**
     * Get the sleeping state of this body.
     * @return true if body is sleeping
     */
    b2Body.prototype.IsAwake = function () {
        return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
    };
    /**
     * Set this body to have fixed rotation. This causes the mass to be reset.
     * @param	fixed - true means no rotation
     */
    b2Body.prototype.SetFixedRotation = function (fixed) {
        if (fixed) {
            this.m_flags |= b2Body.e_fixedRotationFlag;
        }
        else {
            this.m_flags &= ~b2Body.e_fixedRotationFlag;
        }
        this.ResetMassData();
    };
    /**
    * Does this body have fixed rotation?
    * @return true means fixed rotation
    */
    b2Body.prototype.IsFixedRotation = function () {
        return (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
    };
    /** Set the active state of the body. An inactive body is not
    * simulated and cannot be collided with or woken up.
    * If you pass a flag of true, all fixtures will be added to the
    * broad-phase.
    * If you pass a flag of false, all fixtures will be removed from
    * the broad-phase and all contacts will be destroyed.
    * Fixtures and joints are otherwise unaffected. You may continue
    * to create/destroy fixtures and joints on inactive bodies.
    * Fixtures on an inactive body are implicitly inactive and will
    * not participate in collisions, ray-casts, or queries.
    * Joints connected to an inactive body are implicitly inactive.
    * An inactive body is still owned by a b2World object and remains
    * in the body list.
    */
    b2Body.prototype.SetActive = function (flag) {
        if (flag == this.IsActive()) {
            return;
        }
        var broadPhase;
        var f;
        if (flag) {
            this.m_flags |= b2Body.e_activeFlag;
            // Create all proxies.
            broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (f = this.m_fixtureList; f; f = f.m_next) {
                f.CreateProxy(broadPhase, this.m_xf);
            }
            // Contacts are created the next time step.
        }
        else {
            this.m_flags &= ~b2Body.e_activeFlag;
            // Destroy all proxies.
            broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (f = this.m_fixtureList; f; f = f.m_next) {
                f.DestroyProxy(broadPhase);
            }
            // Destroy the attached contacts.
            var ce = this.m_contactList;
            while (ce) {
                var ce0 = ce;
                ce = ce.next;
                this.m_world.m_contactManager.Destroy(ce0.contact);
            }
            this.m_contactList = null;
        }
    };
    /**
     * Get the active state of the body.
     * @return true if active.
     */
    b2Body.prototype.IsActive = function () {
        return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
    };
    /**
    * Is this body allowed to sleep?
    */
    b2Body.prototype.IsSleepingAllowed = function () {
        return (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
    };
    /**
    * Get the list of all fixtures attached to this body.
    */
    b2Body.prototype.GetFixtureList = function () {
        return this.m_fixtureList;
    };
    /**
    * Get the list of all joints attached to this body.
    */
    b2Body.prototype.GetJointList = function () {
        return this.m_jointList;
    };
    /**
     * Get the list of all controllers attached to this body.
     */
    b2Body.prototype.GetControllerList = function () {
        return this.m_controllerList;
    };
    /**
     * Get a list of all contacts attached to this body.
     */
    b2Body.prototype.GetContactList = function () {
        return this.m_contactList;
    };
    /**
    * Get the next body in the world's body list.
    */
    b2Body.prototype.GetNext = function () {
        return this.m_next;
    };
    /**
    * Get the user data pointer that was provided in the body definition.
    */
    b2Body.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /**
    * Set the user data. Use this to store your application specific data.
    */
    b2Body.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    /**
    * Get the parent world of this body.
    */
    b2Body.prototype.GetWorld = function () {
        return this.m_world;
    };
    //
    b2Body.prototype.SynchronizeFixtures = function () {
        var xf1 = b2Body.s_xf1;
        xf1.R.Set(this.m_sweep.a0);
        //xf1.position = this.m_sweep.c0 - b2Mul(xf1.R, this.m_sweep.localCenter);
        var tMat = xf1.R;
        var tVec = this.m_sweep.localCenter;
        xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
        xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
        var f;
        var broadPhase = this.m_world.m_contactManager.m_broadPhase;
        for (f = this.m_fixtureList; f; f = f.m_next) {
            f.Synchronize(broadPhase, xf1, this.m_xf);
        }
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
    b2Body.prototype.ShouldCollide = function (other) {
        // At least one body should be dynamic
        if (this.m_type != b2Body.b2_dynamicBody && other.m_type != b2Body.b2_dynamicBody) {
            return false;
        }
        // Does a joint prevent collision?
        for (var jn = this.m_jointList; jn; jn = jn.next) {
            if (jn.other == other)
                if (jn.joint.m_collideConnected == false) {
                    return false;
                }
        }
        return true;
    };
    b2Body.prototype.Advance = function (t) {
        // Advance to the new safe time.
        this.m_sweep.Advance(t);
        this.m_sweep.c.SetV(this.m_sweep.c0);
        this.m_sweep.a = this.m_sweep.a0;
        this.SynchronizeTransform();
    };
    // Destructor
    //~b2Body();
    //
    b2Body.s_xf1 = new b2Transform();
    // m_flags
    //enum
    //{
    b2Body.e_islandFlag = 0x0001;
    b2Body.e_awakeFlag = 0x0002;
    b2Body.e_allowSleepFlag = 0x0004;
    b2Body.e_bulletFlag = 0x0008;
    b2Body.e_fixedRotationFlag = 0x0010;
    b2Body.e_activeFlag = 0x0020;
    //};
    // this.m_type
    //enum
    //{
    /// The body type.
    /// static: zero mass, zero velocity, may be manually moved
    /// kinematic: zero mass, non-zero velocity set by user, moved by solver
    /// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
    b2Body.b2_staticBody = 0;
    b2Body.b2_kinematicBody = 1;
    b2Body.b2_dynamicBody = 2;
    return b2Body;
}());
export { b2Body };
