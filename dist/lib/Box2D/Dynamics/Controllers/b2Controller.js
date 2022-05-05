import { b2ControllerEdge } from './b2ControllerEdge';
/**
 * Base class for controllers. Controllers are a convience for encapsulating common
 * per-step functionality.
 */
var b2Controller = /** @class */ (function () {
    function b2Controller() {
    }
    b2Controller.prototype.Step = function (step) { };
    b2Controller.prototype.Draw = function (debugDraw) { };
    b2Controller.prototype.AddBody = function (body) {
        var edge = new b2ControllerEdge();
        edge.controller = this;
        edge.body = body;
        //
        edge.nextBody = this.m_bodyList;
        edge.prevBody = null;
        this.m_bodyList = edge;
        if (edge.nextBody)
            edge.nextBody.prevBody = edge;
        this.m_bodyCount++;
        //
        edge.nextController = body.m_controllerList;
        edge.prevController = null;
        body.m_controllerList = edge;
        if (edge.nextController)
            edge.nextController.prevController = edge;
        body.m_controllerCount++;
    };
    b2Controller.prototype.RemoveBody = function (body) {
        var edge = body.m_controllerList;
        while (edge && edge.controller != this)
            edge = edge.nextController;
        //Attempted to remove a body that was not attached?
        //b2Settings.b2Assert(bEdge != null);
        if (edge.prevBody)
            edge.prevBody.nextBody = edge.nextBody;
        if (edge.nextBody)
            edge.nextBody.prevBody = edge.prevBody;
        if (edge.nextController)
            edge.nextController.prevController = edge.prevController;
        if (edge.prevController)
            edge.prevController.nextController = edge.nextController;
        if (this.m_bodyList == edge)
            this.m_bodyList = edge.nextBody;
        if (body.m_controllerList == edge)
            body.m_controllerList = edge.nextController;
        body.m_controllerCount--;
        this.m_bodyCount--;
        //b2Settings.b2Assert(body.m_controllerCount >= 0);
        //b2Settings.b2Assert(m_bodyCount >= 0);
    };
    b2Controller.prototype.Clear = function () {
        while (this.m_bodyList)
            this.RemoveBody(this.m_bodyList.body);
    };
    b2Controller.prototype.GetNext = function () { return this.m_next; };
    b2Controller.prototype.GetWorld = function () { return this.m_world; };
    b2Controller.prototype.GetBodyList = function () {
        return this.m_bodyList;
    };
    return b2Controller;
}());
export { b2Controller };
