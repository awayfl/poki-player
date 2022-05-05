import { b2JointDef } from '../Joints';
import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
export declare class b2PulleyJointDef extends b2JointDef {
    constructor();
    Initialize(b1: b2Body, b2: b2Body, ga1: b2Vec2, ga2: b2Vec2, anchor1: b2Vec2, anchor2: b2Vec2, r: number): void;
    groundAnchor1: b2Vec2;
    groundAnchor2: b2Vec2;
    localAnchor1: b2Vec2;
    localAnchor2: b2Vec2;
    length1: number;
    maxLength1: number;
    length2: number;
    maxLength2: number;
    ratio: number;
}
//# sourceMappingURL=b2PulleyJointDef.d.ts.map