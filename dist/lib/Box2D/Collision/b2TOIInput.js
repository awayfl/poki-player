import { b2DistanceProxy } from './b2DistanceProxy';
import { b2Sweep } from '../Common/Math';
/**
 * Inpute parameters for b2TimeOfImpact
 */
var b2TOIInput = /** @class */ (function () {
    function b2TOIInput() {
        this.proxyA = new b2DistanceProxy();
        this.proxyB = new b2DistanceProxy();
        this.sweepA = new b2Sweep();
        this.sweepB = new b2Sweep();
    }
    return b2TOIInput;
}());
export { b2TOIInput };
