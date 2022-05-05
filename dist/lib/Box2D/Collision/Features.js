/**
* We use contact ids to facilitate warm starting.
*/
var Features = /** @class */ (function () {
    function Features() {
        this.__fast__ = true;
    }
    Object.defineProperty(Features.prototype, "referenceEdge", {
        /**
        * The edge that defines the outward contact normal.
        */
        get: function () {
            return this._referenceEdge;
        },
        set: function (value /** int */) {
            this._referenceEdge = value;
            this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "incidentEdge", {
        /**
        * The edge most anti-parallel to the reference edge.
        */
        get: function () {
            return this._incidentEdge;
        },
        set: function (value /** int */) {
            this._incidentEdge = value;
            this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "incidentVertex", {
        /**
        * The vertex (0 or 1) on the incident edge that was clipped.
        */
        get: function () {
            return this._incidentVertex;
        },
        set: function (value /** int */) {
            this._incidentVertex = value;
            this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Features.prototype, "flip", {
        /**
        * A value of 1 indicates that the reference edge is on shape2.
        */
        get: function () {
            return this._flip;
        },
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
