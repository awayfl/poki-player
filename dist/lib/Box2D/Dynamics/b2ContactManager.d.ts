import { b2World } from './b2World';
import { IBroadPhase } from '../Collision/IBroadPhase';
import { b2ContactFilter } from './b2ContactFilter';
import { b2ContactListener } from './b2ContactListener';
import { b2Contact, b2ContactFactory } from './Contacts';
/**
* @private
*/
export declare class b2ContactManager {
    __fast__: boolean;
    constructor();
    AddPairDelegate: (proxyUserDataA: any, proxyUserDataB: any) => void;
    AddPair(proxyUserDataA: any, proxyUserDataB: any): void;
    FindNewContacts(): void;
    private static readonly s_evalCP;
    Destroy(c: b2Contact): void;
    Collide(): void;
    m_world: b2World;
    m_broadPhase: IBroadPhase;
    m_contactList: b2Contact;
    m_contactCount: number /** int */;
    m_contactFilter: b2ContactFilter;
    m_contactListener: b2ContactListener;
    m_contactFactory: b2ContactFactory;
    m_allocator: any;
}
//# sourceMappingURL=b2ContactManager.d.ts.map