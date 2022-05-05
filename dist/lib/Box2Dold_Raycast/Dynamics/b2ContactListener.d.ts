import { b2ContactPoint } from '../Collision/b2ContactPoint';
import { b2ContactResult } from './Contacts/b2ContactResult';
export declare class b2ContactListener {
    readonly __fast__ = true;
    Add(point: b2ContactPoint): void;
    Persist(point: b2ContactPoint): void;
    Remove(point: b2ContactPoint): void;
    Result(point: b2ContactResult): void;
}
//# sourceMappingURL=b2ContactListener.d.ts.map