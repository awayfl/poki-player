import { b2Vec2, b2Mat22 } from '../Math';
export declare class b2XForm {
    constructor(pos?: b2Vec2, r?: b2Mat22);
    Initialize(pos: b2Vec2, r: b2Mat22): void;
    SetIdentity(): void;
    Set(x: b2XForm): void;
    position: b2Vec2;
    R: b2Mat22;
}
//# sourceMappingURL=b2XForm.d.ts.map