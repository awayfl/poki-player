import { b2Body } from '../b2Body';
import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Shape } from '../../Collision/Shapes/b2Shape';
import { b2ContactEdge } from './b2ContactEdge';
import { b2Settings } from '../../Common/b2Settings';
import { b2TimeOfImpact } from '../../Collision/b2TimeOfImpact';
import { b2TOIInput } from '../../Collision/b2TOIInput';
/**
* The class manages contact between two shapes. A contact exists for each overlapping
* AABB in the broad-phase (except if filtered). Therefore a contact object may exist
* that has no contact points.
*/
var b2Contact = /** @class */ (function () {
    function b2Contact() {
        this.__fast__ = true;
        // Nodes for connecting bodies.
        this.m_nodeA = new b2ContactEdge();
        this.m_nodeB = new b2ContactEdge();
        this.m_manifold = new b2Manifold();
        this.m_oldManifold = new b2Manifold();
        // Real work is done in Reset
    }
    /**
     * Get the contact manifold. Do not modify the manifold unless you understand the
     * internals of Box2D
     */
    b2Contact.prototype.GetManifold = function () {
        return this.m_manifold;
    };
    /**
     * Get the world manifold
     */
    b2Contact.prototype.GetWorldManifold = function (worldManifold) {
        var bodyA = this.m_fixtureA.GetBody();
        var bodyB = this.m_fixtureB.GetBody();
        var shapeA = this.m_fixtureA.GetShape();
        var shapeB = this.m_fixtureB.GetShape();
        worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
    };
    /**
     * Is this contact touching.
     */
    b2Contact.prototype.IsTouching = function () {
        return (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
    };
    /**
     * Does this contact generate TOI events for continuous simulation
     */
    b2Contact.prototype.IsContinuous = function () {
        return (this.m_flags & b2Contact.e_continuousFlag) == b2Contact.e_continuousFlag;
    };
    /**
     * Change this to be a sensor or-non-sensor contact.
     */
    b2Contact.prototype.SetSensor = function (sensor) {
        if (sensor) {
            this.m_flags |= b2Contact.e_sensorFlag;
        }
        else {
            this.m_flags &= ~b2Contact.e_sensorFlag;
        }
    };
    /**
     * Is this contact a sensor?
     */
    b2Contact.prototype.IsSensor = function () {
        return (this.m_flags & b2Contact.e_sensorFlag) == b2Contact.e_sensorFlag;
    };
    /**
     * Enable/disable this contact. This can be used inside the pre-solve
     * contact listener. The contact is only disabled for the current
     * time step (or sub-step in continuous collision).
     */
    b2Contact.prototype.SetEnabled = function (flag) {
        if (flag) {
            this.m_flags |= b2Contact.e_enabledFlag;
        }
        else {
            this.m_flags &= ~b2Contact.e_enabledFlag;
        }
    };
    /**
     * Has this contact been disabled?
     * @return
     */
    b2Contact.prototype.IsEnabled = function () {
        return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
    };
    /**
    * Get the next contact in the world's contact list.
    */
    b2Contact.prototype.GetNext = function () {
        return this.m_next;
    };
    /**
    * Get the first fixture in this contact.
    */
    b2Contact.prototype.GetFixtureA = function () {
        return this.m_fixtureA;
    };
    /**
    * Get the second fixture in this contact.
    */
    b2Contact.prototype.GetFixtureB = function () {
        return this.m_fixtureB;
    };
    /**
     * Flag this contact for filtering. Filtering will occur the next time step.
     */
    b2Contact.prototype.FlagForFiltering = function () {
        this.m_flags |= b2Contact.e_filterFlag;
    };
    /** @private */
    b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
        this.m_flags = b2Contact.e_enabledFlag;
        if (!fixtureA || !fixtureB) {
            this.m_fixtureA = null;
            this.m_fixtureB = null;
            return;
        }
        if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
            this.m_flags |= b2Contact.e_sensorFlag;
        }
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();
        if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
        }
        this.m_fixtureA = fixtureA;
        this.m_fixtureB = fixtureB;
        this.m_manifold.m_pointCount = 0;
        this.m_prev = null;
        this.m_next = null;
        this.m_nodeA.contact = null;
        this.m_nodeA.prev = null;
        this.m_nodeA.next = null;
        this.m_nodeA.other = null;
        this.m_nodeB.contact = null;
        this.m_nodeB.prev = null;
        this.m_nodeB.next = null;
        this.m_nodeB.other = null;
    };
    b2Contact.prototype.Update = function (listener) {
        // Swap old & new manifold
        var tManifold = this.m_oldManifold;
        this.m_oldManifold = this.m_manifold;
        this.m_manifold = tManifold;
        // Re-enable this contact
        this.m_flags |= b2Contact.e_enabledFlag;
        var touching = false;
        var wasTouching = (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
        var bodyA = this.m_fixtureA.m_body;
        var bodyB = this.m_fixtureB.m_body;
        var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
        // Is this contat a sensor?
        if (this.m_flags & b2Contact.e_sensorFlag) {
            if (aabbOverlap) {
                var shapeA = this.m_fixtureA.GetShape();
                var shapeB = this.m_fixtureB.GetShape();
                var xfA = bodyA.GetTransform();
                var xfB = bodyB.GetTransform();
                touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
            }
            // Sensors don't generate manifolds
            this.m_manifold.m_pointCount = 0;
        }
        else {
            // Slow contacts don't generate TOI events.
            if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
                this.m_flags |= b2Contact.e_continuousFlag;
            }
            else {
                this.m_flags &= ~b2Contact.e_continuousFlag;
            }
            if (aabbOverlap) {
                this.Evaluate();
                touching = this.m_manifold.m_pointCount > 0;
                // Match old contact ids to new contact ids and copy the
                // stored impulses to warm start the solver.
                for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
                    var mp2 = this.m_manifold.m_points[i];
                    mp2.m_normalImpulse = 0.0;
                    mp2.m_tangentImpulse = 0.0;
                    var id2 = mp2.m_id;
                    for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                        var mp1 = this.m_oldManifold.m_points[j];
                        if (mp1.m_id.key == id2.key) {
                            mp2.m_normalImpulse = mp1.m_normalImpulse;
                            mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                            break;
                        }
                    }
                }
            }
            else {
                this.m_manifold.m_pointCount = 0;
            }
            if (touching != wasTouching) {
                bodyA.SetAwake(true);
                bodyB.SetAwake(true);
            }
        }
        if (touching) {
            this.m_flags |= b2Contact.e_touchingFlag;
        }
        else {
            this.m_flags &= ~b2Contact.e_touchingFlag;
        }
        if (wasTouching == false && touching == true) {
            listener.BeginContact(this);
        }
        if (wasTouching == true && touching == false) {
            listener.EndContact(this);
        }
        if ((this.m_flags & b2Contact.e_sensorFlag) == 0) {
            listener.PreSolve(this, this.m_oldManifold);
        }
    };
    //virtual ~b2Contact() {}
    b2Contact.prototype.Evaluate = function () { };
    b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
        b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
        b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
        b2Contact.s_input.sweepA = sweepA;
        b2Contact.s_input.sweepB = sweepB;
        b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
        return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
    };
    //--------------- Internals Below -------------------
    // m_flags
    // enum
    // This contact should not participate in Solve
    // The contact equivalent of sensors
    b2Contact.e_sensorFlag = 0x0001;
    // Generate TOI events.
    b2Contact.e_continuousFlag = 0x0002;
    // Used when crawling contact graph when forming islands.
    b2Contact.e_islandFlag = 0x0004;
    // Used in SolveTOI to indicate the cached toi value is still valid.
    b2Contact.e_toiFlag = 0x0008;
    // Set when shapes are touching
    b2Contact.e_touchingFlag = 0x0010;
    // This contact can be disabled (by user)
    b2Contact.e_enabledFlag = 0x0020;
    // This contact needs filtering because a fixture filter was changed.
    b2Contact.e_filterFlag = 0x0040;
    b2Contact.s_input = new b2TOIInput();
    return b2Contact;
}());
export { b2Contact };
