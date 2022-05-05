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
import { __extends } from "tslib";
import { b2Contact } from './b2Contact';
var b2NullContact = /** @class */ (function (_super) {
    __extends(b2NullContact, _super);
    function b2NullContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    b2NullContact.prototype.b2NullContact = function () { };
    b2NullContact.prototype.Evaluate = function (l) { };
    b2NullContact.prototype.GetManifolds = function () { return null; };
    return b2NullContact;
}(b2Contact));
export { b2NullContact };
