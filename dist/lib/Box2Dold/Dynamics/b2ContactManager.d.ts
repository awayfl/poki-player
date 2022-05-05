import { b2PairCallback } from '../Collision/b2PairCallback';
import { b2NullContact } from './Contacts/b2NullContact';
import { b2World } from './b2World';
import { b2Contact } from './Contacts/b2Contact';
export declare class b2ContactManager extends b2PairCallback {
    constructor();
    PairAdded(proxyUserData1: any, proxyUserData2: any): any;
    PairRemoved(proxyUserData1: any, proxyUserData2: any, pairUserData: any): void;
    private static readonly s_evalCP;
    Destroy(c: b2Contact): void;
    Collide(): void;
    m_world: b2World;
    m_nullContact: b2NullContact;
    m_destroyImmediate: boolean;
    static InitializeRegisters(): void;
}
//# sourceMappingURL=b2ContactManager.d.ts.map