import { b2Vec2 } from '../Common/Math';
import { b2XForm } from '../Common/Math';
import { b2Shape } from './Shapes/b2Shape';
import { b2Sweep } from '../Common/Math';
export declare class b2TimeOfImpact {
    static s_p1: b2Vec2;
    static s_p2: b2Vec2;
    static s_xf1: b2XForm;
    static s_xf2: b2XForm;
    static TimeOfImpact(shape1: b2Shape, sweep1: b2Sweep, shape2: b2Shape, sweep2: b2Sweep): number;
}
//# sourceMappingURL=b2TimeOfImpact.d.ts.map