import { b2DynamicTreePair } from './b2DynamicTreePair';
import { b2DynamicTree } from './b2DynamicTree';
/**
 * The broad-phase is used for computing pairs and performing volume queries and ray casts.
 * This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
 * It is up to the client to consume the new pairs and to track subsequent overlap.
 */
var b2DynamicTreeBroadPhase = /** @class */ (function () {
    function b2DynamicTreeBroadPhase() {
        this.m_tree = new b2DynamicTree();
        this.m_moveBuffer = new Array();
        this.m_pairBuffer = new Array();
        this.m_pairCount = 0;
    }
    /**
     * Create a proxy with an initial AABB. Pairs are not reported until
     * UpdatePairs is called.
     */
    b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
        var proxy = this.m_tree.CreateProxy(aabb, userData);
        ++this.m_proxyCount;
        this.BufferMove(proxy);
        return proxy;
    };
    /**
     * Destroy a proxy. It is up to the client to remove any pairs.
     */
    b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
        this.UnBufferMove(proxy);
        --this.m_proxyCount;
        this.m_tree.DestroyProxy(proxy);
    };
    /**
     * Call MoveProxy as many times as you like, then when you are done
     * call UpdatePairs to finalized the proxy pairs (for your time step).
     */
    b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
        var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
        if (buffer) {
            this.BufferMove(proxy);
        }
    };
    b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
        var aabbA = this.m_tree.GetFatAABB(proxyA);
        var aabbB = this.m_tree.GetFatAABB(proxyB);
        return aabbA.TestOverlap(aabbB);
    };
    /**
     * Get user data from a proxy. Returns null if the proxy is invalid.
     */
    b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
        return this.m_tree.GetUserData(proxy);
    };
    /**
     * Get the AABB for a proxy.
     */
    b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
        return this.m_tree.GetFatAABB(proxy);
    };
    /**
     * Get the number of proxies.
     */
    b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
        return this.m_proxyCount;
    };
    /**
     * Update the pairs. This results in pair callbacks. This can only add pairs.
     */
    b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
        var _this = this;
        this.m_pairCount = 0;
        // Perform tree queries for all moving queries
        for (var _i = 0, _a = this.m_moveBuffer; _i < _a.length; _i++) {
            var queryProxy = _a[_i];
            var QueryCallback = function (proxy) {
                // A proxy cannot form a pair with itself.
                if (proxy == queryProxy)
                    return true;
                // Grow the pair buffer as needed
                if (_this.m_pairCount == _this.m_pairBuffer.length) {
                    _this.m_pairBuffer[_this.m_pairCount] = new b2DynamicTreePair();
                }
                var pair = _this.m_pairBuffer[_this.m_pairCount];
                pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
                pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;
                ++_this.m_pairCount;
                return true;
            };
            // We have to query the tree with the fat AABB so that
            // we don't fail to create a pair that may touch later.
            var fatAABB = this.m_tree.GetFatAABB(queryProxy);
            this.m_tree.Query(QueryCallback, fatAABB);
        }
        // Reset move buffer
        this.m_moveBuffer.length = 0;
        // Sort the pair buffer to expose duplicates.
        // TODO: Something more sensible
        //m_pairBuffer.sort(ComparePairs);
        // Send the pair buffer
        for (var i = 0; i < this.m_pairCount;) {
            var primaryPair = this.m_pairBuffer[i];
            var userDataA = this.m_tree.GetUserData(primaryPair.proxyA);
            var userDataB = this.m_tree.GetUserData(primaryPair.proxyB);
            callback(userDataA, userDataB);
            ++i;
            // Skip any duplicate pairs
            while (i < this.m_pairCount) {
                var pair = this.m_pairBuffer[i];
                if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB) {
                    break;
                }
                ++i;
            }
        }
    };
    /**
     * @inheritDoc
     */
    b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
        this.m_tree.Query(callback, aabb);
    };
    /**
     * @inheritDoc
     */
    b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
        this.m_tree.RayCast(callback, input);
    };
    b2DynamicTreeBroadPhase.prototype.Validate = function () {
        //TODO_BORIS
    };
    b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations /**int */) {
        this.m_tree.Rebalance(iterations);
    };
    // Private ///////////////
    b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
        this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
    };
    b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
        var i = this.m_moveBuffer.indexOf(proxy);
        this.m_moveBuffer.splice(i, 1);
    };
    b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
        //TODO_BORIS:
        // We cannot consistently sort objects easily in AS3
        // The caller of this needs replacing with a different method.
        return 0;
    };
    return b2DynamicTreeBroadPhase;
}());
export { b2DynamicTreeBroadPhase };
