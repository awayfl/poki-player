// Delegate of b2World.
import { b2ContactFilter } from './b2ContactFilter';
import { b2ContactListener } from './b2ContactListener';
import { b2Contact, b2ContactFactory } from './Contacts';
import { b2ContactPoint } from '../Collision/b2ContactPoint';
import { b2DynamicTreeBroadPhase } from '../Collision/b2DynamicTreeBroadPhase';
/**
* @private
*/
var b2ContactManager = /** @class */ (function () {
    function b2ContactManager() {
        var _this = this;
        this.__fast__ = true;
        this.m_world = null;
        this.m_contactCount = 0;
        this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
        this.m_contactListener = b2ContactListener.b2_defaultListener;
        this.m_contactFactory = new b2ContactFactory(this.m_allocator);
        this.m_broadPhase = new b2DynamicTreeBroadPhase();
        this.AddPairDelegate = function (proxyUserDataA, proxyUserDataB) { return _this.AddPair(proxyUserDataA, proxyUserDataB); };
    }
    // This is a callback from the broadphase when two AABB proxies begin
    // to overlap. We create a b2Contact to manage the narrow phase.
    b2ContactManager.prototype.AddPair = function (proxyUserDataA, proxyUserDataB) {
        var fixtureA = proxyUserDataA;
        var fixtureB = proxyUserDataB;
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();
        // Are the fixtures on the same body?
        if (bodyA == bodyB)
            return;
        // Does a contact already exist?
        var edge = bodyB.GetContactList();
        while (edge) {
            if (edge.other == bodyA) {
                var fA = edge.contact.GetFixtureA();
                var fB = edge.contact.GetFixtureB();
                if (fA == fixtureA && fB == fixtureB)
                    return;
                if (fA == fixtureB && fB == fixtureA)
                    return;
            }
            edge = edge.next;
        }
        //Does a joint override collision? Is at least one body dynamic?
        if (bodyB.ShouldCollide(bodyA) == false) {
            return;
        }
        // Check user filtering
        if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
            return;
        }
        // Call the factory.
        var c = this.m_contactFactory.Create(fixtureA, fixtureB);
        // Contact creation may swap shapes.
        fixtureA = c.GetFixtureA();
        fixtureB = c.GetFixtureB();
        bodyA = fixtureA.m_body;
        bodyB = fixtureB.m_body;
        // Insert into the world.
        c.m_prev = null;
        c.m_next = this.m_world.m_contactList;
        if (this.m_world.m_contactList != null) {
            this.m_world.m_contactList.m_prev = c;
        }
        this.m_world.m_contactList = c;
        // Connect to island graph.
        // Connect to body A
        c.m_nodeA.contact = c;
        c.m_nodeA.other = bodyB;
        c.m_nodeA.prev = null;
        c.m_nodeA.next = bodyA.m_contactList;
        if (bodyA.m_contactList != null) {
            bodyA.m_contactList.prev = c.m_nodeA;
        }
        bodyA.m_contactList = c.m_nodeA;
        // Connect to body 2
        c.m_nodeB.contact = c;
        c.m_nodeB.other = bodyA;
        c.m_nodeB.prev = null;
        c.m_nodeB.next = bodyB.m_contactList;
        if (bodyB.m_contactList != null) {
            bodyB.m_contactList.prev = c.m_nodeB;
        }
        bodyB.m_contactList = c.m_nodeB;
        ++this.m_world.m_contactCount;
        return;
    };
    b2ContactManager.prototype.FindNewContacts = function () {
        this.m_broadPhase.UpdatePairs(this.AddPairDelegate);
    };
    b2ContactManager.prototype.Destroy = function (c) {
        var fixtureA = c.GetFixtureA();
        var fixtureB = c.GetFixtureB();
        var bodyA = fixtureA.GetBody();
        var bodyB = fixtureB.GetBody();
        if (c.IsTouching()) {
            this.m_contactListener.EndContact(c);
        }
        // Remove from the world.
        if (c.m_prev) {
            c.m_prev.m_next = c.m_next;
        }
        if (c.m_next) {
            c.m_next.m_prev = c.m_prev;
        }
        if (c == this.m_world.m_contactList) {
            this.m_world.m_contactList = c.m_next;
        }
        // Remove from body A
        if (c.m_nodeA.prev) {
            c.m_nodeA.prev.next = c.m_nodeA.next;
        }
        if (c.m_nodeA.next) {
            c.m_nodeA.next.prev = c.m_nodeA.prev;
        }
        if (c.m_nodeA == bodyA.m_contactList) {
            bodyA.m_contactList = c.m_nodeA.next;
        }
        // Remove from body 2
        if (c.m_nodeB.prev) {
            c.m_nodeB.prev.next = c.m_nodeB.next;
        }
        if (c.m_nodeB.next) {
            c.m_nodeB.next.prev = c.m_nodeB.prev;
        }
        if (c.m_nodeB == bodyB.m_contactList) {
            bodyB.m_contactList = c.m_nodeB.next;
        }
        // Call the factory.
        this.m_contactFactory.Destroy(c);
        --this.m_contactCount;
    };
    // This is the top level collision call for the time step. Here
    // all the narrow phase collision is processed for the world
    // contact list.
    b2ContactManager.prototype.Collide = function () {
        // Update awake contacts.
        var c = this.m_world.m_contactList;
        while (c) {
            var fixtureA = c.GetFixtureA();
            var fixtureB = c.GetFixtureB();
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
            if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
                c = c.GetNext();
                continue;
            }
            // Is this contact flagged for filtering?
            if (c.m_flags & b2Contact.e_filterFlag) {
                // Should these bodies collide?
                if (bodyB.ShouldCollide(bodyA) == false) {
                    var cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }
                // Check user filtering.
                if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
                    cNuke = c;
                    c = cNuke.GetNext();
                    this.Destroy(cNuke);
                    continue;
                }
                // Clear the filtering flag
                c.m_flags &= ~b2Contact.e_filterFlag;
            }
            var proxyA = fixtureA.m_proxy;
            var proxyB = fixtureB.m_proxy;
            var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
            // Here we destroy contacts that cease to overlap in the broadphase
            if (overlap == false) {
                cNuke = c;
                c = cNuke.GetNext();
                this.Destroy(cNuke);
                continue;
            }
            c.Update(this.m_contactListener);
            c = c.GetNext();
        }
    };
    b2ContactManager.s_evalCP = new b2ContactPoint();
    return b2ContactManager;
}());
export { b2ContactManager };
