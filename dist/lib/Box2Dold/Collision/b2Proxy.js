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
import { b2BroadPhase } from './b2BroadPhase';
var b2Proxy = /** @class */ (function () {
    function b2Proxy() {
        this.lowerBounds = [0, 0];
        this.upperBounds = [0, 0];
        this.userData = null;
    }
    b2Proxy.prototype.GetNext = function () { return this.lowerBounds[0]; };
    b2Proxy.prototype.SetNext = function (next /** uint */) { this.lowerBounds[0] = next & 0x0000ffff; };
    b2Proxy.prototype.IsValid = function () { return this.overlapCount != b2BroadPhase.b2_invalid; };
    return b2Proxy;
}());
export { b2Proxy };
