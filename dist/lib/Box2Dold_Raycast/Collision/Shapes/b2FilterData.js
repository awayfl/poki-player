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
/// This holds contact filtering data.
var b2FilterData = /** @class */ (function () {
    function b2FilterData() {
        this.__fast__ = true;
        /// The collision category bits. Normally you would just set one bit.
        this.categoryBits = 0x0001;
        /// The collision mask bits. This states the categories that this
        /// shape would accept for collision.
        this.maskBits = 0xFFFF;
        /// Collision groups allow a certain group of objects to never collide (negative)
        /// or always collide (positive). Zero means no collision group. Non-zero group
        /// filtering always wins against the mask bits.
        this.groupIndex = 0;
    }
    b2FilterData.prototype.Copy = function () {
        var copy = new b2FilterData();
        copy.categoryBits = this.categoryBits;
        copy.maskBits = this.maskBits;
        copy.groupIndex = this.groupIndex;
        return copy;
    };
    return b2FilterData;
}());
export { b2FilterData };
