import { b2ShapeDef } from './b2ShapeDef';
import { b2Vec2 } from '../../Common/Math';
export declare class b2PolygonDef extends b2ShapeDef {
    constructor();
    SetAsBox(hx: number, hy: number): void;
    private static s_mat;
    SetAsOrientedBox(hx: number, hy: number, center?: b2Vec2, angle?: number): void;
    vertices: b2Vec2[];
    vertexCount: number /** int */;
}
//# sourceMappingURL=b2PolygonDef.d.ts.map