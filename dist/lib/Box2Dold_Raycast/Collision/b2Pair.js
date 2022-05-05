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
import { b2Settings } from '../Common/b2Settings';
// The pair manager is used by the broad-phase to quickly add/remove/find pairs
// of overlapping proxies. It is based closely on code provided by Pierre Terdiman.
// http://www.codercorner.com/IncrementalSAP.txt
var b2Pair = /** @class */ (function () {
    function b2Pair() {
        this.userData = null;
    }
    b2Pair.prototype.SetBuffered = function () { this.status |= b2Pair.e_pairBuffered; };
    b2Pair.prototype.ClearBuffered = function () { this.status &= ~b2Pair.e_pairBuffered; };
    b2Pair.prototype.IsBuffered = function () { return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered; };
    b2Pair.prototype.SetRemoved = function () { this.status |= b2Pair.e_pairRemoved; };
    b2Pair.prototype.ClearRemoved = function () { this.status &= ~b2Pair.e_pairRemoved; };
    b2Pair.prototype.IsRemoved = function () { return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved; };
    b2Pair.prototype.SetFinal = function () { this.status |= b2Pair.e_pairFinal; };
    b2Pair.prototype.IsFinal = function () { return (this.status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal; };
    // STATIC
    b2Pair.b2_nullPair = b2Settings.USHRT_MAX;
    b2Pair.b2_nullProxy = b2Settings.USHRT_MAX;
    b2Pair.b2_tableCapacity = b2Settings.b2_maxPairs; // must be a power of two
    b2Pair.b2_tableMask = b2Pair.b2_tableCapacity - 1;
    // enum
    b2Pair.e_pairBuffered = 0x0001;
    b2Pair.e_pairRemoved = 0x0002;
    b2Pair.e_pairFinal = 0x0004;
    return b2Pair;
}());
export { b2Pair };
