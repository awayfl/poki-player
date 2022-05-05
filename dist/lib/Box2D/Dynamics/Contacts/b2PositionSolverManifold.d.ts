import { b2Vec2 } from '../../Common/Math';
import { b2ContactConstraint } from '../Contacts';
export declare class b2PositionSolverManifold {
    constructor();
    private static circlePointA;
    private static circlePointB;
    Initialize(cc: b2ContactConstraint): void;
    m_normal: b2Vec2;
    m_points: Array<b2Vec2>;
    m_separations: Array<number>;
}
//# sourceMappingURL=b2PositionSolverManifold.d.ts.map