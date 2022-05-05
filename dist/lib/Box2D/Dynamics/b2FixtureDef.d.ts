import { b2Shape } from '../Collision/Shapes/b2Shape';
import { b2FilterData } from './b2FilterData';
/**
 * A fixture definition is used to create a fixture. This class defines an
 * abstract fixture definition. You can reuse fixture definitions safely.
 */
export declare class b2FixtureDef {
    __fast__: boolean;
    /**
     * The constructor sets the default fixture definition values.
     */
    constructor();
    /**
     * The shape, this must be set. The shape will be cloned, so you
     * can create the shape on the stack.
     */
    shape: b2Shape;
    /**
     * Use this to store application specific fixture data.
     */
    userData: any;
    /**
     * The friction coefficient, usually in the range [0,1].
     */
    friction: number;
    /**
     * The restitution (elasticity) usually in the range [0,1].
     */
    restitution: number;
    /**
     * The density, usually in kg/m^2.
     */
    density: number;
    /**
     * A sensor shape collects contact information but never generates a collision
     * response.
     */
    isSensor: boolean;
    /**
     * Contact filtering data.
     */
    filter: b2FilterData;
}
//# sourceMappingURL=b2FixtureDef.d.ts.map