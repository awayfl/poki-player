import { __extends } from "tslib";
import { b2Contact } from '../Contacts';
import { b2Collision } from '../../Collision/b2Collision';
/**
* @private
*/
var b2PolygonContact = /** @class */ (function (_super) {
    __extends(b2PolygonContact, _super);
    function b2PolygonContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    b2PolygonContact.Create = function (allocator) {
        //void* mem = allocator->Allocate(sizeof(b2PolyContact));
        return new b2PolygonContact();
    };
    b2PolygonContact.Destroy = function (contact, allocator) {
        //((b2PolyContact*)contact)->~b2PolyContact();
        //allocator->Free(contact, sizeof(b2PolyContact));
    };
    b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
        _super.prototype.Reset.call(this, fixtureA, fixtureB);
        //b2Settings.b2Assert(m_shape1.m_type == b2Shape.e_polygonShape);
        //b2Settings.b2Assert(m_shape2.m_type == b2Shape.e_polygonShape);
    };
    //~b2PolyContact() {}
    b2PolygonContact.prototype.Evaluate = function () {
        var bA = this.m_fixtureA.GetBody();
        var bB = this.m_fixtureB.GetBody();
        b2Collision.CollidePolygons(this.m_manifold, this.m_fixtureA.GetShape(), bA.m_xf, this.m_fixtureB.GetShape(), bB.m_xf);
    };
    return b2PolygonContact;
}(b2Contact));
export { b2PolygonContact };
