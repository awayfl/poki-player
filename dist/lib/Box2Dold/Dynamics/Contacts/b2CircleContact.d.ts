import { b2Manifold } from '../../Collision/b2Manifold';
import { b2Shape } from '../../Collision/Shapes/b2Shape';
import { b2Contact } from './b2Contact';
import { b2ContactListener } from '../b2ContactListener';
export declare class b2CircleContact extends b2Contact {
    static Create(shape1: b2Shape, shape2: b2Shape, allocator: any): b2Contact;
    static Destroy(contact: b2Contact, allocator: any): void;
    constructor(shape1: b2Shape, shape2: b2Shape);
    private static readonly s_evalCP;
    Evaluate(listener: b2ContactListener): void;
    GetManifolds(): b2Manifold[];
    private m_manifolds;
    m_manifold: b2Manifold;
    private m0;
}
//# sourceMappingURL=b2CircleContact.d.ts.map