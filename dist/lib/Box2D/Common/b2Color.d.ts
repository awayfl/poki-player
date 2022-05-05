/**
* Color for debug drawing. Each value has the range [0,1].
*/
export declare class b2Color {
    constructor(rr: number, gg: number, bb: number);
    Set(rr: number, gg: number, bb: number): void;
    set r(rr: number);
    set g(gg: number);
    set b(bb: number);
    get color(): number /** uint */;
    private _r;
    private _g;
    private _b;
}
//# sourceMappingURL=b2Color.d.ts.map