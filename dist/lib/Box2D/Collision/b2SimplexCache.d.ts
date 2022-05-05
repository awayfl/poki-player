/**
 * Used to warm start b2Distance.
 * Set count to zero on first call.
 */
export declare class b2SimplexCache {
    __fast__: boolean;
    /** Length or area */
    metric: number;
    count: number /** uint */;
    /** Vertices on shape a */
    indexA: Array<number /** int */>;
    /** Vertices on shape b */
    indexB: Array<number /** int */>;
}
//# sourceMappingURL=b2SimplexCache.d.ts.map