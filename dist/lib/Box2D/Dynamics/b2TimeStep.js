/**
* @private
*/
var b2TimeStep = /** @class */ (function () {
    function b2TimeStep() {
        this.__fast__ = true;
    }
    b2TimeStep.prototype.Set = function (step) {
        this.dt = step.dt;
        this.inv_dt = step.inv_dt;
        this.positionIterations = step.positionIterations;
        this.velocityIterations = step.velocityIterations;
        this.warmStarting = step.warmStarting;
    };
    return b2TimeStep;
}());
export { b2TimeStep };
