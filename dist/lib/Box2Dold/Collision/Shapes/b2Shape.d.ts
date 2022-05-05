import { b2XForm } from '../../Common/Math/b2XForm';
import { b2Vec2 } from '../../Common/Math/b2Vec2';
import { b2FilterData } from './b2FilterData';
import { b2AABB } from '../b2AABB';
import { b2BroadPhase } from '../b2BroadPhase';
import { b2ShapeDef } from './b2ShapeDef';
import { b2Segment } from '../b2Segment';
import { b2MassData } from './b2MassData';
import { b2Body } from '../../Dynamics/b2Body';
export declare class b2Shape {
    readonly __fast__ = true;
    GetType(): number /** int */;
    IsSensor(): boolean;
    SetFilterData(filter: b2FilterData): void;
    GetFilterData(): b2FilterData;
    GetBody(): b2Body;
    GetNext(): b2Shape;
    GetUserData(): any;
    SetUserData(data: any): void;
    TestPoint(xf: b2XForm, p: b2Vec2): boolean;
    TestSegment(xf: b2XForm, lambda: any[], // float pointer
    normal: b2Vec2, // pointer
    segment: b2Segment, maxLambda: number): boolean;
    ComputeAABB(aabb: b2AABB, xf: b2XForm): void;
    ComputeSweptAABB(aabb: b2AABB, xf1: b2XForm, xf2: b2XForm): void;
    ComputeMass(massData: b2MassData): void;
    GetSweepRadius(): number;
    GetFriction(): number;
    GetRestitution(): number;
    static Destroy(shape: b2Shape, allocator: any): void;
    constructor(def: b2ShapeDef);
    private static s_proxyAABB;
    CreateProxy(broadPhase: b2BroadPhase, transform: b2XForm): void;
    DestroyProxy(broadPhase: b2BroadPhase): void;
    private static s_syncAABB;
    Synchronize(broadPhase: b2BroadPhase, transform1: b2XForm, transform2: b2XForm): boolean;
    private static s_resetAABB;
    RefilterProxy(broadPhase: b2BroadPhase, transform: b2XForm): void;
    UpdateSweepRadius(center: b2Vec2): void;
    m_type: number /** int */;
    m_next: b2Shape;
    m_body: b2Body;
    m_sweepRadius: number;
    m_density: number;
    m_friction: number;
    m_restitution: number;
    m_proxyId: number /** uint */;
    m_filter: b2FilterData;
    m_isSensor: boolean;
    m_userData: any;
    static readonly e_unknownShape: number /** int */;
    static readonly e_circleShape: number /** int */;
    static readonly e_polygonShape: number /** int */;
    static readonly e_shapeTypeCount: number /** int */;
}
//# sourceMappingURL=b2Shape.d.ts.map