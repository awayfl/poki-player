var b2SimplexVertex = /** @class */ (function () {
    function b2SimplexVertex() {
        this.__fast__ = true;
    }
    b2SimplexVertex.prototype.Set = function (other) {
        this.wA.SetV(other.wA);
        this.wB.SetV(other.wB);
        this.w.SetV(other.w);
        this.a = other.a;
        this.indexA = other.indexA;
        this.indexB = other.indexB;
    };
    return b2SimplexVertex;
}());
export { b2SimplexVertex };
