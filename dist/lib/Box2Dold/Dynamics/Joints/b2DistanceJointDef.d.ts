import { b2JointDef } from '../Joints';
import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math/b2Vec2';
export declare class b2DistanceJointDef extends b2JointDef {
    constructor();
    Initialize(b1: b2Body, b2: b2Body, anchor1: b2Vec2, anchor2: b2Vec2): void;
    localAnchor1: b2Vec2;
    localAnchor2: b2Vec2;
    length: number;
    frequencyHz: number;
    dampingRatio: number;
}
//# sourceMappingURL=b2DistanceJointDef.d.ts.map