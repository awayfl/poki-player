import { b2FilterData } from './b2FilterData';
/**
 * A fixture definition is used to create a fixture. This class defines an
 * abstract fixture definition. You can reuse fixture definitions safely.
 */
var b2FixtureDef = /** @class */ (function () {
    /**
     * The constructor sets the default fixture definition values.
     */
    function b2FixtureDef() {
        this.__fast__ = true;
        /**
         * Contact filtering data.
         */
        this.filter = new b2FilterData();
        this.shape = null;
        this.userData = null;
        this.friction = 0.2;
        this.restitution = 0.0;
        this.density = 0.0;
        this.filter.categoryBits = 0x0001;
        this.filter.maskBits = 0xFFFF;
        this.filter.groupIndex = 0;
        this.isSensor = false;
    }
    return b2FixtureDef;
}());
export { b2FixtureDef };
