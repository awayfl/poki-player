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
import { b2ShapeDef } from './b2ShapeDef';
import { b2Shape } from './b2Shape';
import { b2Settings } from '../../Common/b2Settings';
import { b2Vec2, b2Mat22 } from '../../Common/Math';
var b2PolygonDef = /** @class */ (function (_super) {
    __extends(b2PolygonDef, _super);
    function b2PolygonDef() {
        var _this = _super.call(this) || this;
        /// The polygon vertices in local coordinates.
        _this.vertices = new Array(b2Settings.b2_maxPolygonVertices);
        _this.type = b2Shape.e_polygonShape;
        _this.vertexCount = 0;
        for (var i = 0; i < b2Settings.b2_maxPolygonVertices; i++) {
            _this.vertices[i] = new b2Vec2();
        }
        return _this;
    }
    /// Build vertices to represent an axis-aligned box.
    /// @param hx the half-width.
    /// @param hy the half-height.
    b2PolygonDef.prototype.SetAsBox = function (hx, hy) {
        this.vertexCount = 4;
        this.vertices[0].Set(-hx, -hy);
        this.vertices[1].Set(hx, -hy);
        this.vertices[2].Set(hx, hy);
        this.vertices[3].Set(-hx, hy);
    };
    b2PolygonDef.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
        if (center === void 0) { center = null; }
        if (angle === void 0) { angle = 0.0; }
        //SetAsBox(hx, hy);
        {
            this.vertexCount = 4;
            this.vertices[0].Set(-hx, -hy);
            this.vertices[1].Set(hx, -hy);
            this.vertices[2].Set(hx, hy);
            this.vertices[3].Set(-hx, hy);
        }
        if (center) {
            //b2XForm xf;
            //xf.position = center;
            var xfPosition = center;
            //xf.R.Set(angle);
            var xfR = b2PolygonDef.s_mat;
            xfR.Set(angle);
            for (var i = 0; i < this.vertexCount; ++i) {
                //vertices[i] = b2Mul(xf, vertices[i]);
                //var a:b2Vec2 = b2MulMV(T.R, v);
                center = this.vertices[i];
                hx = xfPosition.x + (xfR.col1.x * center.x + xfR.col2.x * center.y);
                center.y = xfPosition.y + (xfR.col1.y * center.x + xfR.col2.y * center.y);
                center.x = hx;
            }
        }
    };
    /// Build vertices to represent an oriented box.
    /// @param hx the half-width.
    /// @param hy the half-height.
    /// @param center the center of the box in local coordinates.
    /// @param angle the rotation of the box in local coordinates.
    b2PolygonDef.s_mat = new b2Mat22();
    return b2PolygonDef;
}(b2ShapeDef));
export { b2PolygonDef };
