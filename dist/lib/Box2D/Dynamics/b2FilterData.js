/**
* This holds contact filtering data.
*/
var b2FilterData = /** @class */ (function () {
    function b2FilterData() {
        this.__fast__ = true;
        /**
        * The collision category bits. Normally you would just set one bit.
        */
        this.categoryBits = 0x0001;
        /**
        * The collision mask bits. This states the categories that this
        * shape would accept for collision.
        */
        this.maskBits = 0xFFFF;
        /**
        * Collision groups allow a certain group of objects to never collide (negative)
        * or always collide (positive). Zero means no collision group. Non-zero group
        * filtering always wins against the mask bits.
        */
        this.groupIndex = 0;
    }
    b2FilterData.prototype.Copy = function () {
        var copy = new b2FilterData();
        copy.categoryBits = this.categoryBits;
        copy.maskBits = this.maskBits;
        copy.groupIndex = this.groupIndex;
        return copy;
    };
    return b2FilterData;
}());
export { b2FilterData };
