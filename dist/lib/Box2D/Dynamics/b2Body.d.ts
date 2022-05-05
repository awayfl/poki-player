import { b2Vec2, b2Transform, b2Sweep } from '../Common/Math';
import { b2BodyDef } from './b2BodyDef';
import { b2Fixture } from './b2Fixture';
import { b2FixtureDef } from './b2FixtureDef';
import { b2World } from './b2World';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2ContactEdge } from './Contacts';
import { b2JointEdge } from './Joints';
import { b2MassData } from '../Collision/Shapes/b2MassData';
import { b2ControllerEdge } from './Controllers/b2ControllerEdge';
/**
* A rigid body.
*/
export declare class b2Body {
    __fast__: boolean;
    private connectEdges;
    /**
     * Creates a fixture and attach it to this body. Use this function if you need
     * to set some fixture parameters, like friction. Otherwise you can create the
     * fixture directly from a shape.
     * If the density is non-zero, this function automatically updates the mass of the body.
     * Contacts are not created until the next time step.
     * @param fixtureDef the fixture definition.
     * @warning This function is locked during callbacks.
     */
    CreateFixture(def: b2FixtureDef): b2Fixture;
    /**
     * Creates a fixture from a shape and attach it to this body.
     * This is a convenience function. Use b2FixtureDef if you need to set parameters
     * like friction, restitution, user data, or filtering.
     * This function automatically updates the mass of the body.
     * @param shape the shape to be cloned.
     * @param density the shape density (set to zero for static bodies).
     * @warning This function is locked during callbacks.
     */
    CreateFixture2(shape: b2Shape, density?: number): b2Fixture;
    /**
     * Destroy a fixture. This removes the fixture from the broad-phase and
     * destroys all contacts associated with this fixture. This will
     * automatically adjust the mass of the body if the body is dynamic and the
     * fixture has positive density.
     * All fixtures attached to a body are implicitly destroyed when the body is destroyed.
     * @param fixture the fixture to be removed.
     * @warning This function is locked during callbacks.
     */
    DestroyFixture(fixture: b2Fixture): void;
    /**
    * Set the position of the body's origin and rotation (radians).
    * This breaks any contacts and wakes the other bodies.
    * @param position the new world position of the body's origin (not necessarily
    * the center of mass).
    * @param angle the new world rotation angle of the body in radians.
    */
    SetPositionAndAngle(position: b2Vec2, angle: number): void;
    /**
     * Set the position of the body's origin and rotation (radians).
     * This breaks any contacts and wakes the other bodies.
     * Note this is less efficient than the other overload - you should use that
     * if the angle is available.
     * @param xf the transform of position and angle to set the bdoy to.
     */
    SetTransform(xf: b2Transform): void;
    /**
    * Get the body transform for the body's origin.
    * @return the world transform of the body's origin.
    */
    GetTransform(): b2Transform;
    /**
    * Get the world body origin position.
    * @return the world position of the body's origin.
    */
    GetPosition(): b2Vec2;
    /**
     * Setthe world body origin position.
     * @param position the new position of the body
     */
    SetPosition(position: b2Vec2): void;
    /**
    * Get the angle in radians.
    * @return the current world rotation angle in radians.
    */
    GetAngle(): number;
    /**
     * Set the world body angle
     * @param angle the new angle of the body.
     */
    SetAngle(angle: number): void;
    /**
    * Get the world position of the center of mass.
    */
    GetWorldCenter(): b2Vec2;
    /**
    * Get the local position of the center of mass.
    */
    GetLocalCenter(): b2Vec2;
    /**
    * Set the linear velocity of the center of mass.
    * @param v the new linear velocity of the center of mass.
    */
    SetLinearVelocity(v: b2Vec2): void;
    /**
    * Get the linear velocity of the center of mass.
    * @return the linear velocity of the center of mass.
    */
    GetLinearVelocity(): b2Vec2;
    /**
    * Set the angular velocity.
    * @param omega the new angular velocity in radians/second.
    */
    SetAngularVelocity(omega: number): void;
    /**
    * Get the angular velocity.
    * @return the angular velocity in radians/second.
    */
    GetAngularVelocity(): number;
    /**
     * Get the definition containing the body properties.
     * @asonly
     */
    GetDefinition(): b2BodyDef;
    /**
    * Apply a force at a world point. If the force is not
    * applied at the center of mass, it will generate a torque and
    * affect the angular velocity. This wakes up the body.
    * @param force the world force vector, usually in Newtons (N).
    * @param point the world position of the point of application.
    */
    ApplyForce(force: b2Vec2, point: b2Vec2): void;
    /**
    * Apply a torque. This affects the angular velocity
    * without affecting the linear velocity of the center of mass.
    * This wakes up the body.
    * @param torque about the z-axis (out of the screen), usually in N-m.
    */
    ApplyTorque(torque: number): void;
    /**
    * Apply an impulse at a point. This immediately modifies the velocity.
    * It also modifies the angular velocity if the point of application
    * is not at the center of mass. This wakes up the body.
    * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
    * @param point the world position of the point of application.
    */
    ApplyImpulse(impulse: b2Vec2, point: b2Vec2): void;
    /**
     * Splits a body into two, preserving dynamic properties
     * @param	callback Called once per fixture, return true to move this fixture to the new body
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * @return The newly created bodies
     * @asonly
     */
    Split(callback: Function): b2Body;
    /**
     * Merges another body into this. Only fixtures, mass and velocity are effected,
     * Other properties are ignored
     * @asonly
     */
    Merge(other: b2Body): void;
    /**
    * Get the total mass of the body.
    * @return the mass, usually in kilograms (kg).
    */
    GetMass(): number;
    /**
    * Get the central rotational inertia of the body.
    * @return the rotational inertia, usually in kg-m^2.
    */
    GetInertia(): number;
    /**
     * Get the mass data of the body. The rotational inertial is relative to the center of mass.
     */
    GetMassData(data: b2MassData): void;
    /**
     * Set the mass properties to override the mass properties of the fixtures
     * Note that this changes the center of mass position.
     * Note that creating or destroying fixtures can also alter the mass.
     * This function has no effect if the body isn't dynamic.
     * @warning The supplied rotational inertia should be relative to the center of mass
     * @param	data the mass properties.
     */
    SetMassData(massData: b2MassData): void;
    /**
     * This resets the mass properties to the sum of the mass properties of the fixtures.
     * This normally does not need to be called unless you called SetMassData to override
     * the mass and later you want to reset the mass.
     */
    ResetMassData(): void;
    /**
     * Get the world coordinates of a point given the local coordinates.
     * @param localPoint a point on the body measured relative the the body's origin.
     * @return the same point expressed in world coordinates.
     */
    GetWorldPoint(localPoint: b2Vec2): b2Vec2;
    /**
     * Get the world coordinates of a vector given the local coordinates.
     * @param localVector a vector fixed in the body.
     * @return the same vector expressed in world coordinates.
     */
    GetWorldVector(localVector: b2Vec2): b2Vec2;
    /**
     * Gets a local point relative to the body's origin given a world point.
     * @param a point in world coordinates.
     * @return the corresponding local point relative to the body's origin.
     */
    GetLocalPoint(worldPoint: b2Vec2): b2Vec2;
    /**
     * Gets a local vector given a world vector.
     * @param a vector in world coordinates.
     * @return the corresponding local vector.
     */
    GetLocalVector(worldVector: b2Vec2): b2Vec2;
    /**
    * Get the world linear velocity of a world point attached to this body.
    * @param a point in world coordinates.
    * @return the world velocity of a point.
    */
    GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2): b2Vec2;
    /**
    * Get the world velocity of a local point.
    * @param a point in local coordinates.
    * @return the world velocity of a point.
    */
    GetLinearVelocityFromLocalPoint(localPoint: b2Vec2): b2Vec2;
    /**
    * Get the linear damping of the body.
    */
    GetLinearDamping(): number;
    /**
    * Set the linear damping of the body.
    */
    SetLinearDamping(linearDamping: number): void;
    /**
    * Get the angular damping of the body
    */
    GetAngularDamping(): number;
    /**
    * Set the angular damping of the body.
    */
    SetAngularDamping(angularDamping: number): void;
    /**
     * Set the type of this body. This may alter the mass and velocity
     * @param	type - enum stored as a static member of b2Body
     */
    SetType(type: number /** uint */): void;
    /**
     * Get the type of this body.
     * @return type enum as a uint
     */
    GetType(): number /** uint */;
    /**
    * Should this body be treated like a bullet for continuous collision detection?
    */
    SetBullet(flag: boolean): void;
    /**
    * Is this body treated like a bullet for continuous collision detection?
    */
    IsBullet(): Boolean;
    /**
     * Is this body allowed to sleep
     * @param	flag
     */
    SetSleepingAllowed(flag: boolean): void;
    /**
     * Set the sleep state of the body. A sleeping body has vety low CPU cost.
     * @param	flag - set to true to put body to sleep, false to wake it
     */
    SetAwake(flag: boolean): void;
    /**
     * Get the sleeping state of this body.
     * @return true if body is sleeping
     */
    IsAwake(): boolean;
    /**
     * Set this body to have fixed rotation. This causes the mass to be reset.
     * @param	fixed - true means no rotation
     */
    SetFixedRotation(fixed: boolean): void;
    /**
    * Does this body have fixed rotation?
    * @return true means fixed rotation
    */
    IsFixedRotation(): boolean;
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
    SetActive(flag: boolean): void;
    /**
     * Get the active state of the body.
     * @return true if active.
     */
    IsActive(): boolean;
    /**
    * Is this body allowed to sleep?
    */
    IsSleepingAllowed(): boolean;
    /**
    * Get the list of all fixtures attached to this body.
    */
    GetFixtureList(): b2Fixture;
    /**
    * Get the list of all joints attached to this body.
    */
    GetJointList(): b2JointEdge;
    /**
     * Get the list of all controllers attached to this body.
     */
    GetControllerList(): b2ControllerEdge;
    /**
     * Get a list of all contacts attached to this body.
     */
    GetContactList(): b2ContactEdge;
    /**
    * Get the next body in the world's body list.
    */
    GetNext(): b2Body;
    /**
    * Get the user data pointer that was provided in the body definition.
    */
    GetUserData(): any;
    /**
    * Set the user data. Use this to store your application specific data.
    */
    SetUserData(data: any): void;
    /**
    * Get the parent world of this body.
    */
    GetWorld(): b2World;
    /**
     * @private
     */
    constructor(bd: b2BodyDef, world: b2World);
    private static s_xf1;
    SynchronizeFixtures(): void;
    SynchronizeTransform(): void;
    ShouldCollide(other: b2Body): Boolean;
    Advance(t: number): void;
    m_flags: number /** uint */;
    m_type: number /** int */;
    m_islandIndex: number /** int */;
    m_xf: b2Transform;
    m_sweep: b2Sweep;
    m_linearVelocity: b2Vec2;
    m_angularVelocity: number;
    m_force: b2Vec2;
    m_torque: number;
    m_world: b2World;
    m_prev: b2Body;
    m_next: b2Body;
    m_fixtureList: b2Fixture;
    m_fixtureCount: number /** int */;
    m_controllerList: b2ControllerEdge;
    m_controllerCount: number /** int */;
    m_jointList: b2JointEdge;
    m_contactList: b2ContactEdge;
    m_mass: number;
    m_invMass: number;
    m_I: number;
    m_invI: number;
    m_inertiaScale: number;
    m_linearDamping: number;
    m_angularDamping: number;
    m_sleepTime: number;
    private m_userData;
    static e_islandFlag: number /** uint */;
    static e_awakeFlag: number /** uint */;
    static e_allowSleepFlag: number /** uint */;
    static e_bulletFlag: number /** uint */;
    static e_fixedRotationFlag: number /** uint */;
    static e_activeFlag: number /** uint */;
    static b2_staticBody: number /** uint */;
    static b2_kinematicBody: number /** uint */;
    static b2_dynamicBody: number /** uint */;
}
//# sourceMappingURL=b2Body.d.ts.map