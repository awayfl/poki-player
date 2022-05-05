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
import { b2Vec2, b2Mat22 } from '../Math';
/// A transform contains translation and rotation. It is used to represent
/// the position and orientation of rigid frames.
var b2XForm = /** @class */ (function () {
    /// The default constructor does nothing (for performance).
    function b2XForm(pos, r) {
        if (pos === void 0) { pos = null; }
        if (r === void 0) { r = null; }
        this.position = new b2Vec2();
        this.R = new b2Mat22();
        if (pos) {
            this.position.SetV(pos);
            this.R.SetM(r);
        }
    }
    /// Initialize using a position vector and a rotation matrix.
    b2XForm.prototype.Initialize = function (pos, r) {
        this.position.SetV(pos);
        this.R.SetM(r);
    };
    /// Set this to the identity transform.
    b2XForm.prototype.SetIdentity = function () {
        this.position.SetZero();
        this.R.SetIdentity();
    };
    b2XForm.prototype.Set = function (x) {
        this.position.SetV(x.position);
        this.R.SetM(x.R);
    };
    return b2XForm;
}());
export { b2XForm };
