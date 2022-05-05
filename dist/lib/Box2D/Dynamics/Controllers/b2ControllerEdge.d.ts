import { b2Body } from '../b2Body';
import { b2Controller } from './b2Controller';
export declare class b2ControllerEdge {
    /** provides quick access to other end of this edge */
    controller: b2Controller;
    /** the body */
    body: b2Body;
    /** the previous controller edge in the controllers's body list */
    prevBody: b2ControllerEdge;
    /** the next controller edge in the controllers's body list */
    nextBody: b2ControllerEdge;
    /** the previous controller edge in the body's controller list */
    prevController: b2ControllerEdge;
    /** the next controller edge in the body's controller list */
    nextController: b2ControllerEdge;
}
//# sourceMappingURL=b2ControllerEdge.d.ts.map