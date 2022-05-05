import { b2Transform, b2Vec2 } from '../Math';
/**
* This describes the motion of a body/shape for TOI computation.
* Shapes are defined with respect to the body origin, which may
* no coincide with the center of mass. However, to support dynamics
* we must interpolate the center of mass position.
*/
export declare class b2Sweep {
    Set(other: b2Sweep): void;
    Copy(): b2Sweep;
    /**
    * Get the interpolated transform at a specific time.
    * @param alpha is a factor in [0,1], where 0 indicates t0.
    */
    GetTransform(xf: b2Transform, alpha: number): void;
    /**
    * Advance the sweep forward, yielding a new initial state.
    * @param t the new initial time.
    */
    Advance(t: number): void;
    /** Local center of mass position */
    localCenter: b2Vec2;
    /** Center world position */
    c0: b2Vec2;
    /** Center world position */
    c: b2Vec2;
    /** World angle */
    a0: number;
    /** World angle */
    a: number;
    /** Time interval = [t0,1], where t0 is in [0,1] */
    t0: number;
}
//# sourceMappingURL=b2Sweep.d.ts.map