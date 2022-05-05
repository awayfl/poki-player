import { b2Vec2 } from '../Common/Math';
/**
 * Output for b2Distance.
 */
export declare class b2DistanceOutput {
    __fast__: boolean;
    /**
     * Closest point on shapea
     */
    pointA: b2Vec2;
    /**
     * Closest point on shapeb
     */
    pointB: b2Vec2;
    distance: number;
    /**
     * Number of gjk iterations used
     */
    iterations: number /** int */;
}
//# sourceMappingURL=b2DistanceOutput.d.ts.map