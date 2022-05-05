import { b2ShapeDef } from '../Collision/Shapes/b2ShapeDef';
import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2MassData } from '../Collision/Shapes/b2MassData';
import { b2XForm, b2Sweep, b2Vec2 } from '../Common/Math';
import { b2JointEdge } from './Joints';
import { b2ContactEdge } from './Contacts/b2ContactEdge';
import { b2BodyDef } from './b2BodyDef';
import { b2World } from './b2World';
export declare class b2Body {
    __fast__: boolean;
    CreateShape(def: b2ShapeDef): b2Shape;
    DestroyShape(s: b2Shape): void;
    SetMass(massData: b2MassData): void;
    private static s_massData;
    SetMassFromShapes(): void;
    SetXForm(position: b2Vec2, angle: number): boolean;
    GetXForm(): b2XForm;
    GetPosition(): b2Vec2;
    GetAngle(): number;
    GetWorldCenter(): b2Vec2;
    GetLocalCenter(): b2Vec2;
    SetLinearVelocity(v: b2Vec2): void;
    GetLinearVelocity(): b2Vec2;
    SetAngularVelocity(omega: number): void;
    GetAngularVelocity(): number;
    ApplyForce(force: b2Vec2, point: b2Vec2): void;
    ApplyTorque(torque: number): void;
    ApplyImpulse(impulse: b2Vec2, point: b2Vec2): void;
    GetMass(): number;
    GetInertia(): number;
    GetWorldPoint(localPoint: b2Vec2): b2Vec2;
    GetWorldVector(localVector: b2Vec2): b2Vec2;
    GetLocalPoint(worldPoint: b2Vec2): b2Vec2;
    GetLocalVector(worldVector: b2Vec2): b2Vec2;
    GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2): b2Vec2;
    GetLinearVelocityFromLocalPoint(localPoint: b2Vec2): b2Vec2;
    IsBullet(): boolean;
    SetBullet(flag: boolean): void;
    IsStatic(): boolean;
    IsDynamic(): boolean;
    IsFrozen(): boolean;
    IsSleeping(): boolean;
    AllowSleeping(flag: boolean): void;
    WakeUp(): void;
    PutToSleep(): void;
    GetShapeList(): b2Shape;
    GetJointList(): b2JointEdge;
    GetNext(): b2Body;
    GetUserData(): any;
    SetUserData(data: any): void;
    GetWorld(): b2World;
    constructor(bd: b2BodyDef, world: b2World);
    private static s_xf1;
    SynchronizeShapes(): boolean;
    SynchronizeTransform(): void;
    IsConnected(other: b2Body): boolean;
    Advance(t: number): void;
    m_flags: number /** uint */;
    m_type: number /** int */;
    m_xf: b2XForm;
    m_sweep: b2Sweep;
    m_linearVelocity: b2Vec2;
    m_angularVelocity: number;
    m_force: b2Vec2;
    m_torque: number;
    m_world: b2World;
    m_prev: b2Body;
    m_next: b2Body;
    m_shapeList: b2Shape;
    m_shapeCount: number /** int */;
    m_jointList: b2JointEdge;
    m_contactList: b2ContactEdge;
    m_mass: number;
    m_invMass: number;
    m_I: number;
    m_invI: number;
    m_linearDamping: number;
    m_angularDamping: number;
    m_sleepTime: number;
    m_userData: any;
    static e_frozenFlag: number /** uint */;
    static e_islandFlag: number /** uint */;
    static e_sleepFlag: number /** uint */;
    static e_allowSleepFlag: number /** uint */;
    static e_bulletFlag: number /** uint */;
    static e_fixedRotationFlag: number /** uint */;
    static e_staticType: number /** uint */;
    static e_dynamicType: number /** uint */;
    static e_maxTypes: number /** uint */;
}
//# sourceMappingURL=b2Body.d.ts.map