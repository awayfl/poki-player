import { b2TimeStep } from '../b2TimeStep';
import { b2Contact, b2ContactConstraint } from '../Contacts';
/**
* @private
*/
export declare class b2ContactSolver {
    constructor();
    private static s_worldManifold;
    Initialize(step: b2TimeStep, contacts: Array<b2Contact>, contactCount: number /** int */, allocator: any): void;
    InitVelocityConstraints(step: b2TimeStep): void;
    SolveVelocityConstraints(): void;
    FinalizeVelocityConstraints(): void;
    private static s_psm;
    SolvePositionConstraints(baumgarte: number): boolean;
    private m_step;
    private m_allocator;
    m_constraints: Array<b2ContactConstraint>;
    private m_constraintCount;
}
//# sourceMappingURL=b2ContactSolver.d.ts.map