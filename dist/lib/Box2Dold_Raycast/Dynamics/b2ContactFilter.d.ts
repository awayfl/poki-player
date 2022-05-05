import { b2Shape } from '../Collision/Shapes/b2Shape';
export declare class b2ContactFilter {
    ShouldCollide(shape1: b2Shape, shape2: b2Shape): boolean;
    RayCollide(userData: any, shape: b2Shape): Boolean;
    static b2_defaultFilter: b2ContactFilter;
}
//# sourceMappingURL=b2ContactFilter.d.ts.map