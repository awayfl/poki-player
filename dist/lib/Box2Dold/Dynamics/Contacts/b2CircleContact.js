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
import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Contact } from './b2Contact';
import { b2Collision } from '../../Collision/b2Collision';
import { b2ContactPoint } from '../../Collision/b2ContactPoint';
var b2CircleContact = /** @class */ (function (_super) {
    __extends(b2CircleContact, _super);
    function b2CircleContact(shape1, shape2) {
        var _this = _super.call(this, shape1, shape2) || this;
        _this.m_manifolds = [new b2Manifold()];
        _this.m0 = new b2Manifold();
        _this.m_manifold = _this.m_manifolds[0];
        //b2Settings.b2Assert(m_shape1.m_type == b2Shape.e_circleShape);
        //b2Settings.b2Assert(m_shape2.m_type == b2Shape.e_circleShape);
        _this.m_manifold.pointCount = 0;
        var point = _this.m_manifold.points[0];
        point.normalImpulse = 0.0;
        point.tangentImpulse = 0.0;
        return _this;
    }
    b2CircleContact.Create = function (shape1, shape2, allocator) {
        return new b2CircleContact(shape1, shape2);
    };
    b2CircleContact.Destroy = function (contact, allocator) {
        //
    };
    b2CircleContact.prototype.Evaluate = function (listener) {
        var v1;
        var v2;
        var mp0;
        var b1 = this.m_shape1.m_body;
        var b2 = this.m_shape2.m_body;
        //b2Manifold m0;
        //memcpy(&m0, &m_manifold, sizeof(b2Manifold));
        // TODO: make sure this is completely necessary
        this.m0.Set(this.m_manifold);
        b2Collision.b2CollideCircles(this.m_manifold, this.m_shape1, b1.m_xf, this.m_shape2, b2.m_xf);
        var cp = b2CircleContact.s_evalCP;
        cp.shape1 = this.m_shape1;
        cp.shape2 = this.m_shape2;
        cp.friction = this.m_friction;
        cp.restitution = this.m_restitution;
        if (this.m_manifold.pointCount > 0) {
            this.m_manifoldCount = 1;
            var mp = this.m_manifold.points[0];
            if (this.m0.pointCount == 0) {
                mp.normalImpulse = 0.0;
                mp.tangentImpulse = 0.0;
                if (listener) {
                    cp.position = b1.GetWorldPoint(mp.localPoint1);
                    v1 = b1.GetLinearVelocityFromLocalPoint(mp.localPoint1);
                    v2 = b2.GetLinearVelocityFromLocalPoint(mp.localPoint2);
                    cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                    cp.normal.SetV(this.m_manifold.normal);
                    cp.separation = mp.separation;
                    cp.id.key = mp.id._key;
                    listener.Add(cp);
                }
            }
            else {
                mp0 = this.m0.points[0];
                mp.normalImpulse = mp0.normalImpulse;
                mp.tangentImpulse = mp0.tangentImpulse;
                if (listener) {
                    cp.position = b1.GetWorldPoint(mp.localPoint1);
                    v1 = b1.GetLinearVelocityFromLocalPoint(mp.localPoint1);
                    v2 = b2.GetLinearVelocityFromLocalPoint(mp.localPoint2);
                    cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                    cp.normal.SetV(this.m_manifold.normal);
                    cp.separation = mp.separation;
                    cp.id.key = mp.id._key;
                    listener.Persist(cp);
                }
            }
        }
        else {
            this.m_manifoldCount = 0;
            if (this.m0.pointCount > 0 && listener) {
                mp0 = this.m0.points[0];
                cp.position = b1.GetWorldPoint(mp0.localPoint1);
                v1 = b1.GetLinearVelocityFromLocalPoint(mp0.localPoint1);
                v2 = b2.GetLinearVelocityFromLocalPoint(mp0.localPoint2);
                cp.velocity.Set(v2.x - v1.x, v2.y - v1.y);
                cp.normal.SetV(this.m0.normal);
                cp.separation = mp0.separation;
                cp.id.key = mp0.id._key;
                listener.Remove(cp);
            }
        }
    };
    b2CircleContact.prototype.GetManifolds = function () {
        return this.m_manifolds;
    };
    //~b2CircleContact() {}
    b2CircleContact.s_evalCP = new b2ContactPoint();
    return b2CircleContact;
}(b2Contact));
export { b2CircleContact };
