import { b2TimeStep } from '../b2TimeStep';
import { b2Contact } from './b2Contact';
import { b2ContactConstraint } from './b2ContactConstraint';
export declare class b2ContactSolver {
    constructor(step: b2TimeStep, contacts: b2Contact[], contactCount: number /** int */, allocator: any);
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(): void;
    FinalizeVelocityConstraints(): void;
    SolvePositionConstraints(baumgarte: number): boolean;
    m_step: b2TimeStep;
    m_allocator: any;
    m_constraints: b2ContactConstraint[];
    m_constraintCount: number /** int */;
}
//# sourceMappingURL=b2ContactSolver.d.ts.map