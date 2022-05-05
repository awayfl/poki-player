import { b2Pair } from './b2Pair';
import { b2BufferedPair } from './b2BufferedPair';
import { b2BroadPhase } from './b2BroadPhase';
import { b2PairCallback } from './b2PairCallback';
export declare class b2PairManager {
    constructor();
    Initialize(broadPhase: b2BroadPhase, callback: b2PairCallback): void;
    AddBufferedPair(proxyId1: number /** int */, proxyId2: number /** int */): void;
    RemoveBufferedPair(proxyId1: number /** int */, proxyId2: number /** int */): void;
    Commit(): void;
    private AddPair;
    private RemovePair;
    private Find;
    private FindHash;
    private ValidateBuffer;
    private ValidateTable;
    m_broadPhase: b2BroadPhase;
    m_callback: b2PairCallback;
    m_pairs: b2Pair[];
    m_freePair: number /** uint */;
    m_pairCount: number /** int */;
    m_pairBuffer: b2BufferedPair[];
    m_pairBufferCount: number /** int */;
    m_hashTable: number[];
    static Hash(proxyId1: number /** uint */, proxyId2: number /** uint */): number /** uint */;
    static Equals(pair: b2Pair, proxyId1: number /** uint */, proxyId2: number /** uint */): boolean;
    static EqualsPair(pair1: b2BufferedPair, pair2: b2BufferedPair): boolean;
}
//# sourceMappingURL=b2PairManager.d.ts.map