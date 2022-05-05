import { b2XForm, b2Vec2 } from '../Common/Math';
import { b2Color } from '../Common/b2Color';
export declare class b2DebugDraw {
    constructor();
    static e_shapeBit: number /** uint */;
    static e_jointBit: number /** uint */;
    static e_coreShapeBit: number /** uint */;
    static e_aabbBit: number /** uint */;
    static e_obbBit: number /** uint */;
    static e_pairBit: number /** uint */;
    static e_centerOfMassBit: number /** uint */;
    SetFlags(flags: number /** uint */): void;
    GetFlags(): number /** uint */;
    AppendFlags(flags: number /** uint */): void;
    ClearFlags(flags: number /** uint */): void;
    DrawPolygon(vertices: b2Vec2[], vertexCount: number /** int */, color: b2Color): void;
    DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number /** int */, color: b2Color): void;
    DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
    DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
    DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
    DrawXForm(xf: b2XForm): void;
    m_drawFlags: number /** uint */;
    m_sprite: any;
    m_drawScale: number;
    m_lineThickness: number;
    m_alpha: number;
    m_fillAlpha: number;
    m_xformScale: number;
}
//# sourceMappingURL=b2DebugDraw.d.ts.map