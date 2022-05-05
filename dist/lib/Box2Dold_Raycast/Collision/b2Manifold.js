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
import { b2ManifoldPoint } from './b2ManifoldPoint';
import { b2Vec2 } from '../Common/Math';
// A manifold for two touching convex shapes.
var b2Manifold = /** @class */ (function () {
    function b2Manifold() {
        this.__fast__ = true;
        this.pointCount = 0; ///< the number of manifold points
        this.points = new Array(b2Settings.b2_maxManifoldPoints);
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i] = new b2ManifoldPoint();
        }
        this.normal = new b2Vec2();
    }
    b2Manifold.prototype.Reset = function () {
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i].Reset();
        }
        this.normal.SetZero();
        this.pointCount = 0;
    };
    b2Manifold.prototype.Set = function (m) {
        this.pointCount = m.pointCount;
        for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
            this.points[i].Set(m.points[i]);
        }
        this.normal.SetV(m.normal);
    };
    return b2Manifold;
}());
export { b2Manifold };
