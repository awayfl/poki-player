import { __extends } from "tslib";
import { alIsFunction, wrapAVM1NativeClass, AVM1Object } from "@awayfl/avm1";
import { AudioManager } from "@awayjs/core";
function isAdBlocked() {
    if (!AVM1PokiSDK.usePokiSDK) {
        return true;
    }
    if (!PokiSDK || !PokiSDK.hasOwnProperty("adBlocked")) {
        throw ("AS2 is trying to use the PokiSDK before it has been init");
    }
    return PokiSDK.adBlocked;
}
var AVM1PokiSDK = /** @class */ (function (_super) {
    __extends(AVM1PokiSDK, _super);
    function AVM1PokiSDK() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AVM1PokiSDK.createAVM1Class = function (context) {
        var wrapped = wrapAVM1NativeClass(context, true, AVM1PokiSDK, ['init', 'isAdBlocked', 'gameLoadingStart', 'gameLoadingFinished', 'commercialBreak', 'gameplayStart', 'gameplayStop'], [], null, AVM1PokiSDK.prototype.avm1Constructor);
        return wrapped;
    };
    AVM1PokiSDK.prototype.avm1Constructor = function () {
    };
    AVM1PokiSDK.init = function (context, myTarget, callbackName) {
        var callback = function (adsBlocked) { };
        if (myTarget != null && callbackName != null) {
            callback = function (adsBlocked) {
                var desc = myTarget.alGet(callbackName.toLowerCase());
                if (desc && alIsFunction(desc))
                    desc.alCall(myTarget, [adsBlocked]);
                else if (desc && desc.value)
                    desc.value.alCall(myTarget, [adsBlocked]);
            };
        }
        ;
        // poki sdk should already have been init before the game was loaded
        callback(isAdBlocked());
    };
    AVM1PokiSDK.isAdBlocked = function () {
        return isAdBlocked();
    };
    AVM1PokiSDK.gameLoadingStart = function () {
        if (isAdBlocked()) {
            return;
        }
        PokiSDK.gameLoadingStart();
    };
    AVM1PokiSDK.gameLoadingFinished = function () {
        if (isAdBlocked()) {
            return;
        }
        PokiSDK.gameLoadingFinished();
    };
    AVM1PokiSDK.gameplayStart = function () {
        if (isAdBlocked()) {
            return;
        }
        PokiSDK.gameplayStart();
    };
    AVM1PokiSDK.gameplayStop = function () {
        if (isAdBlocked()) {
            return;
        }
        PokiSDK.gameplayStop();
    };
    AVM1PokiSDK.commercialBreak = function (context, myTarget, callback) {
        var callback2 = function () { };
        if (myTarget != null && callback != null) {
            callback2 = function () {
                callback.alCall(myTarget);
            };
        }
        ;
        if (isAdBlocked()) {
            callback2();
            return;
        }
        AudioManager.setVolume(0);
        PokiSDK.commercialBreak().then(function () {
            // commercialBreak finished
            AudioManager.setVolume(1);
            callback2();
        });
    };
    AVM1PokiSDK.happyTime = function (context, intensity) {
        if (isAdBlocked()) {
            return;
        }
        PokiSDK.happyTime(intensity);
    };
    AVM1PokiSDK.usePokiSDK = true;
    return AVM1PokiSDK;
}(AVM1Object));
export { AVM1PokiSDK };
