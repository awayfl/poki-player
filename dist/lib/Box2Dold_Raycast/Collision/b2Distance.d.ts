import { b2Vec2, b2XForm } from '../Common/Math';
import { b2Shape } from './Shapes/b2Shape';
import { b2PolygonShape } from './Shapes/b2PolygonShape';
import { b2CircleShape } from './Shapes/b2CircleShape';
export declare class b2Distance {
    static ProcessTwo(x1: b2Vec2, x2: b2Vec2, p1s: b2Vec2[], p2s: b2Vec2[], points: b2Vec2[]): number /** int */;
    static ProcessThree(x1: b2Vec2, x2: b2Vec2, p1s: b2Vec2[], p2s: b2Vec2[], points: b2Vec2[]): number /** int */;
    static InPoints(w: b2Vec2, points: b2Vec2[], pointCount: number /** int */): boolean;
    private static s_p1s;
    private static s_p2s;
    private static s_points;
    static DistanceGeneric(x1: b2Vec2, x2: b2Vec2, shape1: any, xf1: b2XForm, shape2: any, xf2: b2XForm): number;
    static DistanceCC(x1: b2Vec2, x2: b2Vec2, circle1: b2CircleShape, xf1: b2XForm, circle2: b2CircleShape, xf2: b2XForm): number;
    private static gPoint;
    static DistancePC(x1: b2Vec2, x2: b2Vec2, polygon: b2PolygonShape, xf1: b2XForm, circle: b2CircleShape, xf2: b2XForm): number;
    static Distance(x1: b2Vec2, x2: b2Vec2, shape1: b2Shape, xf1: b2XForm, shape2: b2Shape, xf2: b2XForm): number;
    static g_GJK_Iterations: number /** int */;
}
//# sourceMappingURL=b2Distance.d.ts.map