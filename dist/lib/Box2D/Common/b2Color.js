/**
* Color for debug drawing. Each value has the range [0,1].
*/
import { b2Math } from './Math';
var b2Color = /** @class */ (function () {
    function b2Color(rr, gg, bb) {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._r = 255 * b2Math.Clamp(rr, 0.0, 1.0) >>> 0;
        this._g = 255 * b2Math.Clamp(gg, 0.0, 1.0) >>> 0;
        this._b = 255 * b2Math.Clamp(bb, 0.0, 1.0) >>> 0;
    }
    b2Color.prototype.Set = function (rr, gg, bb) {
        this._r = 255 * b2Math.Clamp(rr, 0.0, 1.0) >>> 0;
        this._g = 255 * b2Math.Clamp(gg, 0.0, 1.0) >>> 0;
        this._b = 255 * b2Math.Clamp(bb, 0.0, 1.0) >>> 0;
    };
    Object.defineProperty(b2Color.prototype, "r", {
        // R
        set: function (rr) {
            this._r = 255 * b2Math.Clamp(rr, 0.0, 1.0) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "g", {
        // G
        set: function (gg) {
            this._g = 255 * b2Math.Clamp(gg, 0.0, 1.0) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "b", {
        // B
        set: function (bb) {
            this._b = 255 * b2Math.Clamp(bb, 0.0, 1.0) >>> 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(b2Color.prototype, "color", {
        // Color
        get: function () {
            return (this._r << 16) | (this._g << 8) | (this._b);
        },
        enumerable: false,
        configurable: true
    });
    return b2Color;
}());
export { b2Color };
