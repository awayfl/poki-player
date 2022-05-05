import { ASMethodClosure, ASClass } from '@awayfl/avm2';
import { b2Vec2, b2Transform } from '../Common/Math';
import { b2Body } from './b2Body';
import { b2Contact } from './Contacts';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2Fixture } from './b2Fixture';
import { b2Joint, b2JointDef } from './Joints';
import { b2TimeStep } from './b2TimeStep';
import { b2Controller } from './Controllers/b2Controller';
import { b2Color } from '../Common/b2Color';
import { b2DebugDraw } from './b2DebugDraw';
import { b2DestructionListener } from './b2DestructionListener';
import { b2BodyDef } from './b2BodyDef';
import { b2ContactListener } from './b2ContactListener';
import { b2ContactManager } from './b2ContactManager';
import { IBroadPhase } from '../Collision/IBroadPhase';
import { b2AABB } from '../Collision/b2AABB';
import { b2ContactFilter } from './b2ContactFilter';
/**
* The world class manages all physics entities, dynamic simulation,
* and asynchronous queries.
*/
export declare class b2World {
    __fast__: boolean;
    /**
    * @param gravity the world gravity vector.
    * @param doSleep improve performance by not simulating inactive bodies.
    */
    constructor(gravity: b2Vec2, doSleep: boolean);
    /**
    * Destruct the world. All physics entities are destroyed and all heap memory is released.
    */
    /**
    * Register a destruction listener.
    */
    SetDestructionListener(listener: b2DestructionListener): void;
    /**
    * Register a contact filter to provide specific control over collision.
    * Otherwise the default filter is used (b2_defaultFilter).
    */
    SetContactFilter(filter: b2ContactFilter | ASClass | null): void;
    /**
    * Register a contact event listener
    */
    SetContactListener(listener: b2ContactListener | ASClass | null): void;
    /**
    * Register a routine for debug drawing. The debug draw functions are called
    * inside the b2World::Step method, so make sure your renderer is ready to
    * consume draw commands when you call Step().
    */
    SetDebugDraw(debugDraw: b2DebugDraw): void;
    /**
     * Use the given object as a broadphase.
     * The old broadphase will not be cleanly emptied.
     * @warning It is not recommended you call this except immediately after constructing the world.
     * @warning This function is locked during callbacks.
     */
    SetBroadPhase(broadPhase: IBroadPhase): void;
    /**
    * Perform validation of internal data structures.
    */
    Validate(): void;
    /**
    * Get the number of broad-phase proxies.
    */
    GetProxyCount(): number /** int */;
    /**
    * Create a rigid body given a definition. No reference to the definition
    * is retained.
    * @warning This function is locked during callbacks.
    */
    CreateBody(def: b2BodyDef): b2Body;
    /**
    * Destroy a rigid body given a definition. No reference to the definition
    * is retained. This function is locked during callbacks.
    * @warning This automatically deletes all associated shapes and joints.
    * @warning This function is locked during callbacks.
    */
    DestroyBody(b: b2Body): void;
    /**
    * Create a joint to constrain bodies together. No reference to the definition
    * is retained. This may cause the connected bodies to cease colliding.
    * @warning This function is locked during callbacks.
    */
    CreateJoint(def: b2JointDef): b2Joint;
    /**
    * Destroy a joint. This may cause the connected bodies to begin colliding.
    * @warning This function is locked during callbacks.
    */
    DestroyJoint(j: b2Joint): void;
    /**
     * Add a controller to the world list
     */
    AddController(c: b2Controller): b2Controller;
    RemoveController(c: b2Controller): void;
    CreateController(controller: b2Controller): b2Controller;
    DestroyController(controller: b2Controller): void;
    /**
    * Enable/disable warm starting. For testing.
    */
    SetWarmStarting(flag: boolean): void;
    /**
    * Enable/disable continuous physics. For testing.
    */
    SetContinuousPhysics(flag: boolean): void;
    /**
    * Get the number of bodies.
    */
    GetBodyCount(): number /** int */;
    /**
    * Get the number of joints.
    */
    GetJointCount(): number /** int */;
    /**
    * Get the number of contacts (each may have 0 or more contact points).
    */
    GetContactCount(): number /** int */;
    /**
    * Change the global gravity vector.
    */
    SetGravity(gravity: b2Vec2): void;
    /**
    * Get the global gravity vector.
    */
    GetGravity(): b2Vec2;
    /**
    * The world provides a single static ground body with no collision shapes.
    * You can use this to simplify the creation of joints and static shapes.
    */
    GetGroundBody(): b2Body;
    private static s_timestep2;
    /**
    * Take a time step. This performs collision detection, integration,
    * and constraint solution.
    * @param timeStep the amount of time to simulate, this should not vary.
    * @param velocityIterations for the velocity constraint solver.
    * @param positionIterations for the position constraint solver.
    */
    Step(dt: number, velocityIterations: number /** int */, positionIterations: number /** int */): void;
    /**
     * Call this after you are done with time steps to clear the forces. You normally
     * call this after each call to Step, unless you are performing sub-steps.
     */
    ClearForces(): void;
    private static s_xf;
    /**
     * Call this to draw shapes and other debug draw data.
     */
    DrawDebugData(): void;
    /**
     * Query the world for all fixtures that potentially overlap the
     * provided AABB.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @param aabb the query box.
     */
    QueryAABB(callback: Function | ASMethodClosure, aabb: b2AABB): void;
    /**
     * Query the world for all fixtures that precisely overlap the
     * provided transformed shape.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @asonly
     */
    QueryShape(callback: Function, shape: b2Shape, transform?: b2Transform): void;
    /**
     * Query the world for all fixtures that contain a point.
     * @param callback a user implemented callback class. It should match signature
     * <code>function Callback(fixture:b2Fixture):boolean</code>
     * Return true to continue to the next fixture.
     * @asonly
     */
    QueryPoint(callback: Function, p: b2Vec2): void;
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
    RayCast(callback: Function, point1: b2Vec2, point2: b2Vec2): void;
    RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture;
    RayCastAll(point1: b2Vec2, point2: b2Vec2): Array<b2Fixture>;
    /**
    * Get the world body list. With the returned body, use b2Body::GetNext to get
    * the next body in the world list. A NULL body indicates the end of the list.
    * @return the head of the world body list.
    */
    GetBodyList(): b2Body;
    /**
    * Get the world joint list. With the returned joint, use b2Joint::GetNext to get
    * the next joint in the world list. A NULL joint indicates the end of the list.
    * @return the head of the world joint list.
    */
    GetJointList(): b2Joint;
    /**
     * Get the world contact list. With the returned contact, use b2Contact::GetNext to get
     * the next contact in the world list. A NULL contact indicates the end of the list.
     * @return the head of the world contact list.
     * @warning contacts are
     */
    GetContactList(): b2Contact;
    /**
     * Is the world locked (in the middle of a time step).
     */
    IsLocked(): boolean;
    private s_stack;
    Solve(step: b2TimeStep): void;
    private static s_backupA;
    private static s_backupB;
    private static s_timestep;
    private static s_queue;
    SolveTOI(step: b2TimeStep): void;
    private static s_jointColor;
    DrawJoint(joint: b2Joint): void;
    DrawShape(shape: b2Shape, xf: b2Transform, color: b2Color): void;
    m_flags: number /** int */;
    m_contactManager: b2ContactManager;
    private m_contactSolver;
    private m_island;
    m_bodyList: b2Body;
    private m_jointList;
    m_contactList: b2Contact;
    private m_bodyCount;
    m_contactCount: number /** int */;
    private m_jointCount;
    private m_controllerList;
    private m_controllerCount;
    private m_gravity;
    private m_allowSleep;
    m_groundBody: b2Body;
    private m_destructionListener;
    private m_debugDraw;
    private m_inv_dt0;
    private static m_warmStarting;
    private static m_continuousPhysics;
    static readonly e_newFixture: number /** int */;
    static readonly e_locked: number /** int */;
}
//# sourceMappingURL=b2World.d.ts.map