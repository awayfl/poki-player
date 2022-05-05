import { b2Shape } from './b2Shape';
import { b2MassData } from './b2MassData';
import { b2Transform, b2Vec2 } from '../../Common/Math';
import { b2RayCastOutput } from '../b2RayCastOutput';
import { b2RayCastInput } from '../b2RayCastInput';
import { b2AABB } from '../b2AABB';
/**
 * An edge shape.
 * @private
 * @see b2EdgeChainDef
 */
export declare class b2EdgeShape extends b2Shape {
    __fast__: boolean;
    /**
    * Returns false. Edges cannot contain points.
    */
    TestPoint(transform: b2Transform, p: b2Vec2): boolean;
    /**
    * @inheritDoc
    */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform): boolean;
    /**
    * @inheritDoc
    */
    ComputeAABB(aabb: b2AABB, transform: b2Transform): void;
    /**
    * @inheritDoc
    */
    ComputeMass(massData: b2MassData, density: number): void;
    /**
    * @inheritDoc
    */
    ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
    /**
    * Get the distance from vertex1 to vertex2.
    */
    GetLength(): number;
    /**
    * Get the local position of vertex1 in parent body.
    */
    GetVertex1(): b2Vec2;
    /**
    * Get the local position of vertex2 in parent body.
    */
    GetVertex2(): b2Vec2;
    /**
    * Get a core vertex in local coordinates. These vertices
    * represent a smaller edge that is used for time of impact
    * computations.
    */
    GetCoreVertex1(): b2Vec2;
    /**
    * Get a core vertex in local coordinates. These vertices
    * represent a smaller edge that is used for time of impact
    * computations.
    */
    GetCoreVertex2(): b2Vec2;
    /**
    * Get a perpendicular unit vector, pointing
    * from the solid side to the empty side.
    */
    GetNormalVector(): b2Vec2;
    /**
    * Get a parallel unit vector, pointing
    * from vertex1 to vertex2.
    */
    GetDirectionVector(): b2Vec2;
    /**
    * Returns a unit vector halfway between
    * m_direction and m_prevEdge.m_direction.
    */
    GetCorner1Vector(): b2Vec2;
    /**
    * Returns a unit vector halfway between
    * m_direction and m_nextEdge.m_direction.
    */
    GetCorner2Vector(): b2Vec2;
    /**
    * Returns true if the first corner of this edge
    * bends towards the solid side.
    */
    Corner1IsConvex(): boolean;
    /**
    * Returns true if the second corner of this edge
    * bends towards the solid side.
    */
    Corner2IsConvex(): boolean;
    /**
    * Get the first vertex and apply the supplied transform.
    */
    GetFirstVertex(xf: b2Transform): b2Vec2;
    /**
    * Get the next edge in the chain.
    */
    GetNextEdge(): b2EdgeShape;
    /**
    * Get the previous edge in the chain.
    */
    GetPrevEdge(): b2EdgeShape;
    private s_supportVec;
    /**
    * Get the support point in the given world direction.
    * Use the supplied transform.
    */
    Support(xf: b2Transform, dX: number, dY: number): b2Vec2;
    /**
    * @private
    */
    constructor(v1: b2Vec2, v2: b2Vec2);
    /**
    * @private
    */
    SetPrevEdge(edge: b2EdgeShape, core: b2Vec2, cornerDir: b2Vec2, convex: boolean): void;
    /**
    * @private
    */
    SetNextEdge(edge: b2EdgeShape, core: b2Vec2, cornerDir: b2Vec2, convex: boolean): void;
    m_v1: b2Vec2;
    m_v2: b2Vec2;
    m_coreV1: b2Vec2;
    m_coreV2: b2Vec2;
    m_length: number;
    m_normal: b2Vec2;
    m_direction: b2Vec2;
    m_cornerDir1: b2Vec2;
    m_cornerDir2: b2Vec2;
    m_cornerConvex1: boolean;
    m_cornerConvex2: boolean;
    m_nextEdge: b2EdgeShape;
    m_prevEdge: b2EdgeShape;
}
//# sourceMappingURL=b2EdgeShape.d.ts.map