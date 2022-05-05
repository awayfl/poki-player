import { b2ContactID } from './b2ContactID';
/**
* We use contact ids to facilitate warm starting.
*/
export declare class Features {
    readonly __fast__ = true;
    /**
    * The edge that defines the outward contact normal.
    */
    get referenceEdge(): number /** int */;
    set referenceEdge(value: number /** int */);
    _referenceEdge: number /** int */;
    /**
    * The edge most anti-parallel to the reference edge.
    */
    get incidentEdge(): number /** int */;
    set incidentEdge(value: number /** int */);
    _incidentEdge: number /** int */;
    /**
    * The vertex (0 or 1) on the incident edge that was clipped.
    */
    get incidentVertex(): number /** int */;
    set incidentVertex(value: number /** int */);
    _incidentVertex: number /** int */;
    /**
    * A value of 1 indicates that the reference edge is on shape2.
    */
    get flip(): number /** int */;
    set flip(value: number /** int */);
    _flip: number /** int */;
    _m_id: b2ContactID;
}
//# sourceMappingURL=Features.d.ts.map