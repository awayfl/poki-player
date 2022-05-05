import { b2Fixture } from '../b2Fixture';
import { b2Contact } from '../Contacts';
/**
 * This class manages creation and destruction of b2Contact objects.
 * @private
 */
export declare class b2ContactFactory {
    constructor(allocator: any);
    AddType(createFcn: Function, destroyFcn: Function, type1: number /** int */, type2: number /** int */): void;
    InitializeRegisters(): void;
    Create(fixtureA: b2Fixture, fixtureB: b2Fixture): b2Contact;
    Destroy(contact: b2Contact): void;
    private m_registers;
    private m_allocator;
}
//# sourceMappingURL=b2ContactFactory.d.ts.map