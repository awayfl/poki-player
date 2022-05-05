import { b2Vec2 } from '../Common/Math/b2Vec2';
import { b2MassData } from '../Collision/Shapes/b2MassData';
export declare class b2BodyDef {
    __fast__: boolean;
    constructor();
    massData: b2MassData;
    userData: any;
    position: b2Vec2;
    angle: number;
    linearDamping: number;
    angularDamping: number;
    allowSleep: boolean;
    isSleeping: boolean;
    fixedRotation: boolean;
    isBullet: boolean;
}
//# sourceMappingURL=b2BodyDef.d.ts.map