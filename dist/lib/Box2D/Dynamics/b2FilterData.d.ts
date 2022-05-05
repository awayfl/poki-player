/**
* This holds contact filtering data.
*/
export declare class b2FilterData {
    __fast__: boolean;
    Copy(): b2FilterData;
    /**
    * The collision category bits. Normally you would just set one bit.
    */
    categoryBits: number /** uint */;
    /**
    * The collision mask bits. This states the categories that this
    * shape would accept for collision.
    */
    maskBits: number /** uint */;
    /**
    * Collision groups allow a certain group of objects to never collide (negative)
    * or always collide (positive). Zero means no collision group. Non-zero group
    * filtering always wins against the mask bits.
    */
    groupIndex: number /** int */;
}
//# sourceMappingURL=b2FilterData.d.ts.map