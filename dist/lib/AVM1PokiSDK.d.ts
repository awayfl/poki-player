import { AVM1Context, AVM1Object } from "@awayfl/avm1";
export declare class AVM1PokiSDK extends AVM1Object {
    static usePokiSDK: boolean;
    static createAVM1Class(context: AVM1Context): AVM1Object;
    avm1Constructor(): void;
    static init(context: any, myTarget: any, callbackName: any): void;
    static isAdBlocked(): any;
    static gameLoadingStart(): void;
    static gameLoadingFinished(): void;
    static gameplayStart(): void;
    static gameplayStop(): void;
    static commercialBreak(context: any, myTarget: any, callback: any): void;
    static happyTime(context: any, intensity: any): void;
}
//# sourceMappingURL=AVM1PokiSDK.d.ts.map