import { b2Vec2, b2Transform } from '../Common/Math';
import { b2PolygonShape } from './Shapes/b2PolygonShape';
import { ClipVertex } from './ClipVertex';
import { b2Manifold } from './b2Manifold';
import { b2CircleShape } from './Shapes/b2CircleShape';
import { b2AABB } from './b2AABB';
/**
* @private
*/
export declare class b2Collision {
    static readonly b2_nullFeature: number /** uint */;
    static ClipSegmentToLine(vOut: Array<ClipVertex>, vIn: Array<ClipVertex>, normal: b2Vec2, offset: number): number /** int */;
    static EdgeSeparation(poly1: b2PolygonShape, xf1: b2Transform, edge1: number /** int */, poly2: b2PolygonShape, xf2: b2Transform): number;
    static FindMaxSeparation(edgeIndex: Array<number /** int */>, poly1: b2PolygonShape, xf1: b2Transform, poly2: b2PolygonShape, xf2: b2Transform): number;
    static FindIncidentEdge(c: Array<ClipVertex>, poly1: b2PolygonShape, xf1: b2Transform, edge1: number /** int */, poly2: b2PolygonShape, xf2: b2Transform): void;
    private static MakeClipPointVector;
    private static s_incidentEdge;
    private static s_clipPoints1;
    private static s_clipPoints2;
    private static s_edgeAO;
    private static s_edgeBO;
    private static s_localTangent;
    private static s_localNormal;
    private static s_planePoint;
    private static s_normal;
    private static s_tangent;
    private static s_tangent2;
    private static s_v11;
    private static s_v12;
    private static b2CollidePolyTempVec;
    static CollidePolygons(manifold: b2Manifold, polyA: b2PolygonShape, xfA: b2Transform, polyB: b2PolygonShape, xfB: b2Transform): void;
    static CollideCircles(manifold: b2Manifold, circle1: b2CircleShape, xf1: b2Transform, circle2: b2CircleShape, xf2: b2Transform): void;
    static CollidePolygonAndCircle(manifold: b2Manifold, polygon: b2PolygonShape, xf1: b2Transform, circle: b2CircleShape, xf2: b2Transform): void;
    static TestOverlap(a: b2AABB, b: b2AABB): boolean;
}
//# sourceMappingURL=b2Collision.d.ts.map