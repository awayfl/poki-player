/**
 * Contact impulses for reporting. Impulses are used instead of forces because
 * sub-step forces may approach infinity for rigid body collisions. These
 * match up one-to-one with the contact points in b2Manifold.
 */
export declare class b2ContactImpulse {
    __fast__: boolean;
    normalImpulses: Array<number>;
    tangentImpulses: Array<number>;
}
//# sourceMappingURL=b2ContactImpulse.d.ts.map