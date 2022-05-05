import { b2Vec2 } from '../../Common/Math';
/**
* This holds the mass data computed for a shape.
*/
export declare class b2MassData {
    /**
    * The mass of the shape, usually in kilograms.
    */
    mass: number;
    /**
    * The position of the shape's centroid relative to the shape's origin.
    */
    center: b2Vec2;
    /**
    * The rotational inertia of the shape.
    * This may be about the center or local origin, depending on usage.
    */
    I: number;
}
//# sourceMappingURL=b2MassData.d.ts.map