import { b2XForm, b2Vec2 } from '../Math';
export declare class b2Sweep {
    __fast__: boolean;
    GetXForm(xf: b2XForm, t: number): void;
    Advance(t: number): void;
    localCenter: b2Vec2;
    c0: b2Vec2;
    c: b2Vec2;
    a0: number;
    a: number;
    t0: number;
}
//# sourceMappingURL=b2Sweep.d.ts.map