import { b2DistanceOutput } from './b2DistanceOutput';
import { b2SimplexCache } from './b2SimplexCache';
import { b2DistanceInput } from './b2DistanceInput';
/**
* @private
*/
export declare class b2Distance {
    __fast__: boolean;
    private static b2_gjkCalls;
    private static b2_gjkIters;
    private static b2_gjkMaxIters;
    private static s_simplex;
    private static s_saveA;
    private static s_saveB;
    static Distance(output: b2DistanceOutput, cache: b2SimplexCache, input: b2DistanceInput): void;
}
//# sourceMappingURL=b2Distance.d.ts.map