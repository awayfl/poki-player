import { __extends } from "tslib";
import { b2Settings } from '../../Common/b2Settings';
import { b2Shape } from '../../Collision/Shapes/b2Shape';
import { b2Contact } from '../Contacts';
import { b2Collision } from '../../Collision/b2Collision';
/**
* @private
*/
var b2PolyAndCircleContact = /** @class */ (function (_super) {
    __extends(b2PolyAndCircleContact, _super);
    function b2PolyAndCircleContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    b2PolyAndCircleContact.Create = function (allocator) {
        return new b2PolyAndCircleContact();
    };
    b2PolyAndCircleContact.Destroy = function (contact, allocator) {
    };
    b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
        _super.prototype.Reset.call(this, fixtureA, fixtureB);
        b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
        b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
    };
    //~b2PolyAndCircleContact() {}
    b2PolyAndCircleContact.prototype.Evaluate = function () {
        var bA = this.m_fixtureA.m_body;
        var bB = this.m_fixtureB.m_body;
        b2Collision.CollidePolygonAndCircle(this.m_manifold, this.m_fixtureA.GetShape(), bA.m_xf, this.m_fixtureB.GetShape(), bB.m_xf);
    };
    return b2PolyAndCircleContact;
}(b2Contact));
export { b2PolyAndCircleContact };
