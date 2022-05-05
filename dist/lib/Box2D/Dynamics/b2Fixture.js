import { b2Math } from '../Common/Math';
import { b2MassData } from '../Collision/Shapes/b2MassData';
import { b2AABB } from '../Collision/b2AABB';
import { b2FilterData } from './b2FilterData';
/**
 * A fixture is used to attach a shape to a body for collision detection. A fixture
 * inherits its transform from its parent. Fixtures hold additional non-geometric data
 * such as friction, collision filters, etc.
 * Fixtures are created via b2Body::CreateFixture.
 * @warning you cannot reuse fixtures.
 */
var b2Fixture = /** @class */ (function () {
    /**
     * @private
     */
    function b2Fixture() {
        this.__fast__ = true;
        this.m_filter = new b2FilterData();
        this.m_aabb = new b2AABB();
        this.m_userData = null;
        this.m_body = null;
        this.m_next = null;
        //this.m_proxyId = b2BroadPhase.e_nullProxy;
        this.m_shape = null;
        this.m_density = 0.0;
        this.m_friction = 0.0;
        this.m_restitution = 0.0;
    }
    /**
     * Get the type of the child shape. You can use this to down cast to the concrete shape.
     * @return the shape type.
     */
    b2Fixture.prototype.GetType = function () {
        return this.m_shape.GetType();
    };
    /**
     * Get the child shape. You can modify the child shape, however you should not change the
     * number of vertices because this will crash some collision caching mechanisms.
     */
    b2Fixture.prototype.GetShape = function () {
        return this.m_shape;
    };
    /**
     * Set if this fixture is a sensor.
     */
    b2Fixture.prototype.SetSensor = function (sensor) {
        if (this.m_isSensor == sensor)
            return;
        this.m_isSensor = sensor;
        if (this.m_body == null)
            return;
        var edge = this.m_body.GetContactList();
        while (edge) {
            var contact = edge.contact;
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (fixtureA == this || fixtureB == this)
                contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
            edge = edge.next;
        }
    };
    /**
     * Is this fixture a sensor (non-solid)?
     * @return the true if the shape is a sensor.
     */
    b2Fixture.prototype.IsSensor = function () {
        return this.m_isSensor;
    };
    /**
     * Set the contact filtering data. This will not update contacts until the next time
     * step when either parent body is active and awake.
     */
    b2Fixture.prototype.SetFilterData = function (filter) {
        this.m_filter = filter.Copy();
        if (this.m_body)
            return;
        var edge = this.m_body.GetContactList();
        while (edge) {
            var contact = edge.contact;
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            if (fixtureA == this || fixtureB == this)
                contact.FlagForFiltering();
            edge = edge.next;
        }
    };
    /**
     * Get the contact filtering data.
     */
    b2Fixture.prototype.GetFilterData = function () {
        return this.m_filter.Copy();
    };
    /**
     * Get the parent body of this fixture. This is NULL if the fixture is not attached.
     * @return the parent body.
     */
    b2Fixture.prototype.GetBody = function () {
        return this.m_body;
    };
    /**
     * Get the next fixture in the parent body's fixture list.
     * @return the next shape.
     */
    b2Fixture.prototype.GetNext = function () {
        return this.m_next;
    };
    /**
     * Get the user data that was assigned in the fixture definition. Use this to
     * store your application specific data.
     */
    b2Fixture.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /**
     * Set the user data. Use this to store your application specific data.
     */
    b2Fixture.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    /**
     * Test a point for containment in this fixture.
     * @param xf the shape world transform.
     * @param p a point in world coordinates.
     */
    b2Fixture.prototype.TestPoint = function (p) {
        return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
    };
    /**
     * Perform a ray cast against this shape.
     * @param output the ray-cast results.
     * @param input the ray-cast input parameters.
     */
    b2Fixture.prototype.RayCast = function (output, input) {
        return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
    };
    /**
     * Get the mass data for this fixture. The mass data is based on the density and
     * the shape. The rotational inertia is about the shape's origin. This operation may be expensive
     * @param massData - this is a reference to a valid massData, if it is null a new b2MassData is allocated and then returned
     * @note if the input is null then you must get the return value.
     */
    b2Fixture.prototype.GetMassData = function (massData) {
        if (massData === void 0) { massData = null; }
        if (massData == null) {
            massData = new b2MassData();
        }
        this.m_shape.ComputeMass(massData, this.m_density);
        return massData;
    };
    /**
     * Set the density of this fixture. This will _not_ automatically adjust the mass
     * of the body. You must call b2Body::ResetMassData to update the body's mass.
     * @param	density
     */
    b2Fixture.prototype.SetDensity = function (density) {
        //b2Settings.b2Assert(b2Math.b2IsValid(density) && density >= 0.0);
        this.m_density = density;
    };
    /**
     * Get the density of this fixture.
     * @return density
     */
    b2Fixture.prototype.GetDensity = function () {
        return this.m_density;
    };
    /**
     * Get the coefficient of friction.
     */
    b2Fixture.prototype.GetFriction = function () {
        return this.m_friction;
    };
    /**
     * Set the coefficient of friction.
     */
    b2Fixture.prototype.SetFriction = function (friction) {
        this.m_friction = friction;
    };
    /**
     * Get the coefficient of restitution.
     */
    b2Fixture.prototype.GetRestitution = function () {
        return this.m_restitution;
    };
    /**
     * Get the coefficient of restitution.
     */
    b2Fixture.prototype.SetRestitution = function (restitution) {
        this.m_restitution = restitution;
    };
    /**
     * Get the fixture's AABB. This AABB may be enlarge and/or stale.
     * If you need a more accurate AABB, compute it using the shape and
     * the body transform.
     * @return
     */
    b2Fixture.prototype.GetAABB = function () {
        return this.m_aabb;
    };
    /**
     * the destructor cannot access the allocator (no destructor arguments allowed by C++).
     *  We need separation create/destroy functions from the constructor/destructor because
     */
    b2Fixture.prototype.Create = function (body, xf, def) {
        this.m_userData = def.userData;
        this.m_friction = def.friction;
        this.m_restitution = def.restitution;
        this.m_body = body;
        this.m_next = null;
        this.m_filter = def.filter.Copy();
        this.m_isSensor = def.isSensor;
        this.m_shape = def.shape.Copy();
        this.m_density = def.density;
    };
    /**
     * the destructor cannot access the allocator (no destructor arguments allowed by C++).
     *  We need separation create/destroy functions from the constructor/destructor because
     */
    b2Fixture.prototype.Destroy = function () {
        // The proxy must be destroyed before calling this.
        //b2Assert(m_proxyId == b2BroadPhase::e_nullProxy);
        // Free the child shape
        this.m_shape = null;
    };
    /**
     * This supports body activation/deactivation.
     */
    b2Fixture.prototype.CreateProxy = function (broadPhase, xf) {
        //b2Assert(m_proxyId == b2BroadPhase::e_nullProxy);
        // Create proxy in the broad-phase.
        this.m_shape.ComputeAABB(this.m_aabb, xf);
        this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
    };
    /**
     * This supports body activation/deactivation.
     */
    b2Fixture.prototype.DestroyProxy = function (broadPhase) {
        if (this.m_proxy == null) {
            return;
        }
        // Destroy proxy in the broad-phase.
        broadPhase.DestroyProxy(this.m_proxy);
        this.m_proxy = null;
    };
    b2Fixture.prototype.Synchronize = function (broadPhase, transform1, transform2) {
        if (!this.m_proxy)
            return;
        // Compute an AABB that ocvers the swept shape (may miss some rotation effect)
        var aabb1 = new b2AABB();
        var aabb2 = new b2AABB();
        this.m_shape.ComputeAABB(aabb1, transform1);
        this.m_shape.ComputeAABB(aabb2, transform2);
        this.m_aabb.Combine(aabb1, aabb2);
        var displacement = b2Math.SubtractVV(transform2.position, transform1.position);
        broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
    };
    return b2Fixture;
}());
export { b2Fixture };
