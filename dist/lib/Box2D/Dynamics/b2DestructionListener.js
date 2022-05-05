/**
* Joints and shapes are destroyed when their associated
* body is destroyed. Implement this listener so that you
* may nullify references to these joints and shapes.
*/
var b2DestructionListener = /** @class */ (function () {
    function b2DestructionListener() {
        this.__fast__ = true;
    }
    /**
    * Called when any joint is about to be destroyed due
    * to the destruction of one of its attached bodies.
    */
    b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) { };
    /**
    * Called when any fixture is about to be destroyed due
    * to the destruction of its parent body.
    */
    b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) { };
    return b2DestructionListener;
}());
export { b2DestructionListener };
