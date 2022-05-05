import { b2TimeStep } from '../b2TimeStep';
import { b2Body } from '../b2Body';
import { b2ControllerEdge } from './b2ControllerEdge';
import { b2World } from '../b2World';
import { b2DebugDraw } from '../b2DebugDraw';
/**
 * Base class for controllers. Controllers are a convience for encapsulating common
 * per-step functionality.
 */
export declare class b2Controller {
    Step(step: b2TimeStep): void;
    Draw(debugDraw: b2DebugDraw): void;
    AddBody(body: b2Body): void;
    RemoveBody(body: b2Body): void;
    Clear(): void;
    GetNext(): b2Controller;
    GetWorld(): b2World;
    GetBodyList(): b2ControllerEdge;
    m_next: b2Controller;
    m_prev: b2Controller;
    protected m_bodyList: b2ControllerEdge;
    protected m_bodyCount: number /** int */;
    m_world: b2World;
}
//# sourceMappingURL=b2Controller.d.ts.map