/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
import { b2Settings } from '../Common/b2Settings';
import { b2Pair } from './b2Pair';
import { b2BufferedPair } from './b2BufferedPair';
import { b2BroadPhase } from './b2BroadPhase';
// The pair manager is used by the broad-phase to quickly add/remove/find pairs
// of overlapping proxies. It is based closely on code provided by Pierre Terdiman.
// http://www.codercorner.com/IncrementalSAP.txt
var b2PairManager = /** @class */ (function () {
    //public:
    function b2PairManager() {
        this.m_freePair = 0;
        var i /** uint */;
        //b2Settings.b2Assert(b2Math.b2IsPowerOfTwo(b2Pair.b2_tableCapacity) == true);
        //b2Settings.b2Assert(b2Pair.b2_tableCapacity >= b2Settings.b2_maxPairs);
        this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
        for (i = 0; i < b2Pair.b2_tableCapacity; ++i) {
            this.m_hashTable[i] = b2Pair.b2_nullPair;
        }
        this.m_pairs = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i] = new b2Pair();
        }
        this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairBuffer[i] = new b2BufferedPair();
        }
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
            this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
            this.m_pairs[i].userData = null;
            this.m_pairs[i].status = 0;
            this.m_pairs[i].next = (i + 1);
        }
        this.m_pairs[b2Settings.b2_maxPairs - 1].next = b2Pair.b2_nullPair;
        this.m_pairCount = 0;
        this.m_pairBufferCount = 0;
    }
    //~b2PairManager();
    b2PairManager.prototype.Initialize = function (broadPhase, callback) {
        this.m_broadPhase = broadPhase;
        this.m_callback = callback;
    };
    /*
    As proxies are created and moved, many pairs are created and destroyed. Even worse, the same
    pair may be added and removed multiple times in a single time step of the physics engine. To reduce
    traffic in the pair manager, we try to avoid destroying pairs in the pair manager until the
    end of the physics step. This is done by buffering all the RemovePair requests. AddPair
    requests are processed immediately because we need the hash table entry for quick lookup.

    All user user callbacks are delayed until the buffered pairs are confirmed in Commit.
    This is very important because the user callbacks may be very expensive and client logic
    may be harmed if pairs are added and removed within the same time step.

    Buffer a pair for addition.
    We may add a pair that is not in the pair manager or pair buffer.
    We may add a pair that is already in the pair manager and pair buffer.
    If the added pair is not a new pair, then it must be in the pair buffer (because RemovePair was called).
    */
    b2PairManager.prototype.AddBufferedPair = function (proxyId1 /** int */, proxyId2 /** int */) {
        var bufferedPair;
        //b2Settings.b2Assert(id1 != b2_nullProxy && id2 != b2_nullProxy);
        //b2Settings.b2Assert(this.m_pairBufferCount < b2_maxPairs);
        var pair = this.AddPair(proxyId1, proxyId2);
        // If this pair is not in the pair buffer ...
        if (pair.IsBuffered() == false) {
            // This must be a newly added pair.
            //b2Settings.b2Assert(pair.IsFinal() == false);
            // Add it to the pair buffer.
            pair.SetBuffered();
            bufferedPair = this.m_pairBuffer[this.m_pairBufferCount];
            bufferedPair.proxyId1 = pair.proxyId1;
            bufferedPair.proxyId2 = pair.proxyId2;
            ++this.m_pairBufferCount;
            //b2Settings.b2Assert(this.m_pairBufferCount <= this.m_pairCount);
        }
        // Confirm this pair for the subsequent call to Commit.
        pair.ClearRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    };
    // Buffer a pair for removal.
    b2PairManager.prototype.RemoveBufferedPair = function (proxyId1 /** int */, proxyId2 /** int */) {
        var bufferedPair;
        //b2Settings.b2Assert(id1 != b2_nullProxy && id2 != b2_nullProxy);
        //b2Settings.b2Assert(this.m_pairBufferCount < b2_maxPairs);
        var pair = this.Find(proxyId1, proxyId2);
        if (pair == null) {
            // The pair never existed. This is legal (due to collision filtering).
            return;
        }
        // If this pair is not in the pair buffer ...
        if (pair.IsBuffered() == false) {
            // This must be an old pair.
            //b2Settings.b2Assert(pair.IsFinal() == true);
            pair.SetBuffered();
            bufferedPair = this.m_pairBuffer[this.m_pairBufferCount];
            bufferedPair.proxyId1 = pair.proxyId1;
            bufferedPair.proxyId2 = pair.proxyId2;
            ++this.m_pairBufferCount;
            //b2Settings.b2Assert(this.m_pairBufferCount <= this.m_pairCount);
        }
        pair.SetRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    };
    b2PairManager.prototype.Commit = function () {
        var bufferedPair;
        var i /** int */;
        var removeCount = 0;
        var proxies = this.m_broadPhase.m_proxyPool;
        for (i = 0; i < this.m_pairBufferCount; ++i) {
            bufferedPair = this.m_pairBuffer[i];
            var pair = this.Find(bufferedPair.proxyId1, bufferedPair.proxyId2);
            //b2Settings.b2Assert(pair.IsBuffered());
            pair.ClearBuffered();
            //b2Settings.b2Assert(pair.proxyId1 < b2Settings.b2_maxProxies && pair.proxyId2 < b2Settings.b2_maxProxies);
            var proxy1 = proxies[pair.proxyId1];
            var proxy2 = proxies[pair.proxyId2];
            //b2Settings.b2Assert(proxy1.IsValid());
            //b2Settings.b2Assert(proxy2.IsValid());
            if (pair.IsRemoved()) {
                // It is possible a pair was added then removed before a commit. Therefore,
                // we should be careful not to tell the user the pair was removed when the
                // the user didn't receive a matching add.
                if (pair.IsFinal() == true) {
                    this.m_callback.PairRemoved(proxy1.userData, proxy2.userData, pair.userData);
                }
                // Store the ids so we can actually remove the pair below.
                bufferedPair = this.m_pairBuffer[removeCount];
                bufferedPair.proxyId1 = pair.proxyId1;
                bufferedPair.proxyId2 = pair.proxyId2;
                ++removeCount;
            }
            else {
                //b2Settings.b2Assert(this.m_broadPhase.TestOverlap(proxy1, proxy2) == true);
                if (pair.IsFinal() == false) {
                    pair.userData = this.m_callback.PairAdded(proxy1.userData, proxy2.userData);
                    pair.SetFinal();
                }
            }
        }
        for (i = 0; i < removeCount; ++i) {
            bufferedPair = this.m_pairBuffer[i];
            this.RemovePair(bufferedPair.proxyId1, bufferedPair.proxyId2);
        }
        this.m_pairBufferCount = 0;
        if (b2BroadPhase.s_validate) {
            this.ValidateTable();
        }
    };
    //private:
    // Add a pair and return the new pair. If the pair already exists,
    // no new pair is created and the old one is returned.
    b2PairManager.prototype.AddPair = function (proxyId1 /** uint */, proxyId2 /** uint */) {
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
            //b2Math.b2Swap(p1, p2);
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        //var pairIndex:number /** int */ = FindHash(proxyId1, proxyId2, hash);
        var pair = pair = this.FindHash(proxyId1, proxyId2, hash);
        if (pair != null) {
            return pair;
        }
        //b2Settings.b2Assert(this.m_pairCount < b2Settings.b2_maxPairs && this.m_freePair != b2_nullPair);
        var pIndex = this.m_freePair;
        pair = this.m_pairs[pIndex];
        this.m_freePair = pair.next;
        pair.proxyId1 = proxyId1;
        pair.proxyId2 = proxyId2;
        pair.status = 0;
        pair.userData = null;
        pair.next = this.m_hashTable[hash];
        this.m_hashTable[hash] = pIndex;
        ++this.m_pairCount;
        return pair;
    };
    // Remove a pair, return the pair's userData.
    b2PairManager.prototype.RemovePair = function (proxyId1 /** uint */, proxyId2 /** uint */) {
        var pair;
        //b2Settings.b2Assert(this.m_pairCount > 0);
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
            //b2Math.b2Swap(proxyId1, proxyId2);
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        var node = this.m_hashTable[hash];
        var pNode = null;
        while (node != b2Pair.b2_nullPair) {
            if (b2PairManager.Equals(this.m_pairs[node], proxyId1, proxyId2)) {
                var index = node;
                //*node = this.m_pairs[*node].next;
                pair = this.m_pairs[node];
                if (pNode) {
                    pNode.next = pair.next;
                }
                else {
                    this.m_hashTable[hash] = pair.next;
                }
                pair = this.m_pairs[index];
                var userData = pair.userData;
                // Scrub
                pair.next = this.m_freePair;
                pair.proxyId1 = b2Pair.b2_nullProxy;
                pair.proxyId2 = b2Pair.b2_nullProxy;
                pair.userData = null;
                pair.status = 0;
                this.m_freePair = index;
                --this.m_pairCount;
                return userData;
            }
            else {
                //node = &this.m_pairs[*node].next;
                pNode = this.m_pairs[node];
                node = pNode.next;
            }
        }
        //b2Settings.b2Assert(false);
        return null;
    };
    b2PairManager.prototype.Find = function (proxyId1 /** uint */, proxyId2 /** uint */) {
        if (proxyId1 > proxyId2) {
            var temp = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
            //b2Math.b2Swap(proxyId1, proxyId2);
        }
        var hash = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;
        return this.FindHash(proxyId1, proxyId2, hash);
    };
    b2PairManager.prototype.FindHash = function (proxyId1 /** uint */, proxyId2 /** uint */, hash /** uint */) {
        var pair;
        var index = this.m_hashTable[hash];
        pair = this.m_pairs[index];
        while (index != b2Pair.b2_nullPair && b2PairManager.Equals(pair, proxyId1, proxyId2) == false) {
            index = pair.next;
            pair = this.m_pairs[index];
        }
        if (index == b2Pair.b2_nullPair) {
            return null;
        }
        //b2Settings.b2Assert(index < b2_maxPairs);
        return pair;
    };
    b2PairManager.prototype.ValidateBuffer = function () {
        // DEBUG
    };
    b2PairManager.prototype.ValidateTable = function () {
        // DEBUG
    };
    // static
    // Thomas Wang's hash, see: http://www.concentric.net/~Ttwang/tech/inthash.htm
    b2PairManager.Hash = function (proxyId1 /** uint */, proxyId2 /** uint */) {
        var key = ((proxyId2 << 16) & 0xffff0000) | proxyId1;
        key = ~key + ((key << 15) & 0xFFFF8000);
        key = key ^ ((key >> 12) & 0x000fffff);
        key = key + ((key << 2) & 0xFFFFFFFC);
        key = key ^ ((key >> 4) & 0x0fffffff);
        key = key * 2057;
        key = key ^ ((key >> 16) & 0x0000ffff);
        return key;
    };
    b2PairManager.Equals = function (pair, proxyId1 /** uint */, proxyId2 /** uint */) {
        return (pair.proxyId1 == proxyId1 && pair.proxyId2 == proxyId2);
    };
    b2PairManager.EqualsPair = function (pair1, pair2) {
        return pair1.proxyId1 == pair2.proxyId1 && pair1.proxyId2 == pair2.proxyId2;
    };
    return b2PairManager;
}());
export { b2PairManager };
