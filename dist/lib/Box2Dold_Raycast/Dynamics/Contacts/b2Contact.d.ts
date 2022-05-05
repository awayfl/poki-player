import { b2Shape } from '../../Collision/Shapes/b2Shape';
import { b2ContactRegister } from './b2ContactRegister';
import { b2Manifold } from '../../Collision/b2Manifold';
import { b2ContactEdge } from './b2ContactEdge';
import { b2ContactListener } from '../b2ContactListener';
export declare class b2Contact {
    readonly __fast__ = true;
    GetManifolds(): b2Manifold[];
    GetManifoldCount(): number /** int */;
    IsSolid(): boolean;
    GetNext(): b2Contact;
    GetShape1(): b2Shape;
    GetShape2(): b2Shape;
    static e_nonSolidFlag: number /** uint */;
    static e_slowFlag: number /** uint */;
    static e_islandFlag: number /** uint */;
    static e_toiFlag: number /** uint */;
    static AddType(createFcn: Function, destroyFcn: Function, type1: number /** int */, type2: number /** int */): void;
    constructor(s1?: b2Shape, s2?: b2Shape);
    Update(listener: b2ContactListener): void;
    Evaluate(listener: b2ContactListener): void;
    static s_registers: b2ContactRegister[][];
    static s_initialized: boolean;
    m_flags: number /** uint */;
    m_prev: b2Contact;
    m_next: b2Contact;
    m_node1: b2ContactEdge;
    m_node2: b2ContactEdge;
    m_shape1: b2Shape;
    m_shape2: b2Shape;
    m_manifoldCount: number /** int */;
    m_friction: number;
    m_restitution: number;
    m_toi: number;
}
//# sourceMappingURL=b2Contact.d.ts.map