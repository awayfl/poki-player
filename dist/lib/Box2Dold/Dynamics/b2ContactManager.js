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
import { __extends } from "tslib";
import { b2PairCallback } from '../Collision/b2PairCallback';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2NullContact } from './Contacts/b2NullContact';
import { b2Contact } from './Contacts/b2Contact';
import { b2ContactPoint } from '../Collision/b2ContactPoint';
import { b2ContactRegister } from './Contacts/b2ContactRegister';
import { b2CircleContact } from './Contacts/b2CircleContact';
import { b2PolyAndCircleContact } from './Contacts/b2PolyAndCircleContact';
import { b2PolygonContact } from './Contacts/b2PolygonContact';
// Delegate of b2World.
var b2ContactManager = /** @class */ (function (_super) {
    __extends(b2ContactManager, _super);
    function b2ContactManager() {
        var _this = _super.call(this) || this;
        // This lets us provide broadphase proxy pair user data for
        // contacts that shouldn't exist.
        _this.m_nullContact = new b2NullContact();
        _this.m_world = null;
        _this.m_destroyImmediate = false;
        return _this;
    }
    // This is a callback from the broadphase when two AABB proxies begin
    // to overlap. We create a b2Contact to manage the narrow phase.
    b2ContactManager.prototype.PairAdded = function (proxyUserData1, proxyUserData2) {
        var shape1 = proxyUserData1;
        var shape2 = proxyUserData2;
        var body1 = shape1.m_body;
        var body2 = shape2.m_body;
        if (body1.IsStatic() && body2.IsStatic()) {
            return this.m_nullContact;
        }
        if (shape1.m_body == shape2.m_body) {
            return this.m_nullContact;
        }
        if (body2.IsConnected(body1)) {
            return this.m_nullContact;
        }
        if (this.m_world.m_contactFilter != null && this.m_world.m_contactFilter.ShouldCollide(shape1, shape2) == false) {
            return this.m_nullContact;
        }
        // Call the factory.
        var c;
        if (b2Contact.s_initialized == false) {
            b2ContactManager.InitializeRegisters();
            b2Contact.s_initialized = true;
        }
        var type1 = shape1.m_type;
        var type2 = shape2.m_type;
        //b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount);
        //b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount);
        var reg = b2Contact.s_registers[type1][type2];
        var createFcn = reg.createFcn;
        if (createFcn != null) {
            if (reg.primary) {
                c = createFcn(shape1, shape2, this.m_world.m_blockAllocator);
            }
            else {
                c = createFcn(shape2, shape1, this.m_world.m_blockAllocator);
                for (var i = 0; i < c.m_manifoldCount; ++i) {
                    var m = c.GetManifolds()[i];
                    m.normal = m.normal.Negative();
                }
            }
        }
        if (c == null) {
            c = this.m_nullContact;
        }
        // Contact creation may swap shapes.
        shape1 = c.m_shape1;
        shape2 = c.m_shape2;
        body1 = shape1.m_body;
        body2 = shape2.m_body;
        // Insert into the world.
        c.m_prev = null;
        c.m_next = this.m_world.m_contactList;
        if (this.m_world.m_contactList != null) {
            this.m_world.m_contactList.m_prev = c;
        }
        this.m_world.m_contactList = c;
        // Connect to island graph.
        // Connect to body 1
        c.m_node1.contact = c;
        c.m_node1.other = body2;
        c.m_node1.prev = null;
        c.m_node1.next = body1.m_contactList;
        if (body1.m_contactList != null) {
            body1.m_contactList.prev = c.m_node1;
        }
        body1.m_contactList = c.m_node1;
        // Connect to body 2
        c.m_node2.contact = c;
        c.m_node2.other = body1;
        c.m_node2.prev = null;
        c.m_node2.next = body2.m_contactList;
        if (body2.m_contactList != null) {
            body2.m_contactList.prev = c.m_node2;
        }
        body2.m_contactList = c.m_node2;
        ++this.m_world.m_contactCount;
        return c;
    };
    // This is a callback from the broadphase when two AABB proxies cease
    // to overlap. We retire the b2Contact.
    b2ContactManager.prototype.PairRemoved = function (proxyUserData1, proxyUserData2, pairUserData) {
        if (pairUserData == null) {
            return;
        }
        var c = pairUserData;
        if (c == this.m_nullContact) {
            return;
        }
        // An attached body is being destroyed, we must destroy this contact
        // immediately to avoid orphaned shape pointers.
        this.Destroy(c);
    };
    b2ContactManager.prototype.Destroy = function (c) {
        var shape1 = c.m_shape1;
        var shape2 = c.m_shape2;
        // Inform the user that this contact is ending.
        var manifoldCount = c.m_manifoldCount;
        if (manifoldCount > 0 && this.m_world.m_contactListener) {
            var b1 = shape1.m_body;
            var b2 = shape2.m_body;
            var manifolds = c.GetManifolds();
            var cp = b2ContactManager.s_evalCP;
            cp.shape1 = c.m_shape1;
            cp.shape2 = c.m_shape1;
            cp.friction = c.m_friction;
            cp.restitution = c.m_restitution;
            for (var i = 0; i < manifoldCount; ++i) {
                var manifold = manifolds[i];
                cp.normal.SetV(manifold.normal);
                for (var j = 0; j < manifold.pointCount; ++j) {
                    var mp = manifold.points[j];
                    cp.position = b1.GetWorldPoint(mp.localPoint1);
                    var v1 = b1.GetLinearVelocityFromLocalPoint(mp.localPoint1);
                    var v2 = b2.GetLinearVelocityFromLocalPoint(mp.localPoint2);
                    cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                    cp.separation = mp.separation;
                    cp.id.key = mp.id._key;
                    this.m_world.m_contactListener.Remove(cp);
                }
            }
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
        var body1 = shape1.m_body;
        var body2 = shape2.m_body;
        // Remove from body 1
        if (c.m_node1.prev) {
            c.m_node1.prev.next = c.m_node1.next;
        }
        if (c.m_node1.next) {
            c.m_node1.next.prev = c.m_node1.prev;
        }
        if (c.m_node1 == body1.m_contactList) {
            body1.m_contactList = c.m_node1.next;
        }
        // Remove from body 2
        if (c.m_node2.prev) {
            c.m_node2.prev.next = c.m_node2.next;
        }
        if (c.m_node2.next) {
            c.m_node2.next.prev = c.m_node2.prev;
        }
        if (c.m_node2 == body2.m_contactList) {
            body2.m_contactList = c.m_node2.next;
        }
        // Call the factory.
        //b2Settings.b2Assert(s_initialized == true);
        if (c.m_manifoldCount > 0) {
            c.m_shape1.m_body.WakeUp();
            c.m_shape2.m_body.WakeUp();
        }
        var type1 = c.m_shape1.m_type;
        var type2 = c.m_shape2.m_type;
        //b2Settings.b2Assert(b2Shape.e_unknownShape < type1 && type1 < b2Shape.e_shapeTypeCount);
        //b2Settings.b2Assert(b2Shape.e_unknownShape < type2 && type2 < b2Shape.e_shapeTypeCount);
        var reg = b2Contact.s_registers[type1][type2];
        var destroyFcn = reg.destroyFcn;
        destroyFcn(c, this.m_world.m_blockAllocator);
        --this.m_world.m_contactCount;
    };
    // This is the top level collision call for the time step. Here
    // all the narrow phase collision is processed for the world
    // contact list.
    b2ContactManager.prototype.Collide = function () {
        // Update awake contacts.
        for (var c = this.m_world.m_contactList; c; c = c.m_next) {
            var body1 = c.m_shape1.m_body;
            var body2 = c.m_shape2.m_body;
            if (body1.IsSleeping() && body2.IsSleeping()) {
                continue;
            }
            c.Update(this.m_world.m_contactListener);
        }
    };
    b2ContactManager.InitializeRegisters = function () {
        b2Contact.s_registers = new Array(b2Shape.e_shapeTypeCount);
        for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
            b2Contact.s_registers[i] = new Array(b2Shape.e_shapeTypeCount);
            for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
                b2Contact.s_registers[i][j] = new b2ContactRegister();
            }
        }
        b2Contact.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
        b2Contact.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_circleShape);
        b2Contact.AddType(b2PolygonContact.Create, b2PolygonContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_polygonShape);
    };
    b2ContactManager.s_evalCP = new b2ContactPoint();
    return b2ContactManager;
}(b2PairCallback));
export { b2ContactManager };
