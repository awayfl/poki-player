import { b2Contact } from '../Contacts';
import { b2Fixture } from '../b2Fixture';
/**
* @private
*/
export declare class b2EdgeAndCircleContact extends b2Contact {
    static Create(allocator: any): b2Contact;
    static Destroy(contact: b2Contact, allocator: any): void;
    Reset(fixtureA: b2Fixture, fixtureB: b2Fixture): void;
    Evaluate(): void;
    private b2CollideEdgeAndCircle;
}
//# sourceMappingURL=b2EdgeAndCircleContact.d.ts.map