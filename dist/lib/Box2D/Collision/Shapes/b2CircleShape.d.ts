import { b2Shape } from './b2Shape';
import { b2Transform, b2Vec2 } from '../../Common/Math';
import { b2RayCastOutput } from '../b2RayCastOutput';
import { b2RayCastInput } from '../b2RayCastInput';
import { b2AABB } from '../b2AABB';
import { b2MassData } from './b2MassData';
/**
* A circle shape.
* @see b2CircleDef
*/
export declare class b2CircleShape extends b2Shape {
    __fast__: boolean;
    Copy(): b2Shape;
    Set(other: b2Shape): void;
    /**
    * @inheritDoc
    */
    TestPoint(transform: b2Transform, p: b2Vec2): boolean;
    /**
    * @inheritDoc
    */
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform): boolean;
    /**
    * @inheritDoc
    */
    ComputeAABB(aabb: b2AABB, transform: b2Transform): void;
    /**
    * @inheritDoc
    */
    ComputeMass(massData: b2MassData, density: number): void;
    /**
    * @inheritDoc
    */
    ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
    /**
     * Get the local position of this circle in its parent body.
     */
    GetLocalPosition(): b2Vec2;
    /**
     * Set the local position of this circle in its parent body.
     */
    SetLocalPosition(position: b2Vec2): void;
    /**
     * Get the radius of the circle
     */
    GetRadius(): number;
    /**
     * Set the radius of the circle
     */
    SetRadius(radius: number): void;
    constructor(radius?: number);
    m_p: b2Vec2;
}
//# sourceMappingURL=b2CircleShape.d.ts.map