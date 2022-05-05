/**
* A contact edge is used to connect bodies and contacts together
* in a contact graph where each body is a node and each contact
* is an edge. A contact edge belongs to a doubly linked list
* maintained in each attached body. Each contact has two contact
* nodes, one for each attached body.
*/
var b2ContactEdge = /** @class */ (function () {
    function b2ContactEdge() {
    }
    return b2ContactEdge;
}());
export { b2ContactEdge };
