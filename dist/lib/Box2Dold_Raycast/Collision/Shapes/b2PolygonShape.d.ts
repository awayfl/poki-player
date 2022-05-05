import { b2Shape } from './b2Shape';
import { b2XForm, b2Vec2 } from '../../Common/Math';
import { b2AABB } from '../b2AABB';
import { b2OBB } from '../b2OBB';
import { b2ShapeDef } from './b2ShapeDef';
import { b2Segment } from '../b2Segment';
import { b2MassData } from './b2MassData';
export declare class b2PolygonShape extends b2Shape {
    TestPoint(xf: b2XForm, p: b2Vec2): boolean;
    TestSegment(xf: b2XForm, lambda: number[], // float ptr
    normal: b2Vec2, // ptr
    segment: b2Segment, maxLambda: number): number;
    private static s_computeMat;
    ComputeAABB(aabb: b2AABB, xf: b2XForm): void;
    private static s_sweptAABB1;
    private static s_sweptAABB2;
    ComputeSweptAABB(aabb: b2AABB, transform1: b2XForm, transform2: b2XForm): void;
    ComputeMass(massData: b2MassData): void;
    GetOBB(): b2OBB;
    GetCentroid(): b2Vec2;
    GetVertexCount(): number /** int */;
    GetVertices(): b2Vec2[];
    GetCoreVertices(): b2Vec2[];
    GetNormals(): b2Vec2[];
    GetFirstVertex(xf: b2XForm): b2Vec2;
    Centroid(xf: b2XForm): b2Vec2;
    private s_supportVec;
    Support(xf: b2XForm, dX: number, dY: number): b2Vec2;
    constructor(def: b2ShapeDef);
    UpdateSweepRadius(center: b2Vec2): void;
    m_centroid: b2Vec2;
    m_obb: b2OBB;
    m_vertices: b2Vec2[];
    m_normals: b2Vec2[];
    m_coreVertices: b2Vec2[];
    m_vertexCount: number /** int */;
    static ComputeCentroid(vs: b2Vec2[], count: number /** int */): b2Vec2;
    static ComputeOBB(obb: b2OBB, vs: b2Vec2[], count: number /** int */): void;
}
//# sourceMappingURL=b2PolygonShape.d.ts.map