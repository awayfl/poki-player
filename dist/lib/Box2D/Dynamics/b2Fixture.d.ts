import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2Body } from './b2Body';
import { b2Vec2, b2Transform } from '../Common/Math';
import { b2RayCastOutput } from '../Collision/b2RayCastOutput';
import { b2RayCastInput } from '../Collision/b2RayCastInput';
import { b2MassData } from '../Collision/Shapes/b2MassData';
import { b2AABB } from '../Collision/b2AABB';
import { b2FixtureDef } from './b2FixtureDef';
import { b2FilterData } from './b2FilterData';
import { IBroadPhase } from '../Collision/IBroadPhase';
/**
 * A fixture is used to attach a shape to a body for collision detection. A fixture
 * inherits its transform from its parent. Fixtures hold additional non-geometric data
 * such as friction, collision filters, etc.
 * Fixtures are created via b2Body::CreateFixture.
 * @warning you cannot reuse fixtures.
 */
export declare class b2Fixture {
    __fast__: boolean;
    /**
     * Get the type of the child shape. You can use this to down cast to the concrete shape.
     * @return the shape type.
     */
    GetType(): number /** int */;
    /**
     * Get the child shape. You can modify the child shape, however you should not change the
     * number of vertices because this will crash some collision caching mechanisms.
     */
    GetShape(): b2Shape;
    /**
     * Set if this fixture is a sensor.
     */
    SetSensor(sensor: boolean): void;
    /**
     * Is this fixture a sensor (non-solid)?
     * @return the true if the shape is a sensor.
     */
    IsSensor(): boolean;
    /**
     * Set the contact filtering data. This will not update contacts until the next time
     * step when either parent body is active and awake.
     */
    SetFilterData(filter: b2FilterData): void;
    /**
     * Get the contact filtering data.
     */
    GetFilterData(): b2FilterData;
    /**
     * Get the parent body of this fixture. This is NULL if the fixture is not attached.
     * @return the parent body.
     */
    GetBody(): b2Body;
    /**
     * Get the next fixture in the parent body's fixture list.
     * @return the next shape.
     */
    GetNext(): b2Fixture;
    /**
     * Get the user data that was assigned in the fixture definition. Use this to
     * store your application specific data.
     */
    GetUserData(): any;
    /**
     * Set the user data. Use this to store your application specific data.
     */
    SetUserData(data: any): void;
    /**
     * Test a point for containment in this fixture.
     * @param xf the shape world transform.
     * @param p a point in world coordinates.
     */
    TestPoint(p: b2Vec2): boolean;
    /**
     * Perform a ray cast against this shape.
     * @param output the ray-cast results.
     * @param input the ray-cast input parameters.
     */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
    /**
     * Get the mass data for this fixture. The mass data is based on the density and
     * the shape. The rotational inertia is about the shape's origin. This operation may be expensive
     * @param massData - this is a reference to a valid massData, if it is null a new b2MassData is allocated and then returned
     * @note if the input is null then you must get the return value.
     */
    GetMassData(massData?: b2MassData): b2MassData;
    /**
     * Set the density of this fixture. This will _not_ automatically adjust the mass
     * of the body. You must call b2Body::ResetMassData to update the body's mass.
     * @param	density
     */
    SetDensity(density: number): void;
    /**
     * Get the density of this fixture.
     * @return density
     */
    GetDensity(): number;
    /**
     * Get the coefficient of friction.
     */
    GetFriction(): number;
    /**
     * Set the coefficient of friction.
     */
    SetFriction(friction: number): void;
    /**
     * Get the coefficient of restitution.
     */
    GetRestitution(): number;
    /**
     * Get the coefficient of restitution.
     */
    SetRestitution(restitution: number): void;
    /**
     * Get the fixture's AABB. This AABB may be enlarge and/or stale.
     * If you need a more accurate AABB, compute it using the shape and
     * the body transform.
     * @return
     */
    GetAABB(): b2AABB;
    /**
     * @private
     */
    constructor();
    /**
     * the destructor cannot access the allocator (no destructor arguments allowed by C++).
     *  We need separation create/destroy functions from the constructor/destructor because
     */
    Create(body: b2Body, xf: b2Transform, def: b2FixtureDef): void;
    /**
     * the destructor cannot access the allocator (no destructor arguments allowed by C++).
     *  We need separation create/destroy functions from the constructor/destructor because
     */
    Destroy(): void;
    /**
     * This supports body activation/deactivation.
     */
    CreateProxy(broadPhase: IBroadPhase, xf: b2Transform): void;
    /**
     * This supports body activation/deactivation.
     */
    DestroyProxy(broadPhase: IBroadPhase): void;
    Synchronize(broadPhase: IBroadPhase, transform1: b2Transform, transform2: b2Transform): void;
    private m_massData;
    m_aabb: b2AABB;
    m_density: number;
    m_next: b2Fixture;
    m_body: b2Body;
    m_shape: b2Shape;
    m_friction: number;
    m_restitution: number;
    m_proxy: any;
    m_filter: b2FilterData;
    m_isSensor: boolean;
    m_userData: any;
}
//# sourceMappingURL=b2Fixture.d.ts.map