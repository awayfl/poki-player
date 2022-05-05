/**
* This class controls Box2D global settings
*/
export declare class b2Settings {
    /**
    * The current version of Box2D
    */
    static readonly VERSION: String;
    static readonly USHRT_MAX: number /** int */;
    static readonly b2_pi: number;
    /**
     *   Number of manifold points in a b2Manifold. This should NEVER change.
     */
    static readonly b2_maxManifoldPoints: number /** int */;
    /**
     * This is used to fatten AABBs in the dynamic tree. This allows proxies
     * to move by a small amount without triggering a tree adjustment.
     * This is in meters.
     */
    static readonly b2_aabbExtension: number;
    /**
     * This is used to fatten AABBs in the dynamic tree. This is used to predict
     * the future position based on the current displacement.
     * This is a dimensionless multiplier.
     */
    static readonly b2_aabbMultiplier: number;
    /**
    * A small length used as a collision and readonlyraint tolerance. Usually it is
    * chosen to be numerically significant, but visually insignificant.
    */
    static readonly b2_linearSlop: number;
    /**
     * The radius of the polygon/edge shape skin. This should not be modified. Making
     * this smaller means polygons will have and insufficient for continuous collision.
     * Making it larger may create artifacts for vertex collision.
     */
    static readonly b2_polygonRadius: number;
    /**
    * A small angle used as a collision and readonlyraint tolerance. Usually it is
    * chosen to be numerically significant, but visually insignificant.
    */
    static readonly b2_angularSlop: number;
    /**
    * Continuous collision detection (CCD) works with core, shrunken shapes. This is the
    * amount by which shapes are automatically shrunk to work with CCD. This must be
    * larger than b2_linearSlop.
    * @see b2_linearSlop
    */
    static readonly b2_toiSlop: number;
    /**
    * Maximum number of contacts to be handled to solve a TOI island.
    */
    static readonly b2_maxTOIContactsPerIsland: number /** int */;
    /**
    * Maximum number of joints to be handled to solve a TOI island.
    */
    static readonly b2_maxTOIJointsPerIsland: number /** int */;
    /**
    * A velocity threshold for elastic collisions. Any collision with a relative linear
    * velocity below this threshold will be treated as inelastic.
    */
    static readonly b2_velocityThreshold: number;
    /**
    * The maximum linear position correction used when solving readonlyraints. This helps to
    * prevent overshoot.
    */
    static readonly b2_maxLinearCorrection: number;
    /**
    * The maximum angular position correction used when solving readonlyraints. This helps to
    * prevent overshoot.
    */
    static readonly b2_maxAngularCorrection: number;
    /**
    * The maximum linear velocity of a body. This limit is very large and is used
    * to prevent numerical problems. You shouldn't need to adjust this.
    */
    static readonly b2_maxTranslation: number;
    static readonly b2_maxTranslationSquared: number;
    /**
    * The maximum angular velocity of a body. This limit is very large and is used
    * to prevent numerical problems. You shouldn't need to adjust this.
    */
    static readonly b2_maxRotation: number;
    static readonly b2_maxRotationSquared: number;
    /**
    * This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
    * that overlap is removed in one time step. However using values close to 1 often lead
    * to overshoot.
    */
    static readonly b2_contactBaumgarte: number;
    /**
     * Friction mixing law. Feel free to customize this.
     */
    static b2MixFriction(friction1: number, friction2: number): number;
    /**
     * Restitution mixing law. Feel free to customize this.
     */
    static b2MixRestitution(restitution1: number, restitution2: number): number;
    /**
    * The time that a body must be still before it will go to sleep.
    */
    static readonly b2_timeToSleep: number;
    /**
    * A body cannot sleep if its linear velocity is above this tolerance.
    */
    static readonly b2_linearSleepTolerance: number;
    /**
    * A body cannot sleep if its angular velocity is above this tolerance.
    */
    static readonly b2_angularSleepTolerance: number;
    /**
    * b2Assert is used internally to handle assertions. By default, calls are commented out to save performance,
    * so they serve more as documentation than anything else.
    */
    static b2Assert(a: boolean): void;
}
//# sourceMappingURL=b2Settings.d.ts.map