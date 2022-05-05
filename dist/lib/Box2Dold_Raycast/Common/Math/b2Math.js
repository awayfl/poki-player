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
import { b2Vec2, b2Mat22, b2XForm } from '../Math';
var b2Math = /** @class */ (function () {
    function b2Math() {
    }
    /// This function is used to ensure that a floating point number is
    /// not a NaN or infinity.
    b2Math.b2IsValid = function (x) {
        return isFinite(x);
    };
    /*public static b2InvSqrt(x:number):number{
        union
        {
            float32 x;
            int32 i;
        } convert;

        convert.x = x;
        float32 xhalf = 0.5f * x;
        convert.i = 0x5f3759df - (convert.i >> 1);
        x = convert.x;
        x = x * (1.5f - xhalf * x * x);
        return x;
    }*/
    b2Math.b2Dot = function (a, b) {
        return a.x * b.x + a.y * b.y;
    };
    b2Math.b2CrossVV = function (a, b) {
        return a.x * b.y - a.y * b.x;
    };
    b2Math.b2CrossVF = function (a, s) {
        var v = new b2Vec2(s * a.y, -s * a.x);
        return v;
    };
    b2Math.b2CrossFV = function (s, a) {
        var v = new b2Vec2(-s * a.y, s * a.x);
        return v;
    };
    b2Math.b2MulMV = function (A, v) {
        // (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y)
        // (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y)
        var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
        return u;
    };
    b2Math.b2MulTMV = function (A, v) {
        // (tVec.x * tMat.col1.x + tVec.y * tMat.col1.y)
        // (tVec.x * tMat.col2.x + tVec.y * tMat.col2.y)
        var u = new b2Vec2(this.b2Dot(v, A.col1), this.b2Dot(v, A.col2));
        return u;
    };
    b2Math.b2MulX = function (T, v) {
        var a = this.b2MulMV(T.R, v);
        a.x += T.position.x;
        a.y += T.position.y;
        //return T.position + b2Mul(T.R, v);
        return a;
    };
    b2Math.b2MulXT = function (T, v) {
        var a = this.SubtractVV(v, T.position);
        //return b2MulT(T.R, v - T.position);
        var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
        a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
        a.x = tX;
        return a;
    };
    b2Math.AddVV = function (a, b) {
        var v = new b2Vec2(a.x + b.x, a.y + b.y);
        return v;
    };
    b2Math.SubtractVV = function (a, b) {
        var v = new b2Vec2(a.x - b.x, a.y - b.y);
        return v;
    };
    b2Math.b2Distance = function (a, b) {
        var cX = a.x - b.x;
        var cY = a.y - b.y;
        return Math.sqrt(cX * cX + cY * cY);
    };
    b2Math.b2DistanceSquared = function (a, b) {
        var cX = a.x - b.x;
        var cY = a.y - b.y;
        return (cX * cX + cY * cY);
    };
    b2Math.MulFV = function (s, a) {
        var v = new b2Vec2(s * a.x, s * a.y);
        return v;
    };
    b2Math.AddMM = function (A, B) {
        var C = new b2Mat22(0, this.AddVV(A.col1, B.col1), this.AddVV(A.col2, B.col2));
        return C;
    };
    // A * B
    b2Math.b2MulMM = function (A, B) {
        var C = new b2Mat22(0, this.b2MulMV(A, B.col1), this.b2MulMV(A, B.col2));
        return C;
    };
    // A^T * B
    b2Math.b2MulTMM = function (A, B) {
        var c1 = new b2Vec2(this.b2Dot(A.col1, B.col1), this.b2Dot(A.col2, B.col1));
        var c2 = new b2Vec2(this.b2Dot(A.col1, B.col2), this.b2Dot(A.col2, B.col2));
        var C = new b2Mat22(0, c1, c2);
        return C;
    };
    b2Math.b2Abs = function (a) {
        return a > 0.0 ? a : -a;
    };
    b2Math.b2AbsV = function (a) {
        var b = new b2Vec2(this.b2Abs(a.x), this.b2Abs(a.y));
        return b;
    };
    b2Math.b2AbsM = function (A) {
        var B = new b2Mat22(0, this.b2AbsV(A.col1), this.b2AbsV(A.col2));
        return B;
    };
    b2Math.b2Min = function (a, b) {
        return a < b ? a : b;
    };
    b2Math.b2MinV = function (a, b) {
        var c = new b2Vec2(this.b2Min(a.x, b.x), this.b2Min(a.y, b.y));
        return c;
    };
    b2Math.b2Max = function (a, b) {
        return a > b ? a : b;
    };
    b2Math.b2MaxV = function (a, b) {
        var c = new b2Vec2(this.b2Max(a.x, b.x), this.b2Max(a.y, b.y));
        return c;
    };
    b2Math.b2Clamp = function (a, low, high) {
        return this.b2Max(low, this.b2Min(a, high));
    };
    b2Math.b2ClampV = function (a, low, high) {
        return this.b2MaxV(low, this.b2MinV(a, high));
    };
    b2Math.b2Swap = function (a, b) {
        var tmp = a[0];
        a[0] = b[0];
        b[0] = tmp;
    };
    // b2Random number in range [-1,1]
    b2Math.b2Random = function () {
        return Math.random() * 2 - 1;
    };
    b2Math.b2RandomRange = function (lo, hi) {
        var r = Math.random();
        r = (hi - lo) * r + lo;
        return r;
    };
    // "Next Largest Power of 2
    // Given a binary integer value x, the next largest power of 2 can be computed by a SWAR algorithm
    // that recursively "folds" the upper bits into the lower bits. This process yields a bit vector with
    // the same most significant 1 as x, but all 1's below it. Adding 1 to that value yields the next
    // largest power of 2. For a 32-bit value:"
    b2Math.b2NextPowerOfTwo = function (x /** uint */) {
        x |= (x >> 1) & 0x7FFFFFFF;
        x |= (x >> 2) & 0x3FFFFFFF;
        x |= (x >> 4) & 0x0FFFFFFF;
        x |= (x >> 8) & 0x00FFFFFF;
        x |= (x >> 16) & 0x0000FFFF;
        return x + 1;
    };
    b2Math.b2IsPowerOfTwo = function (x /** uint */) {
        var result = x > 0 && (x & (x - 1)) == 0;
        return result;
    };
    // Temp vector functions to reduce calls to 'new'
    /*public static tempVec:b2Vec2 = new b2Vec2();
    public static tempVec2:b2Vec2 = new b2Vec2();
    public static tempVec3:b2Vec2 = new b2Vec2();
    public static tempVec4:b2Vec2 = new b2Vec2();
    public static tempVec5:b2Vec2 = new b2Vec2();

    public static tempMat:b2Mat22 = new b2Mat22();

    public static tempAABB:b2AABB = new b2AABB();	*/
    b2Math.b2Vec2_zero = new b2Vec2(0.0, 0.0);
    b2Math.b2Mat22_identity = new b2Mat22(0, new b2Vec2(1.0, 0.0), new b2Vec2(0.0, 1.0));
    b2Math.b2XForm_identity = new b2XForm(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
    return b2Math;
}());
export { b2Math };
