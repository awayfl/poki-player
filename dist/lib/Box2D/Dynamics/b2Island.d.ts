import { b2Body } from './b2Body';
import { b2Joint } from './Joints';
import { b2ContactListener } from './b2ContactListener';
import { b2TimeStep } from './b2TimeStep';
import { b2Vec2 } from '../Common/Math';
import { b2Contact, b2ContactSolver, b2ContactConstraint } from './Contacts';
/**
* @private
*/
export declare class b2Island {
    __fast__: boolean;
    constructor();
    Initialize(bodyCapacity: number /** int */, contactCapacity: number /** int */, jointCapacity: number /** int */, allocator: any, listener: b2ContactListener, contactSolver: b2ContactSolver): void;
    Clear(): void;
    Solve(step: b2TimeStep, gravity: b2Vec2, allowSleep: boolean): void;
    SolveTOI(subStep: b2TimeStep): void;
    private static s_impulse;
    Report(constraints: Array<b2ContactConstraint>): void;
    AddBody(body: b2Body): void;
    AddContact(contact: b2Contact): void;
    AddJoint(joint: b2Joint): void;
    private m_allocator;
    private m_listener;
    private m_contactSolver;
    m_bodies: Array<b2Body>;
    m_contacts: Array<b2Contact>;
    m_joints: Array<b2Joint>;
    m_bodyCount: number /** int */;
    m_jointCount: number /** int */;
    m_contactCount: number /** int */;
    private m_bodyCapacity;
    m_contactCapacity: number /** int */;
    m_jointCapacity: number /** int */;
}
//# sourceMappingURL=b2Island.d.ts.map