import { AVMStage } from '@awayfl/swf-loader';
// not needed (?)
//declare var POKI_ADS: any;
//declare var POKI_TRACKER: any;
var AVM2PokiSDK = /** @class */ (function () {
    function AVM2PokiSDK(usePokiSDK) {
        // not needed (?)
        //var eventNames = ['adblocked', 'completed', 'error', 'impression', 'limit', 'ready', 'requested', 'skipped', 'started', 'update'];
        window.initPokiBridge = function (gameObjectName) {
            flash.Ready();
            if (!usePokiSDK || window.pokiAdBlock)
                flash.AdBlocked();
            window.commercialBreak = function () {
                if (!usePokiSDK) {
                    flash.commercialBreakCompleted();
                    return;
                }
                AVMStage.instance().pause();
                PokiSDK.commercialBreak().then(function () {
                    AVMStage.instance().unPause();
                    flash.commercialBreakCompleted();
                });
            };
            window.rewardedBreak = function () {
                if (!usePokiSDK) {
                    flash.rewardedBreakCompleted(true);
                    return;
                }
                AVMStage.instance().pause();
                PokiSDK.rewardedBreak().then(function (withReward) {
                    AVMStage.instance().unPause();
                    flash.rewardedBreakCompleted(withReward);
                });
            };
        };
        /*
        // not needed (?)
        window.pokiRequestAd = function (position) {
            POKI_ADS.requestAd({
                position: position
            });
        };
        
        window.pokiTrack = function (event) {
            POKI_TRACKER.track(event);
        };
        */
    }
    return AVM2PokiSDK;
}());
export { AVM2PokiSDK };
