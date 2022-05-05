import { b2DistanceProxy } from './b2DistanceProxy';
import { b2Transform } from '../Common/Math';
/**
 * Input for b2Distance.
 * You have to option to use the shape radii
 * in the computation. Even
 */
export declare class b2DistanceInput {
    __fast__: boolean;
    proxyA: b2DistanceProxy;
    proxyB: b2DistanceProxy;
    transformA: b2Transform;
    transformB: b2Transform;
    useRadii: boolean;
}
//# sourceMappingURL=b2DistanceInput.d.ts.map