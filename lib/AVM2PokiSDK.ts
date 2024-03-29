
import { AudioManager } from '@awayjs/core';
import { AVMStage } from '@awayfl/swf-loader';

declare var window: any;
declare var flash: any;
declare var PokiSDK: any;

// not needed (?)
//declare var POKI_ADS: any;
//declare var POKI_TRACKER: any;

export class AVM2PokiSDK {
	constructor(usePokiSDK:boolean) {
		
		// not needed (?)
		//var eventNames = ['adblocked', 'completed', 'error', 'impression', 'limit', 'ready', 'requested', 'skipped', 'started', 'update'];
		
		window.initPokiBridge = function (gameObjectName) {

			flash.Ready();
			if (!usePokiSDK || window.pokiAdBlock) flash.AdBlocked();
			

			window.commercialBreak = () => {
				if(!usePokiSDK){
					flash.commercialBreakCompleted();
					return;
				}
				AVMStage.instance().pause();
				PokiSDK.commercialBreak().then(() => {
					AVMStage.instance().unPause();
					flash.commercialBreakCompleted();
				});
			};
			window.rewardedBreak = () => {
				if(!usePokiSDK){
					flash.rewardedBreakCompleted(true);
					return;
				}
				AVMStage.instance().pause();
				PokiSDK.rewardedBreak().then(withReward => {
					AVMStage.instance().unPause();
					flash.rewardedBreakCompleted(withReward);
				});
			};

			window.isTablet = function () {
                return /(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i.test(navigator.userAgent);
            };
            window.isMobile = function () {
                return /(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera\smini|avantgo|mobilesafari|docomo)/i.test(navigator.userAgent);
            };
            window.isDesktop = function () {
                return !window.isTablet() && !window.isMobile();
            }
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
}
