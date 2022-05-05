import { b2Mat22, b2Vec2 } from '../Common/Math';
/**
* An oriented bounding box.
*/
export declare class b2OBB {
    __fast__: boolean;
    /** The rotation matrix */
    R: b2Mat22;
    /** The local centroid */
    center: b2Vec2;
    /** The half-widths */
    extents: b2Vec2;
}
//# sourceMappingURL=b2OBB.d.ts.map