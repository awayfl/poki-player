//===============================
// Poki Publishing Wrapper for Flash
// Beta version - Copyright Poki 2018
// ==============================

package com.poki {

	import flash.display.MovieClip;
	import flash.external.ExternalInterface;
	import flash.text.TextField;
	import flash.utils.Dictionary;
	import flash.display.LoaderInfo;

	public class PokiFlashSDK extends MovieClip {

		private static var _instance:PokiFlashSDK=null;
		public static function instance():PokiFlashSDK{
			if(!PokiFlashSDK._instance){
				PokiFlashSDK._instance=new PokiFlashSDK();
			}
			return PokiFlashSDK._instance;
		}

		public function PokiFlashSDK(): void {}

		public var _stage: MovieClip;

		private var initialized: Boolean = false;
		private var adBlocked: Boolean = false;

		//debug vars (flashvars)
		public var debug: Boolean = false;
		private var consoleLogPrefix: String = "Poki Flash SDK V 1.1 : ";
		public var visualDebugText: TextField;

		public var callBackCommercialBreak:Function;
		public var callBackRewardedBreak:Function;
		public var clearKeys:Function;

		public function Init(_stageRef: MovieClip): void {

			_stage = _stageRef;
			
			//if (LoaderInfo(_stage.root.loaderInfo).parameters.debug === "true") debug = true;

			consoleLog("beginning initialization");

			if (initialized) {
				consoleError("SDK is already initialized!");

				return;
			}

			if (ExternalInterface.available) {
				consoleLog("found ExternalInterface, calling initPokiBridge");

				ExternalInterface.addCallback("Ready", Ready);
				ExternalInterface.addCallback("AdBlocked", AdBlocked);
				ExternalInterface.addCallback("commercialBreakCompleted", commercialBreakCompleted);
				ExternalInterface.addCallback("rewardedBreakCompleted", rewardedBreakCompleted);
				ExternalInterface.call("window.initPokiBridge", ExternalInterface.objectID);

			} else {
				consoleError("SDK has not been initialized!");
			}
		}



		public function gameInteractive() {
			consoleLog("gameInteractive()");

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			ExternalInterface.call("eval","PokiSDK.gameInteractive();");
		}

		public function gameplayStart() {
			consoleLog("gameplayStart()");

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			ExternalInterface.call("eval","PokiSDK.gameplayStart();");
		}

		public function gameplayStop() {
			consoleLog("gameplayStop()");

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			ExternalInterface.call("eval","PokiSDK.gameplayStop();");
		}

		public function commercialBreak() {
			consoleLog("commercialBreak()");

			if (adBlocked) {
				consoleError("AdBlocker detected, can't request ad");
			}

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			if(clearKeys!=null){
				clearKeys();
			}
			ExternalInterface.call("eval","window.commercialBreak();");
		}

		public function rewardedBreak(){
			consoleLog("rewardedBreak()");

			if (adBlocked) {
				consoleError("AdBlocker detected, can't request ad");
			}

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			if(clearKeys!=null){
				clearKeys();
			}
			ExternalInterface.call("eval","window.rewardedBreak();");
		}

		public function happyTime(intensity:int){
			consoleLog("happyTime("+intensity.toString()+")");

			if (adBlocked) {
				consoleError("AdBlocker detected, can't request ad");
			}

			if (!initialized) {
				consoleError("SDK not yet initialized, make sure you call PokiSDK.Init(this) before attempting to request an ad");
			}
			ExternalInterface.call("eval","window.rewardedBreak("+intensity.toString()+");");
		}

		public function isTablet(){
			ExternalInterface.call("eval","window.isTablet();");
		}

		public function isMobile(){
			ExternalInterface.call("eval","window.isMobile();");
		}

		public function isDesktop(){
			ExternalInterface.call("eval","window.isDesktop();");
		}

		// ============================================================================
		// Below methods are called from the Javavascript SDK and should not be touched
		// ============================================================================


		public function Ready(): void {

			initialized = true;

			consoleLog("bridge succesfully created!");
		}

		public function AdBlocked(): void {
			adBlocked = true;
		}
		public function commercialBreakCompleted(): void{
			consoleLog("commercialBreak Completed!");
			if(callBackCommercialBreak !== null) callBackCommercialBreak();
		}
		public function rewardedBreakCompleted(withReward:Boolean): void{
			consoleLog("rewardedBreak Completed! "+withReward.toString());
			if(callBackRewardedBreak !== null) callBackRewardedBreak(withReward);
		}

		// HELPER FUNCTION
		private function consoleLog(s:String):void{
			var m:String = consoleLogPrefix+s

			if(debug == true){

				trace(m);
				ExternalInterface.call("console.log", m);

				/*if(visualDebugText == null){
						visualDebugText = new TextField();
						visualDebugText.width = _stage.stage.stageWidth;
						_stage.addChild(visualDebugText);
				}

				visualDebugText.text = m;*/
			}
		}
		private function consoleError(s:String):void{
			var m:String = consoleLogPrefix+"Error:"+s;

			if(debug == true){

					trace(m);
					ExternalInterface.call("console.error", m);

					if(visualDebugText == null){
							visualDebugText = new TextField();
							visualDebugText.width = _stage.stage.stageWidth;
							_stage.addChild(visualDebugText);
					}

					visualDebugText.text = m;
			}
		}
	}
}
