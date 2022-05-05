import { b2Contact } from '../Contacts';
import { b2Fixture } from '../b2Fixture';
/**
* @private
*/
export declare class b2PolyAndEdgeContact extends b2Contact {
    static Create(allocator: any): b2Contact;
    static Destroy(contact: b2Contact, allocator: any): void;
    Reset(fixtureA: b2Fixture, fixtureB: b2Fixture): void;
    Evaluate(): void;
    private b2CollidePolyAndEdge;
}
//# sourceMappingURL=b2PolyAndEdgeContact.d.ts.map