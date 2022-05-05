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
// We use contact ids to facilitate warm starting.
var Features = /** @class */ (function () {
    function Features() {
    }
    Object.defineProperty(Features.prototype, "referenceEdge", {
        get: function () {
            return this._referenceEdge;
        },
        ///< The edge that defines the outward contact normal.
        set: function (value /** int */) {
            this._referenceEdge = value;
            this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "incidentEdge", {
        get: function () {
            return this._incidentEdge;
        },
        ///< The edge most anti-parallel to the reference edge.
        set: function (value /** int */) {
            this._incidentEdge = value;
            this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "incidentVertex", {
        get: function () {
            return this._incidentVertex;
        },
        ///< The vertex (0 or 1) on the incident edge that was clipped.
        set: function (value /** int */) {
            this._incidentVertex = value;
            this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "flip", {
        get: function () {
            return this._flip;
        },
        ///< A value of 1 indicates that the reference edge is on shape2.
        set: function (value /** int */) {
            this._flip = value;
            this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
        },
        enumerable: false,
        configurable: true
    });
    return Features;
}());
export { Features };
