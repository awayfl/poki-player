import { b2Vec2 } from '../Common/Math';
import { b2ContactID } from './b2ContactID';
/**
* @private
*/
var ClipVertex = /** @class */ (function () {
    function ClipVertex() {
        this.v = new b2Vec2();
        this.id = new b2ContactID();
    }
    ClipVertex.prototype.Set = function (other) {
        this.v.SetV(other.v);
        this.id.Set(other.id);
    };
    return ClipVertex;
}());
export { ClipVertex };
