import { b2Contact } from './b2Contact';
import { b2ContactListener } from '../b2ContactListener';
import { b2Manifold } from '../../Collision/b2Manifold';
export declare class b2NullContact extends b2Contact {
    b2NullContact(): void;
    Evaluate(l: b2ContactListener): void;
    GetManifolds(): b2Manifold[];
}
//# sourceMappingURL=b2NullContact.d.ts.map