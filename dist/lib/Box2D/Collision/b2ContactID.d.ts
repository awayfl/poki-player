import { Features } from './Features';
/**
* We use contact ids to facilitate warm starting.
*/
export declare class b2ContactID {
    readonly __fast__ = true;
    constructor();
    Set(id: b2ContactID): void;
    Copy(): b2ContactID;
    get key(): number /** uint */;
    set key(value: number /** uint */);
    features: Features;
    /** Used to quickly compare contact ids. */
    _key: number /** uint */;
}
//# sourceMappingURL=b2ContactID.d.ts.map