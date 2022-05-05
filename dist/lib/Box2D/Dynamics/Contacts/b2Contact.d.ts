import { b2Manifold } from '../../Collision/b2Manifold';
import { b2ContactEdge } from './b2ContactEdge';
import { b2Fixture } from '../b2Fixture';
import { b2Sweep } from '../../Common/Math';
import { b2ContactListener } from '../b2ContactListener';
import { b2WorldManifold } from '../../Collision/b2WorldManifold';
/**
* The class manages contact between two shapes. A contact exists for each overlapping
* AABB in the broad-phase (except if filtered). Therefore a contact object may exist
* that has no contact points.
*/
export declare class b2Contact {
    readonly __fast__ = true;
    /**
     * Get the contact manifold. Do not modify the manifold unless you understand the
     * internals of Box2D
     */
    GetManifold(): b2Manifold;
    /**
     * Get the world manifold
     */
    GetWorldManifold(worldManifold: b2WorldManifold): void;
    /**
     * Is this contact touching.
     */
    IsTouching(): boolean;
    /**
     * Does this contact generate TOI events for continuous simulation
     */
    IsContinuous(): boolean;
    /**
     * Change this to be a sensor or-non-sensor contact.
     */
    SetSensor(sensor: boolean): void;
    /**
     * Is this contact a sensor?
     */
    IsSensor(): boolean;
    /**
     * Enable/disable this contact. This can be used inside the pre-solve
     * contact listener. The contact is only disabled for the current
     * time step (or sub-step in continuous collision).
     */
    SetEnabled(flag: boolean): void;
    /**
     * Has this contact been disabled?
     * @return
     */
    IsEnabled(): boolean;
    /**
    * Get the next contact in the world's contact list.
    */
    GetNext(): b2Contact;
    /**
    * Get the first fixture in this contact.
    */
    GetFixtureA(): b2Fixture;
    /**
    * Get the second fixture in this contact.
    */
    GetFixtureB(): b2Fixture;
    /**
     * Flag this contact for filtering. Filtering will occur the next time step.
     */
    FlagForFiltering(): void;
    static e_sensorFlag: number /** uint */;
    static e_continuousFlag: number /** uint */;
    static e_islandFlag: number /** uint */;
    static e_toiFlag: number /** uint */;
    static e_touchingFlag: number /** uint */;
    static e_enabledFlag: number /** uint */;
    static e_filterFlag: number /** uint */;
    constructor();
    /** @private */
    Reset(fixtureA: b2Fixture, fixtureB: b2Fixture): void;
    Update(listener: b2ContactListener): void;
    Evaluate(): void;
    private static s_input;
    ComputeTOI(sweepA: b2Sweep, sweepB: b2Sweep): number;
    m_flags: number /** uint */;
    m_prev: b2Contact;
    m_next: b2Contact;
    m_nodeA: b2ContactEdge;
    m_nodeB: b2ContactEdge;
    m_fixtureA: b2Fixture;
    m_fixtureB: b2Fixture;
    m_manifold: b2Manifold;
    m_oldManifold: b2Manifold;
    m_toi: number;
}
//# sourceMappingURL=b2Contact.d.ts.map