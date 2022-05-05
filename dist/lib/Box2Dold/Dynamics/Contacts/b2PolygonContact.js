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
import { b2Contact } from './b2Contact';
import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Collision } from '../../Collision/b2Collision';
import { b2ContactPoint } from '../../Collision/b2ContactPoint';
var b2PolygonContact = /** @class */ (function (_super) {
    __extends(b2PolygonContact, _super);
    function b2PolygonContact(shape1, shape2) {
        var _this = _super.call(this, shape1, shape2) || this;
        //~b2PolyContact() {}
        // store temp manifold to reduce calls to new
        _this.m0 = new b2Manifold();
        _this.m_manifolds = [new b2Manifold()];
        _this.m_manifold = _this.m_manifolds[0];
        //b2Settings.b2Assert(m_shape1.m_type == b2Shape.e_polygonShape);
        //b2Settings.b2Assert(m_shape2.m_type == b2Shape.e_polygonShape);
        _this.m_manifold.pointCount = 0;
        return _this;
    }
    b2PolygonContact.Create = function (shape1, shape2, allocator) {
        //void* mem = allocator->Allocate(sizeof(b2PolyContact));
        return new b2PolygonContact(shape1, shape2);
    };
    b2PolygonContact.Destroy = function (contact, allocator) {
        //((b2PolyContact*)contact)->~b2PolyContact();
        //allocator->Free(contact, sizeof(b2PolyContact));
    };
    b2PolygonContact.prototype.Evaluate = function (listener) {
        var v1;
        var v2;
        var mp0;
        var b1 = this.m_shape1.m_body;
        var b2 = this.m_shape2.m_body;
        var cp;
        var i /** int */;
        //b2Manifold m0;
        //memcpy(&m0, &m_manifold, sizeof(b2Manifold));
        // TODO: make sure this is completely necessary
        this.m0.Set(this.m_manifold);
        b2Collision.b2CollidePolygons(this.m_manifold, this.m_shape1, b1.m_xf, this.m_shape2, b2.m_xf);
        var persisted = [false, false];
        cp = b2PolygonContact.s_evalCP;
        cp.shape1 = this.m_shape1;
        cp.shape2 = this.m_shape2;
        cp.friction = this.m_friction;
        cp.restitution = this.m_restitution;
        // Match contact ids to facilitate warm starting.
        if (this.m_manifold.pointCount > 0) {
            // Match old contact ids to new contact ids and copy the
            // stored impulses to warm start the solver.
            for (i = 0; i < this.m_manifold.pointCount; ++i) {
                var mp = this.m_manifold.points[i];
                mp.normalImpulse = 0.0;
                mp.tangentImpulse = 0.0;
                var found = false;
                var idKey = mp.id._key;
                for (var j = 0; j < this.m0.pointCount; ++j) {
                    if (persisted[j] == true) {
                        continue;
                    }
                    mp0 = this.m0.points[j];
                    if (mp0.id._key == idKey) {
                        persisted[j] = true;
                        mp.normalImpulse = mp0.normalImpulse;
                        mp.tangentImpulse = mp0.tangentImpulse;
                        // A persistent point.
                        found = true;
                        // Report persistent point.
                        if (listener != null) {
                            cp.position = b1.GetWorldPoint(mp.localPoint1);
                            v1 = b1.GetLinearVelocityFromLocalPoint(mp.localPoint1);
                            v2 = b2.GetLinearVelocityFromLocalPoint(mp.localPoint2);
                            cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                            cp.normal.SetV(this.m_manifold.normal);
                            cp.separation = mp.separation;
                            cp.id.key = idKey;
                            listener.Persist(cp);
                        }
                        break;
                    }
                }
                // Report added point.
                if (found == false && listener != null) {
                    cp.position = b1.GetWorldPoint(mp.localPoint1);
                    v1 = b1.GetLinearVelocityFromLocalPoint(mp.localPoint1);
                    v2 = b2.GetLinearVelocityFromLocalPoint(mp.localPoint2);
                    cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                    cp.normal.SetV(this.m_manifold.normal);
                    cp.separation = mp.separation;
                    cp.id.key = idKey;
                    listener.Add(cp);
                }
            }
            this.m_manifoldCount = 1;
        }
        else {
            this.m_manifoldCount = 0;
        }
        if (listener == null) {
            return;
        }
        // Report removed points.
        for (i = 0; i < this.m0.pointCount; ++i) {
            if (persisted[i]) {
                continue;
            }
            mp0 = this.m0.points[i];
            cp.position = b1.GetWorldPoint(mp0.localPoint1);
            v1 = b1.GetLinearVelocityFromLocalPoint(mp0.localPoint1);
            v2 = b2.GetLinearVelocityFromLocalPoint(mp0.localPoint2);
            cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
            cp.normal.SetV(this.m0.normal);
            cp.separation = mp0.separation;
            cp.id.key = mp0.id._key;
            listener.Remove(cp);
        }
    };
    b2PolygonContact.prototype.GetManifolds = function () {
        return this.m_manifolds;
    };
    b2PolygonContact.s_evalCP = new b2ContactPoint();
    return b2PolygonContact;
}(b2Contact));
export { b2PolygonContact };
