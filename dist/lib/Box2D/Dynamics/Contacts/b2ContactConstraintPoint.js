import { b2Vec2 } from '../../Common/Math';
/**
* @private
*/
var b2ContactConstraintPoint = /** @class */ (function () {
    function b2ContactConstraintPoint() {
        this.localPoint = new b2Vec2();
        this.rA = new b2Vec2();
        this.rB = new b2Vec2();
    }
    return b2ContactConstraintPoint;
}());
export { b2ContactConstraintPoint };
