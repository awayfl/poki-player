import { __extends } from "tslib";
import { b2Contact } from '../Contacts';
import { b2Collision } from '../../Collision/b2Collision';
/**
* @private
*/
var b2CircleContact = /** @class */ (function (_super) {
    __extends(b2CircleContact, _super);
    function b2CircleContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    b2CircleContact.Create = function (allocator) {
        return new b2CircleContact();
    };
    b2CircleContact.Destroy = function (contact, allocator) {
        //
    };
    b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
        _super.prototype.Reset.call(this, fixtureA, fixtureB);
        //b2Settings.b2Assert(m_shape1.m_type == b2Shape.e_circleShape);
        //b2Settings.b2Assert(m_shape2.m_type == b2Shape.e_circleShape);
    };
    //~b2CircleContact() {}
    b2CircleContact.prototype.Evaluate = function () {
        var bA = this.m_fixtureA.GetBody();
        var bB = this.m_fixtureB.GetBody();
        b2Collision.CollideCircles(this.m_manifold, this.m_fixtureA.GetShape(), bA.m_xf, this.m_fixtureB.GetShape(), bB.m_xf);
    };
    return b2CircleContact;
}(b2Contact));
export { b2CircleContact };
