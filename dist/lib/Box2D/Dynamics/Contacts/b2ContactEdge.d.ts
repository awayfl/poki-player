import { b2Body } from '../b2Body';
import { b2Contact } from '../Contacts';
/**
* A contact edge is used to connect bodies and contacts together
* in a contact graph where each body is a node and each contact
* is an edge. A contact edge belongs to a doubly linked list
* maintained in each attached body. Each contact has two contact
* nodes, one for each attached body.
*/
export declare class b2ContactEdge {
    other: b2Body;
    contact: b2Contact;
    prev: b2ContactEdge;
    next: b2ContactEdge;
}
//# sourceMappingURL=b2ContactEdge.d.ts.map