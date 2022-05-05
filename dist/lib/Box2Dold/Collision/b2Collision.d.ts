import { b2Vec2 } from '../Common/Math';
import { ClipVertex } from './ClipVertex';
import { b2PolygonShape } from './Shapes/b2PolygonShape';
import { b2XForm } from '../Common/Math';
import { b2Manifold } from './b2Manifold';
import { b2AABB } from './b2AABB';
import { b2CircleShape } from './Shapes/b2CircleShape';
export declare class b2Collision {
    static readonly b2_nullFeature: number /** uint */;
    static ClipSegmentToLine(vOut: ClipVertex[], vIn: ClipVertex[], normal: b2Vec2, offset: number): number /** int */;
    static EdgeSeparation(poly1: b2PolygonShape, xf1: b2XForm, edge1: number /** int */, poly2: b2PolygonShape, xf2: b2XForm): number;
    static FindMaxSeparation(edgeIndex: number[], poly1: b2PolygonShape, xf1: b2XForm, poly2: b2PolygonShape, xf2: b2XForm): number;
    static FindIncidentEdge(c: ClipVertex[], poly1: b2PolygonShape, xf1: b2XForm, edge1: number /** int */, poly2: b2PolygonShape, xf2: b2XForm): void;
    private static b2CollidePolyTempVec;
    static b2CollidePolygons(manifold: b2Manifold, polyA: b2PolygonShape, xfA: b2XForm, polyB: b2PolygonShape, xfB: b2XForm): void;
    static b2CollideCircles(manifold: b2Manifold, circle1: b2CircleShape, xf1: b2XForm, circle2: b2CircleShape, xf2: b2XForm): void;
    static b2CollidePolygonAndCircle(manifold: b2Manifold, polygon: b2PolygonShape, xf1: b2XForm, circle: b2CircleShape, xf2: b2XForm): void;
    static b2TestOverlap(a: b2AABB, b: b2AABB): boolean;
}
//# sourceMappingURL=b2Collision.d.ts.map