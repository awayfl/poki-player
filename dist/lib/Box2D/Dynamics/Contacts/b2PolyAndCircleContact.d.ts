import { b2Fixture } from '../b2Fixture';
import { b2Contact } from '../Contacts';
/**
* @private
*/
export declare class b2PolyAndCircleContact extends b2Contact {
    static Create(allocator: any): b2Contact;
    static Destroy(contact: b2Contact, allocator: any): void;
    Reset(fixtureA: b2Fixture, fixtureB: b2Fixture): void;
    Evaluate(): void;
}
//# sourceMappingURL=b2PolyAndCircleContact.d.ts.map