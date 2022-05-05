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
import { b2Math } from './Math';
/// A 2D column vector.
var b2Color = /** @class */ (function () {
    function b2Color(rr, gg, bb) {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._r = (255 * b2Math.b2Clamp(rr, 0.0, 1.0)) >>> 0;
        this._g = (255 * b2Math.b2Clamp(gg, 0.0, 1.0)) >>> 0;
        this._b = (255 * b2Math.b2Clamp(bb, 0.0, 1.0)) >>> 0;
    }
    b2Color.prototype.Set = function (rr, gg, bb) {
        this._r = (255 * b2Math.b2Clamp(rr, 0.0, 1.0)) >>> 0;
        this._g = (255 * b2Math.b2Clamp(gg, 0.0, 1.0)) >>> 0;
        this._b = (255 * b2Math.b2Clamp(bb, 0.0, 1.0)) >>> 0;
    };
    Object.defineProperty(b2Color.prototype, "r", {
        // R
        set: function (rr) {
            this._r = (255 * b2Math.b2Clamp(rr, 0.0, 1.0)) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "g", {
        // G
        set: function (gg) {
            this._g = (255 * b2Math.b2Clamp(gg, 0.0, 1.0)) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "b", {
        // B
        set: function (bb) {
            this._b = (255 * b2Math.b2Clamp(bb, 0.0, 1.0)) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "color", {
        // Color
        get: function () {
            return (this._r) | (this._g << 8) | (this._b << 16);
        },
        enumerable: false,
        configurable: true
    });
    return b2Color;
}());
export { b2Color };
