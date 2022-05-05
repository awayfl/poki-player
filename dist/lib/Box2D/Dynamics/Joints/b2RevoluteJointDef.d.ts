import { b2JointDef } from '../Joints';
import { b2Vec2 } from '../../Common/Math';
import { b2Body } from '../b2Body';
/**
* Revolute joint definition. This requires defining an
* anchor point where the bodies are joined. The definition
* uses local anchor points so that the initial configuration
* can violate the constraint slightly. You also need to
* specify the initial relative angle for joint limits. This
* helps when saving and loading a game.
* The local anchor points are measured from the body's origin
* rather than the center of mass because:
* 1. you might not know where the center of mass will be.
* 2. if you add/remove shapes from a body and recompute the mass,
* the joints will be broken.
* @see b2RevoluteJoint
*/
export declare class b2RevoluteJointDef extends b2JointDef {
    constructor();
    /**
    * Initialize the bodies, anchors, and reference angle using the world
    * anchor.
    */
    Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    /**
    * The local anchor point relative to bodyA's origin.
    */
    localAnchorA: b2Vec2;
    /**
    * The local anchor point relative to bodyB's origin.
    */
    localAnchorB: b2Vec2;
    /**
    * The bodyB angle minus bodyA angle in the reference state (radians).
    */
    referenceAngle: number;
    /**
    * A flag to enable joint limits.
    */
    enableLimit: boolean;
    /**
    * The lower angle for the joint limit (radians).
    */
    lowerAngle: number;
    /**
    * The upper angle for the joint limit (radians).
    */
    upperAngle: number;
    /**
    * A flag to enable the joint motor.
    */
    enableMotor: boolean;
    /**
    * The desired motor speed. Usually in radians per second.
    */
    motorSpeed: number;
    /**
    * The maximum motor torque used to achieve the desired motor speed.
    * Usually in N-m.
    */
    maxMotorTorque: number;
}
//# sourceMappingURL=b2RevoluteJointDef.d.ts.map