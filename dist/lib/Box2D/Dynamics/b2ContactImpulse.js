import { b2Settings } from '../Common/b2Settings';
/**
 * Contact impulses for reporting. Impulses are used instead of forces because
 * sub-step forces may approach infinity for rigid body collisions. These
 * match up one-to-one with the contact points in b2Manifold.
 */
var b2ContactImpulse = /** @class */ (function () {
    function b2ContactImpulse() {
        this.__fast__ = true;
        this.normalImpulses = new Array(b2Settings.b2_maxManifoldPoints);
        this.tangentImpulses = new Array(b2Settings.b2_maxManifoldPoints);
    }
    return b2ContactImpulse;
}());
export { b2ContactImpulse };
