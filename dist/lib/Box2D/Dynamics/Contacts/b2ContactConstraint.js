import { b2Mat22, b2Vec2 } from '../../Common/Math';
import { b2ContactConstraintPoint } from '../Contacts';
import { b2Settings } from '../../Common/b2Settings';
/**
* @private
*/
var b2ContactConstraint = /** @class */ (function () {
    function b2ContactConstraint() {
        this.localPlaneNormal = new b2Vec2();
        this.localPoint = new b2Vec2();
        this.normal = new b2Vec2();
        this.normalMass = new b2Mat22();
        this.K = new b2Mat22();
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i] = new b2ContactConstraintPoint();
        }
    }
    return b2ContactConstraint;
}());
export { b2ContactConstraint };
