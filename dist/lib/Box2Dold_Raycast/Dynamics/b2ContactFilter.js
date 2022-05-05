/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { b2Shape } from '../Collision/Shapes/b2Shape';
/// Implement this class to provide collision filtering. In other words, you can implement
/// this class if you want finer control over contact creation.
var b2ContactFilter = /** @class */ (function () {
    function b2ContactFilter() {
    }
    /// Return true if contact calculations should be performed between these two shapes.
    /// @warning for performance reasons this is only called when the AABBs begin to overlap.
    b2ContactFilter.prototype.ShouldCollide = function (shape1, shape2) {
        var filter1 = shape1.GetFilterData();
        var filter2 = shape2.GetFilterData();
        if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
            return filter1.groupIndex > 0;
        }
        return (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
    };
    /// Return true if the given shape should be considered for ray intersection
    b2ContactFilter.prototype.RayCollide = function (userData, shape) {
        //By default, cast userData as a shape, and then collide if the shapes would collide
        if (!userData || !(userData instanceof b2Shape))
            return true;
        return this.ShouldCollide(userData, shape);
    };
    b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
    return b2ContactFilter;
}());
export { b2ContactFilter };
