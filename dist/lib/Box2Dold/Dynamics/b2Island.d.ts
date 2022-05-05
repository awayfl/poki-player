import { b2ContactListener } from './b2ContactListener';
import { b2TimeStep } from './b2TimeStep';
import { b2Vec2 } from '../Common/Math';
import { b2Joint } from './Joints';
import { b2Body } from './b2Body';
import { b2Contact } from './Contacts/b2Contact';
import { b2ContactConstraint } from './Contacts/b2ContactConstraint';
export declare class b2Island {
    constructor(bodyCapacity: number /** int */, contactCapacity: number /** int */, jointCapacity: number /** int */, allocator: any, listener: b2ContactListener);
    Clear(): void;
    Solve(step: b2TimeStep, gravity: b2Vec2, correctPositions: boolean, allowSleep: boolean): void;
    SolveTOI(subStep: b2TimeStep): void;
    private static s_reportCR;
    Report(constraints: b2ContactConstraint[]): void;
    AddBody(body: b2Body): void;
    AddContact(contact: b2Contact): void;
    AddJoint(joint: b2Joint): void;
    m_allocator: any;
    m_listener: b2ContactListener;
    m_bodies: b2Body[];
    m_contacts: b2Contact[];
    m_joints: b2Joint[];
    m_bodyCount: number /** int */;
    m_jointCount: number /** int */;
    m_contactCount: number /** int */;
    m_bodyCapacity: number /** int */;
    m_contactCapacity: number /** int */;
    m_jointCapacity: number /** int */;
    m_positionIterationCount: number /** int */;
}
//# sourceMappingURL=b2Island.d.ts.map