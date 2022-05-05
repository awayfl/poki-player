/**
* Implement this class to provide collision filtering. In other words, you can implement
* this class if you want finer control over contact creation.
*/
var b2ContactFilter = /** @class */ (function () {
    function b2ContactFilter() {
        this.__fast__ = true;
    }
    /**
    * Return true if contact calculations should be performed between these two fixtures.
    * @warning for performance reasons this is only called when the AABBs begin to overlap.
    */
    b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
        var filter1 = fixtureA.GetFilterData();
        var filter2 = fixtureB.GetFilterData();
        if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
            return filter1.groupIndex > 0;
        }
        var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
        return collide;
    };
    /**
    * Return true if the given fixture should be considered for ray intersection.
    * By default, userData is cast as a b2Fixture and collision is resolved according to ShouldCollide
    * @see ShouldCollide()
    * @see b2World#Raycast
    * @param userData	arbitrary data passed from Raycast or RaycastOne
    * @param fixture		the fixture that we are testing for filtering
    * @return a Boolean, with a value of false indicating that this fixture should be ignored.
    */
    b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
        if (!userData)
            return true;
        return this.ShouldCollide(userData, fixture);
    };
    b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
    return b2ContactFilter;
}());
export { b2ContactFilter };
