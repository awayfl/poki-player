import { alIsFunction, wrapAVM1NativeClass, AVM1Context, AVM1Object } from "@awayfl/avm1";
import { AudioManager } from "@awayjs/core";

declare var PokiSDK: any;

function isAdBlocked() {
	if(!AVM1PokiSDK.usePokiSDK){
		return true;
	}
	if (!PokiSDK || !PokiSDK.hasOwnProperty("adBlocked")) {
		throw ("AS2 is trying to use the PokiSDK before it has been init")
	}
	return PokiSDK.adBlocked;
}

export class AVM1PokiSDK extends AVM1Object {


	public static usePokiSDK:boolean = true;

	public static createAVM1Class(context: AVM1Context): AVM1Object {
		var wrapped = wrapAVM1NativeClass(context, true, AVM1PokiSDK,
			['init', 'isAdBlocked', 'gameLoadingStart', 'gameLoadingFinished', 'commercialBreak', 'gameplayStart', 'gameplayStop'], [],
			null, AVM1PokiSDK.prototype.avm1Constructor);
		return wrapped;
	}

	public avm1Constructor() {
	}

	public static init(context, myTarget, callbackName) {
		var callback = function (adsBlocked) { };
		if (myTarget != null && callbackName != null) {
			callback = function (adsBlocked) {
				var desc = myTarget.alGet(callbackName.toLowerCase());
				if (desc && alIsFunction(desc))
					desc.alCall(myTarget, [adsBlocked]);
				else if (desc && desc.value)
					desc.value.alCall(myTarget, [adsBlocked]);
			}
		};
		// poki sdk should already have been init before the game was loaded
		callback(isAdBlocked());
	}
	public static isAdBlocked() {
		return isAdBlocked();
	}

	public static gameLoadingStart() {
		if(isAdBlocked()){
			return;
		}
		PokiSDK.gameLoadingStart();
	}

	public static gameLoadingFinished() {
		if(isAdBlocked()){
			return;
		}
		PokiSDK.gameLoadingFinished();
	}
	public static gameplayStart() {
		if(isAdBlocked()){
			return;
		}
		PokiSDK.gameplayStart();
	}

	public static gameplayStop() {
		if(isAdBlocked()){
			return;
		}
		PokiSDK.gameplayStop();
	}


	public static commercialBreak(context, myTarget, callback) {
		
		var callback2 = function () { };
		if (myTarget != null && callback != null) {
			callback2 = function () {
				callback.alCall(myTarget);
			}
		};
		if(isAdBlocked()){
			callback2();
			return;
		}
		AudioManager.setVolume(0);
		PokiSDK.commercialBreak().then(
			() => {
				// commercialBreak finished
				AudioManager.setVolume(1);
				callback2();
			}
		);
	}
	public static happyTime(context, intensity) {
		if(isAdBlocked()){
			return;
		}
		PokiSDK.happyTime(intensity);
	}
}