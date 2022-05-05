/**
* Convex polygon. The vertices must be in CCW order for a right-handed
* coordinate system with the z-axis coming out of the screen.
* @see b2PolygonDef
*/
import { ASArray } from '@awayfl/avm2';
import { b2Shape } from './b2Shape';
import { b2Vec2, b2Transform } from '../../Common/Math';
import { b2RayCastOutput } from '../b2RayCastOutput';
import { b2RayCastInput } from '../b2RayCastInput';
import { b2AABB } from '../b2AABB';
import { b2MassData } from './b2MassData';
import { b2OBB } from '../b2OBB';
export declare class b2PolygonShape extends b2Shape {
    __fast__: boolean;
    Copy(): b2Shape;
    Set(other: b2Shape): void;
    /**
     * Copy vertices. This assumes the vertices define a convex polygon.
     * It is assumed that the exterior is the the right of each edge.
     */
    SetAsArray(vertices: Array<b2Vec2> | ASArray, vertexCount?: number): void;
    static AsArray(vertices: Array<b2Vec2>, vertexCount: number): b2PolygonShape;
    /**
     * Copy vertices. This assumes the vertices define a convex polygon.
     * It is assumed that the exterior is the the right of each edge.
     */
    SetAsVector(vertices: Array<b2Vec2>, vertexCount?: number): void;
    static AsVector(vertices: Array<b2Vec2>, vertexCount: number): b2PolygonShape;
    /**
    * Build vertices to represent an axis-aligned box.
    * @param hx the half-width.
    * @param hy the half-height.
    */
    SetAsBox(hx: number, hy: number): void;
    static AsBox(hx: number, hy: number): b2PolygonShape;
    /**
    * Build vertices to represent an oriented box.
    * @param hx the half-width.
    * @param hy the half-height.
    * @param center the center of the box in local coordinates.
    * @param angle the rotation of the box in local coordinates.
    */
    private static s_mat;
    SetAsOrientedBox(hx: number, hy: number, center?: b2Vec2, angle?: number): void;
    static AsOrientedBox(hx: number, hy: number, center?: b2Vec2, angle?: number): b2PolygonShape;
    /**
     * Set this as a single edge.
     */
    SetAsEdge(v1: b2Vec2, v2: b2Vec2): void;
    /**
     * Set this as a single edge.
     */
    static AsEdge(v1: b2Vec2, v2: b2Vec2): b2PolygonShape;
    /**
    * @inheritDoc
    */
    TestPoint(xf: b2Transform, p: b2Vec2): boolean;
    /**
     * @inheritDoc
     */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform): boolean;
    /**
     * @inheritDoc
     */
    ComputeAABB(aabb: b2AABB, xf: b2Transform): void;
    /**
    * @inheritDoc
    */
    ComputeMass(massData: b2MassData, density: number): void;
    /**
    * @inheritDoc
    */
    ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
    /**
    * Get the vertex count.
    */
    GetVertexCount(): number /** int */;
    /**
    * Get the vertices in local coordinates.
    */
    GetVertices(): Array<b2Vec2>;
    /**
    * Get the edge normal vectors. There is one for each vertex.
    */
    GetNormals(): Array<b2Vec2>;
    /**
     * Get the supporting vertex index in the given direction.
     */
    GetSupport(d: b2Vec2): number /** int */;
    GetSupportVertex(d: b2Vec2): b2Vec2;
    private Validate;
    /**
     * @private
     */
    constructor();
    private Reserve;
    m_centroid: b2Vec2;
    m_vertices: Array<b2Vec2>;
    m_normals: Array<b2Vec2>;
    m_vertexCount: number /** int */;
    /**
     * Computes the centroid of the given polygon
     * @param	vs		vector of b2Vec specifying a polygon
     * @param	count	length of vs
     * @return the polygon centroid
     */
    static ComputeCentroid(vs: Array<b2Vec2>, count: number /** uint */): b2Vec2;
    /**
     * Computes a polygon's OBB
     * @see http://www.geometrictools.com/Documentation/MinimumAreaRectangle.pdf
     */
    static ComputeOBB(obb: b2OBB, vs: Array<b2Vec2>, count: number /** int */): void;
}
//# sourceMappingURL=b2PolygonShape.d.ts.map