import { IBroadPhase } from './IBroadPhase';
import { b2AABB } from './b2AABB';
import { b2Vec2 } from '../Common/Math';
import { b2RayCastInput } from './b2RayCastInput';
/**
 * The broad-phase is used for computing pairs and performing volume queries and ray casts.
 * This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
 * It is up to the client to consume the new pairs and to track subsequent overlap.
 */
export declare class b2DynamicTreeBroadPhase implements IBroadPhase {
    /**
     * Create a proxy with an initial AABB. Pairs are not reported until
     * UpdatePairs is called.
     */
    CreateProxy(aabb: b2AABB, userData: any): any;
    /**
     * Destroy a proxy. It is up to the client to remove any pairs.
     */
    DestroyProxy(proxy: any): void;
    /**
     * Call MoveProxy as many times as you like, then when you are done
     * call UpdatePairs to finalized the proxy pairs (for your time step).
     */
    MoveProxy(proxy: any, aabb: b2AABB, displacement: b2Vec2): void;
    TestOverlap(proxyA: any, proxyB: any): boolean;
    /**
     * Get user data from a proxy. Returns null if the proxy is invalid.
     */
    GetUserData(proxy: any): any;
    /**
     * Get the AABB for a proxy.
     */
    GetFatAABB(proxy: any): b2AABB;
    /**
     * Get the number of proxies.
     */
    GetProxyCount(): number /**int */;
    /**
     * Update the pairs. This results in pair callbacks. This can only add pairs.
     */
    UpdatePairs(callback: Function): void;
    /**
     * @inheritDoc
     */
    Query(callback: Function, aabb: b2AABB): void;
    /**
     * @inheritDoc
     */
    RayCast(callback: Function, input: b2RayCastInput): void;
    Validate(): void;
    Rebalance(iterations: number /**int */): void;
    private BufferMove;
    private UnBufferMove;
    private ComparePairs;
    private m_tree;
    private m_proxyCount;
    private m_moveBuffer;
    private m_pairBuffer;
    private m_pairCount;
}
//# sourceMappingURL=b2DynamicTreeBroadPhase.d.ts.map