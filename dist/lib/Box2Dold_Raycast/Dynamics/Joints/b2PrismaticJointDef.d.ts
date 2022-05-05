import { b2JointDef } from '../Joints';
import { b2Body } from '../b2Body';
import { b2Vec2 } from '../../Common/Math';
export declare class b2PrismaticJointDef extends b2JointDef {
    constructor();
    Initialize(b1: b2Body, b2: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    localAnchor1: b2Vec2;
    localAnchor2: b2Vec2;
    localAxis1: b2Vec2;
    referenceAngle: number;
    enableLimit: boolean;
    lowerTranslation: number;
    upperTranslation: number;
    enableMotor: boolean;
    maxMotorForce: number;
    motorSpeed: number;
}
//# sourceMappingURL=b2PrismaticJointDef.d.ts.map