export declare class b2Pair {
    SetBuffered(): void;
    ClearBuffered(): void;
    IsBuffered(): boolean;
    SetRemoved(): void;
    ClearRemoved(): void;
    IsRemoved(): boolean;
    SetFinal(): void;
    IsFinal(): boolean;
    userData: any;
    proxyId1: number /** uint */;
    proxyId2: number /** uint */;
    next: number /** uint */;
    status: number /** uint */;
    static b2_nullPair: number /** uint */;
    static b2_nullProxy: number /** uint */;
    static b2_tableCapacity: number /** int */;
    static b2_tableMask: number /** int */;
    static e_pairBuffered: number /** uint */;
    static e_pairRemoved: number /** uint */;
    static e_pairFinal: number /** uint */;
}
//# sourceMappingURL=b2Pair.d.ts.map