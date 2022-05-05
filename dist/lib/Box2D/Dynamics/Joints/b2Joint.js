import { b2Vec2 } from '../../Common/Math';
import { b2Settings } from '../../Common/b2Settings';
import { b2JointEdge, b2DistanceJoint, b2PulleyJoint, b2MouseJoint, b2PrismaticJoint, b2RevoluteJoint, b2GearJoint, b2LineJoint, b2WeldJoint, b2FrictionJoint } from '../Joints';
/**
* The base joint class. Joints are used to constraint two bodies together in
* various fashions. Some joints also feature limits and motors.
* @see b2JointDef
*/
var b2Joint = /** @class */ (function () {
    /** @private */
    function b2Joint(def) {
        this.m_edgeA = new b2JointEdge();
        this.m_edgeB = new b2JointEdge();
        // Cache here per time step to reduce cache misses.
        this.m_localCenterA = new b2Vec2();
        this.m_localCenterB = new b2Vec2();
        b2Settings.b2Assert(def.bodyA != def.bodyB);
        this.m_type = def.type;
        this.m_prev = null;
        this.m_next = null;
        this.m_bodyA = def.bodyA;
        this.m_bodyB = def.bodyB;
        this.m_collideConnected = def.collideConnected;
        this.m_islandFlag = false;
        this.m_userData = def.userData;
    }
    /**
    * Get the type of the concrete joint.
    */
    b2Joint.prototype.GetType = function () {
        return this.m_type;
    };
    /**
    * Get the anchor point on bodyA in world coordinates.
    */
    b2Joint.prototype.GetAnchorA = function () { return null; };
    /**
    * Get the anchor point on bodyB in world coordinates.
    */
    b2Joint.prototype.GetAnchorB = function () { return null; };
    /**
    * Get the reaction force on body2 at the joint anchor in Newtons.
    */
    b2Joint.prototype.GetReactionForce = function (inv_dt) { return null; };
    /**
    * Get the reaction torque on body2 in N*m.
    */
    b2Joint.prototype.GetReactionTorque = function (inv_dt) { return 0.0; };
    /**
    * Get the first body attached to this joint.
    */
    b2Joint.prototype.GetBodyA = function () {
        return this.m_bodyA;
    };
    /**
    * Get the second body attached to this joint.
    */
    b2Joint.prototype.GetBodyB = function () {
        return this.m_bodyB;
    };
    /**
    * Get the next joint the world joint list.
    */
    b2Joint.prototype.GetNext = function () {
        return this.m_next;
    };
    /**
    * Get the user data pointer.
    */
    b2Joint.prototype.GetUserData = function () {
        return this.m_userData;
    };
    /**
    * Set the user data pointer.
    */
    b2Joint.prototype.SetUserData = function (data) {
        this.m_userData = data;
    };
    /**
     * Short-cut function to determine if either body is inactive.
     * @return
     */
    b2Joint.prototype.IsActive = function () {
        return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
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
            case b2Joint.e_lineJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2LineJoint));
                    joint = new b2LineJoint(def);
                }
                break;
            case b2Joint.e_weldJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2WeldJoint));
                    joint = new b2WeldJoint(def);
                }
                break;
            case b2Joint.e_frictionJoint:
                {
                    //void* mem = allocator->Allocate(sizeof(b2FrictionJoint));
                    joint = new b2FrictionJoint(def);
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
        case b2Joint.e_distanceJoint:
            allocator->Free(joint, sizeof(b2DistanceJoint));
            break;

        case b2Joint.e_mouseJoint:
            allocator->Free(joint, sizeof(b2MouseJoint));
            break;

        case b2Joint.e_prismaticJoint:
            allocator->Free(joint, sizeof(b2PrismaticJoint));
            break;

        case b2Joint.e_revoluteJoint:
            allocator->Free(joint, sizeof(b2RevoluteJoint));
            break;

        case b2Joint.e_pulleyJoint:
            allocator->Free(joint, sizeof(b2PulleyJoint));
            break;

        case b2Joint.e_gearJoint:
            allocator->Free(joint, sizeof(b2GearJoint));
            break;

        case b2Joint.e_lineJoint:
            allocator->Free(joint, sizeof(b2LineJoint));
            break;

        case b2Joint.e_weldJoint:
            allocator->Free(joint, sizeof(b2WeldJoint));
            break;

        case b2Joint.e_frictionJoint:
            allocator->Free(joint, sizeof(b2FrictionJoint));
            break;

        default:
            b2Assert(false);
            break;
        }*/
    };
    //virtual ~b2Joint() {}
    b2Joint.prototype.InitVelocityConstraints = function (step) { };
    b2Joint.prototype.SolveVelocityConstraints = function (step) { };
    b2Joint.prototype.FinalizeVelocityConstraints = function () { };
    // This returns true if the position errors are within tolerance.
    b2Joint.prototype.SolvePositionConstraints = function (baumgarte) { return false; };
    // ENUMS
    // enum b2JointType
    b2Joint.e_unknownJoint = 0;
    b2Joint.e_revoluteJoint = 1;
    b2Joint.e_prismaticJoint = 2;
    b2Joint.e_distanceJoint = 3;
    b2Joint.e_pulleyJoint = 4;
    b2Joint.e_mouseJoint = 5;
    b2Joint.e_gearJoint = 6;
    b2Joint.e_lineJoint = 7;
    b2Joint.e_weldJoint = 8;
    b2Joint.e_frictionJoint = 9;
    // enum b2LimitState
    b2Joint.e_inactiveLimit = 0;
    b2Joint.e_atLowerLimit = 1;
    b2Joint.e_atUpperLimit = 2;
    b2Joint.e_equalLimits = 3;
    return b2Joint;
}());
export { b2Joint };
