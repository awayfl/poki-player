import { b2Vec2, b2Transform } from '../Common/Math';
import { b2Color } from '../Common/b2Color';
import { Sprite } from '@awayjs/scene';
/**
* Implement and register this class with a b2World to provide debug drawing of physics
* entities in your game.
*/
export declare class b2DebugDraw {
    __fast__: boolean;
    constructor();
    /** Draw shapes */
    static e_shapeBit: number /** uint */;
    /** Draw joint connections */
    static e_jointBit: number /** uint */;
    /** Draw axis aligned bounding boxes */
    static e_aabbBit: number /** uint */;
    /** Draw broad-phase pairs */
    static e_pairBit: number /** uint */;
    /** Draw center of mass frame */
    static e_centerOfMassBit: number /** uint */;
    /** Draw controllers */
    static e_controllerBit: number /** uint */;
    /**
    * Set the drawing flags.
    */
    SetFlags(flags: number /** uint */): void;
    /**
    * Get the drawing flags.
    */
    GetFlags(): number /** uint */;
    /**
    * Append flags to the current flags.
    */
    AppendFlags(flags: number /** uint */): void;
    /**
    * Clear flags from the current flags.
    */
    ClearFlags(flags: number /** uint */): void;
    /**
    * Set the sprite
    */
    SetSprite(sprite: Sprite): void;
    /**
    * Get the sprite
    */
    GetSprite(): Sprite;
    /**
    * Set the draw scale
    */
    SetDrawScale(drawScale: number): void;
    /**
    * Get the draw
    */
    GetDrawScale(): Number;
    /**
    * Set the line thickness
    */
    SetLineThickness(lineThickness: number): void;
    /**
    * Get the line thickness
    */
    GetLineThickness(): Number;
    /**
    * Set the alpha value used for lines
    */
    SetAlpha(alpha: number): void;
    /**
    * Get the alpha value used for lines
    */
    GetAlpha(): Number;
    /**
    * Set the alpha value used for fills
    */
    SetFillAlpha(alpha: number): void;
    /**
    * Get the alpha value used for fills
    */
    GetFillAlpha(): Number;
    /**
    * Set the scale used for drawing XForms
    */
    SetXFormScale(xformScale: number): void;
    /**
    * Get the scale used for drawing XForms
    */
    GetXFormScale(): Number;
    /**
    * Draw a closed polygon provided in CCW order.
    */
    DrawPolygon(vertices: Array<b2Vec2>, vertexCount: number /** int */, color: b2Color): void;
    /**
    * Draw a solid closed polygon provided in CCW order.
    */
    DrawSolidPolygon(vertices: Array<b2Vec2>, vertexCount: number /** int */, color: b2Color): void;
    /**
    * Draw a circle.
    */
    DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
    /**
    * Draw a solid circle.
    */
    DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
    /**
    * Draw a line segment.
    */
    DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
    /**
    * Draw a transform. Choose your own length scale.
    * @param xf a transform.
    */
    DrawTransform(xf: b2Transform): void;
    private m_drawFlags;
    m_sprite: Sprite;
    private m_drawScale;
    private m_lineThickness;
    private m_alpha;
    private m_fillAlpha;
    private m_xformScale;
}
//# sourceMappingURL=b2DebugDraw.d.ts.map