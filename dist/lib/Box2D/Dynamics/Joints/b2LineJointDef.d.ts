import { b2JointDef } from '../Joints';
import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
/**
 * Line joint definition. This requires defining a line of
 * motion using an axis and an anchor point. The definition uses local
 * anchor points and a local axis so that the initial configuration
 * can violate the constraint slightly. The joint translation is zero
 * when the local anchor points coincide in world space. Using local
 * anchors and a local axis helps when saving and loading a game.
 * @see b2LineJoint
 */
export declare class b2LineJointDef extends b2JointDef {
    constructor();
    Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    /**
    * The local anchor point relative to bodyA's origin.
    */
    localAnchorA: b2Vec2;
    /**
    * The local anchor point relative to bodyB's origin.
    */
    localAnchorB: b2Vec2;
    /**
    * The local translation axis in bodyA.
    */
    localAxisA: b2Vec2;
    /**
    * Enable/disable the joint limit.
    */
    enableLimit: boolean;
    /**
    * The lower translation limit, usually in meters.
    */
    lowerTranslation: number;
    /**
    * The upper translation limit, usually in meters.
    */
    upperTranslation: number;
    /**
    * Enable/disable the joint motor.
    */
    enableMotor: boolean;
    /**
    * The maximum motor torque, usually in N-m.
    */
    maxMotorForce: number;
    /**
    * The desired motor speed in radians per second.
    */
    motorSpeed: number;
}
//# sourceMappingURL=b2LineJointDef.d.ts.map