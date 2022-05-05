import { b2Vec2 } from '../Common/Math';
/**
* A body definition holds all the data needed to construct a rigid body.
* You can safely re-use body definitions.
*/
export declare class b2BodyDef {
    __fast__: boolean;
    /**
    * This constructor sets the body definition default values.
    */
    constructor();
    /** The body type: static, kinematic, or dynamic. A member of the b2BodyType class
     * Note: if a dynamic body would have zero mass, the mass is set to one.
     * @see b2Body#b2_staticBody
     * @see b2Body#b2_dynamicBody
     * @see b2Body#b2_kinematicBody
     */
    type: number /** uint */;
    /**
     * The world position of the body. Avoid creating bodies at the origin
     * since this can lead to many overlapping shapes.
     */
    position: b2Vec2;
    /**
     * The world angle of the body in radians.
     */
    angle: number;
    /**
     * The linear velocity of the body's origin in world co-ordinates.
     */
    linearVelocity: b2Vec2;
    /**
     * The angular velocity of the body.
     */
    angularVelocity: number;
    /**
     * Linear damping is use to reduce the linear velocity. The damping parameter
     * can be larger than 1.0f but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     */
    linearDamping: number;
    /**
     * Angular damping is use to reduce the angular velocity. The damping parameter
     * can be larger than 1.0f but the damping effect becomes sensitive to the
     * time step when the damping parameter is large.
     */
    angularDamping: number;
    /**
     * Set this flag to false if this body should never fall asleep. Note that
     * this increases CPU usage.
     */
    allowSleep: boolean;
    /**
     * Is this body initially awake or sleeping?
     */
    awake: boolean;
    /**
     * Should this body be prevented from rotating? Useful for characters.
     */
    fixedRotation: boolean;
    /**
     * Is this a fast moving body that should be prevented from tunneling through
     * other moving bodies? Note that all bodies are prevented from tunneling through
     * static bodies.
     * @warning You should use this flag sparingly since it increases processing time.
     */
    bullet: boolean;
    /**
     * Does this body start out active?
     */
    active: boolean;
    /**
     * Use this to store application specific body data.
     */
    userData: any;
    /**
     * Scales the inertia tensor.
     * @warning Experimental
     */
    inertiaScale: number;
}
//# sourceMappingURL=b2BodyDef.d.ts.map