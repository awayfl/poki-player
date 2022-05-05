/**
* A joint edge is used to connect bodies and joints together
* in a joint graph where each body is a node and each joint
* is an edge. A joint edge belongs to a doubly linked list
* maintained in each attached body. Each joint has two joint
* nodes, one for each attached body.
*/
var b2JointEdge = /** @class */ (function () {
    function b2JointEdge() {
    }
    return b2JointEdge;
}());
export { b2JointEdge };