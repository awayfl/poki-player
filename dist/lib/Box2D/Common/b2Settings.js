/**
* This class controls Box2D global settings
*/
var b2Settings = /** @class */ (function () {
    function b2Settings() {
    }
    /**
     * Friction mixing law. Feel free to customize this.
     */
    b2Settings.b2MixFriction = function (friction1, friction2) {
        return Math.sqrt(friction1 * friction2);
    };
    /**
     * Restitution mixing law. Feel free to customize this.
     */
    b2Settings.b2MixRestitution = function (restitution1, restitution2) {
        return restitution1 > restitution2 ? restitution1 : restitution2;
    };
    // assert
    /**
    * b2Assert is used internally to handle assertions. By default, calls are commented out to save performance,
    * so they serve more as documentation than anything else.
    */
    b2Settings.b2Assert = function (a) {
        if (!a) {
            //var nullVec:b2Vec2;
            //nullVec.x++;
            throw 'Assertion Failed';
        }
    };
    /**
    * The current version of Box2D
    */
    b2Settings.VERSION = '2.1alpha';
    b2Settings.USHRT_MAX = 0x0000ffff;
    b2Settings.b2_pi = Math.PI;
    // Collision
    /**
     *   Number of manifold points in a b2Manifold. This should NEVER change.
     */
    b2Settings.b2_maxManifoldPoints = 2;
    /*
     * The growable broadphase doesn't have upper limits,
     * so there is no b2_maxProxies or b2_maxPairs settings.
     */
    //public static readonly b2_maxProxies:number /** int */ = 0;
    //public static readonly b2_maxPairs:number /** int */ = 8 * b2_maxProxies;
    /**
     * This is used to fatten AABBs in the dynamic tree. This allows proxies
     * to move by a small amount without triggering a tree adjustment.
     * This is in meters.
     */
    b2Settings.b2_aabbExtension = 0.1;
    /**
     * This is used to fatten AABBs in the dynamic tree. This is used to predict
     * the future position based on the current displacement.
     * This is a dimensionless multiplier.
     */
    b2Settings.b2_aabbMultiplier = 2.0;
    // Dynamics
    /**
    * A small length used as a collision and readonlyraint tolerance. Usually it is
    * chosen to be numerically significant, but visually insignificant.
    */
    b2Settings.b2_linearSlop = 0.005; // 0.5 cm
    /**
     * The radius of the polygon/edge shape skin. This should not be modified. Making
     * this smaller means polygons will have and insufficient for continuous collision.
     * Making it larger may create artifacts for vertex collision.
     */
    b2Settings.b2_polygonRadius = 2.0 * b2Settings.b2_linearSlop;
    /**
    * A small angle used as a collision and readonlyraint tolerance. Usually it is
    * chosen to be numerically significant, but visually insignificant.
    */
    b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi; // 2 degrees
    /**
    * Continuous collision detection (CCD) works with core, shrunken shapes. This is the
    * amount by which shapes are automatically shrunk to work with CCD. This must be
    * larger than b2_linearSlop.
    * @see b2_linearSlop
    */
    b2Settings.b2_toiSlop = 8.0 * b2Settings.b2_linearSlop;
    /**
    * Maximum number of contacts to be handled to solve a TOI island.
    */
    b2Settings.b2_maxTOIContactsPerIsland = 32;
    /**
    * Maximum number of joints to be handled to solve a TOI island.
    */
    b2Settings.b2_maxTOIJointsPerIsland = 32;
    /**
    * A velocity threshold for elastic collisions. Any collision with a relative linear
    * velocity below this threshold will be treated as inelastic.
    */
    b2Settings.b2_velocityThreshold = 1.0; // 1 m/s
    /**
    * The maximum linear position correction used when solving readonlyraints. This helps to
    * prevent overshoot.
    */
    b2Settings.b2_maxLinearCorrection = 0.2; // 20 cm
    /**
    * The maximum angular position correction used when solving readonlyraints. This helps to
    * prevent overshoot.
    */
    b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi; // 8 degrees
    /**
    * The maximum linear velocity of a body. This limit is very large and is used
    * to prevent numerical problems. You shouldn't need to adjust this.
    */
    b2Settings.b2_maxTranslation = 2.0;
    b2Settings.b2_maxTranslationSquared = b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
    /**
    * The maximum angular velocity of a body. This limit is very large and is used
    * to prevent numerical problems. You shouldn't need to adjust this.
    */
    b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
    b2Settings.b2_maxRotationSquared = b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
    /**
    * This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
    * that overlap is removed in one time step. However using values close to 1 often lead
    * to overshoot.
    */
    b2Settings.b2_contactBaumgarte = 0.2;
    // Sleep
    /**
    * The time that a body must be still before it will go to sleep.
    */
    b2Settings.b2_timeToSleep = 0.5; // half a second
    /**
    * A body cannot sleep if its linear velocity is above this tolerance.
    */
    b2Settings.b2_linearSleepTolerance = 0.01; // 1 cm/s
    /**
    * A body cannot sleep if its angular velocity is above this tolerance.
    */
    b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * b2Settings.b2_pi; // 2 degrees/s
    return b2Settings;
}());
export { b2Settings };
