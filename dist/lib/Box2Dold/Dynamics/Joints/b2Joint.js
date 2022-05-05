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
import { b2JointEdge } from '../Joints';
import { b2DistanceJoint, b2MouseJoint, b2PrismaticJoint, b2RevoluteJoint, b2PulleyJoint, b2GearJoint } from '../Joints';
/// The base joint class. Joints are used to constraint two bodies together in
/// various fashions. Some joints also feature limits and motors.
var b2Joint = /** @class */ (function () {
    function b2Joint(def) {
        this.__fast__ = true;
        this.m_node1 = new b2JointEdge();
        this.m_node2 = new b2JointEdge();
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_body1 = def.body1;
        this.m_body2 = def.body2;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
    }
    /// Get the type of the concrete joint.
    b2Joint.prototype.GetType = function () {
        return this.m_type;
    };
    /// Get the anchor point on body1 in world coordinates.
    b2Joint.prototype.GetAnchor1 = function () { return null; };
    /// Get the anchor point on body2 in world coordinates.
    b2Joint.prototype.GetAnchor2 = function () { return null; };
    /// Get the reaction force on body2 at the joint anchor.
    b2Joint.prototype.GetReactionForce = function () { return null; };
    /// Get the reaction torque on body2.
    b2Joint.prototype.GetReactionTorque = function () { return 0.0; };
    /// Get the first body attached to this joint.
    b2Joint.prototype.GetBody1 = function () {
        return this.m_body1;
    };
    /// Get the second body attached to this joint.
    b2Joint.prototype.GetBody2 = function () {
        return this.m_body2;
    };
    /// Get the next joint the world joint list.
    b2Joint.prototype.GetNext = function () {
        return this.m_next;
    };
    /// Get the user data pointer.
    b2Joint.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /// Set the user data pointer.
    b2Joint.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    //--------------- Internals Below -------------------
    b2Joint.Create = function (def, allocator) {
        var joint = null;
        switch (def.type) {
            case b2Joint.e_distanceJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2DistanceJoint));
                    joint = new b2DistanceJoint(def);
                }
                break;
            case b2Joint.e_mouseJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2MouseJoint));
                    joint = new b2MouseJoint(def);
                }
                break;
            case b2Joint.e_prismaticJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2PrismaticJoint));
                    joint = new b2PrismaticJoint(def);
                }
                break;
            case b2Joint.e_revoluteJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2RevoluteJoint));
                    joint = new b2RevoluteJoint(def);
                }
                break;
            case b2Joint.e_pulleyJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2PulleyJoint));
                    joint = new b2PulleyJoint(def);
                }
                break;
            case b2Joint.e_gearJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2GearJoint));
                    joint = new b2GearJoint(def);
                }
                break;
            default:
                //b2Settings.b2Assert(false);
                break;
        }
        return joint;
    };
    b2Joint.Destroy = function (joint, allocator) {
        /*joint->~b2Joint();
        switch (joint.m_type)
        {
        case e_distanceJoint:
            allocator->Free(joint, sizeof(b2DistanceJoint));
            break;

        case e_mouseJoint:
            allocator->Free(joint, sizeof(b2MouseJoint));
            break;

        case e_prismaticJoint:
            allocator->Free(joint, sizeof(b2PrismaticJoint));
            break;

        case e_revoluteJoint:
            allocator->Free(joint, sizeof(b2RevoluteJoint));
            break;

        case e_pulleyJoint:
            allocator->Free(joint, sizeof(b2PulleyJoint));
            break;

        case e_gearJoint:
            allocator->Free(joint, sizeof(b2GearJoint));
            break;

        default:
            b2Assert(false);
            break;
        }*/
    };
    //virtual ~b2Joint() {}
    b2Joint.prototype.InitVelocityConstraints = function (step) { };
    b2Joint.prototype.SolveVelocityConstraints = function (step) { };
    // This returns true if the position errors are within tolerance.
    b2Joint.prototype.InitPositionConstraints = function () { };
    b2Joint.prototype.SolvePositionConstraints = function () { return false; };
    // ENUMS
    // enum b2JointType
    b2Joint.e_unknownJoint = 0;
    b2Joint.e_revoluteJoint = 1;
    b2Joint.e_prismaticJoint = 2;
    b2Joint.e_distanceJoint = 3;
    b2Joint.e_pulleyJoint = 4;
    b2Joint.e_mouseJoint = 5;
    b2Joint.e_gearJoint = 6;
    // enum b2LimitState
    b2Joint.e_inactiveLimit = 0;
    b2Joint.e_atLowerLimit = 1;
    b2Joint.e_atUpperLimit = 2;
    b2Joint.e_equalLimits = 3;
    return b2Joint;
}());
export { b2Joint };
