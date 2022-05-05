/**
 * Used to warm start b2Distance.
 * Set count to zero on first call.
 */
var b2SimplexCache = /** @class */ (function () {
    function b2SimplexCache() {
        this.__fast__ = true;
        /** Vertices on shape a */
        this.indexA = new Array(3);
        /** Vertices on shape b */
        this.indexB = new Array(3);
    }
    return b2SimplexCache;
}());
export { b2SimplexCache };
