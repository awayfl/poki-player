import { __extends } from "tslib";
import { ContextWebGLFlags } from "@awayjs/stage";
import { AVMPlayer } from "@awayfl/awayfl-player";
import { LoaderEvent } from "@awayjs/core";
import { globalRedirectRules } from "@awayfl/swf-loader";
import { AVMVERSION } from '@awayfl/swf-loader';
import { AVM1Globals } from '@awayfl/avm1';
import { extClasses } from '@awayfl/avm2';
import { AVM1PokiSDK } from './AVM1PokiSDK';
import { AVM2PokiSDK } from './AVM2PokiSDK';
import { AVM1ButtonCustom } from './AVM1ButtonCustom';
import { AVM1MovieClipCustom } from './AVM1MovieClipCustom';
import { AVMCrashReport } from './AVMCrashReport';
globalRedirectRules.push({
    test: /x.mochiads.com/,
    supressErrors: true,
}, {
    test: /AGI.swf/,
    resolve: "./assets/ads/AGI.swf",
}, {
    test: "http://cdn.nitrome.com/components/NitromeAPI.pkg",
    resolve: "./assets/NitromeAPI.pkg"
}, {
    test: /http:/,
    resolve: function (url) { return url.replace('http://', 'https://'); }
});
//AVMCrashReport.collectLogs = false;
AVMCrashReport.init();
var AVMPlayerPoki = /** @class */ (function (_super) {
    __extends(AVMPlayerPoki, _super);
    function AVMPlayerPoki(gameConfig) {
        var _this = _super.call(this, gameConfig) || this;
        AVMCrashReport.bind(_this);
        if (!gameConfig.files || !gameConfig.files.length) {
            throw ("AVMPlayerPoki: gameConfig.files must have positive length");
        }
        window["AVMPlayerPoki"] = _this;
        if (_this._gameConfig.showFPS) {
            _this.showFrameRate = true;
        }
        if (_this._gameConfig.redirects) {
            globalRedirectRules.push.apply(globalRedirectRules, _this._gameConfig.redirects);
        }
        if (_this._gameConfig.externalLib) {
            extClasses.lib = gameConfig.externalLib;
        }
        if (_this._gameConfig.multisample === false) {
            ContextWebGLFlags.PREF_MULTISAMPLE = false;
        }
        if (_this._gameConfig.useWebGL1) {
            ContextWebGLFlags.PREF_VERSION = 1;
        }
        _this.addEventListener(LoaderEvent.LOADER_COMPLETE, function (event) {
            if (!_this._gameConfig.start) {
                if (window["pokiGameParseComplete"])
                    window["pokiGameParseComplete"]();
                _this.play(gameConfig.skipFramesOfScene);
                return;
            }
            if (window["pokiGameParseComplete"])
                window["pokiGameParseComplete"](function () { return _this.play(gameConfig.skipFramesOfScene); });
        });
        // i don't know why, but when prevetn auto load from constructor then some aspp crushed
        // i think this is problem with LOADER_COMPLETE and AVM_COMPLETE callbacks ordering + PokiSDK
        if (!gameConfig.preventLoad) {
            _this.load();
        }
        return _this;
    }
    AVMPlayerPoki.prototype.onAVMAvailable = function (event) {
        if (event.avmVersion == AVMVERSION.AVM2) {
            //console.log("AVM2 has init");
            new AVM2PokiSDK(this._gameConfig.pokiSDK);
        }
        else if (event.avmVersion == AVMVERSION.AVM1) {
            //console.log("AVM1 has init");
            AVM1PokiSDK.usePokiSDK = this._gameConfig.pokiSDK;
            AVM1Globals.registerCustomClass("PokiSDK2", AVM1PokiSDK.createAVM1Class(this._avmHandler.factory.avm1Context));
            // custom hacks for PokiSDK on button click :
            // convert list of ids to object 
            if (this._gameConfig.retryButtonIDS) {
                this._gameConfig.retryButtonIDS = this._gameConfig.retryButtonIDS.reduce(function (acc, curr) {
                    acc[curr] = true;
                    return acc;
                }, {});
            }
            if (this._gameConfig.buttonPokiSDKActions ||
                this._gameConfig.retryButtonIDS ||
                this._gameConfig.retryButtonAction) {
                AVM1Globals.instance.Button = AVM1ButtonCustom.createAVM1Class(AVM1Globals.instance.context);
                if (this._gameConfig.buttonPokiSDKActions)
                    AVM1ButtonCustom.buttonPokiSDKActions = this._gameConfig.buttonPokiSDKActions;
                if (this._gameConfig.retryButtonIDS)
                    AVM1ButtonCustom.retryButtonIDS = this._gameConfig.retryButtonIDS;
                if (this._gameConfig.retryButtonAction)
                    AVM1ButtonCustom.retryButtonAction = this._gameConfig.retryButtonAction;
            }
            // custom hacks for PokiSDK on mc.stop or when mc encounters child with certain id click :
            if (this._gameConfig.actionOnStop ||
                this._gameConfig.retryButtonIDS ||
                this._gameConfig.actionWhenRetryButtonEncountered) {
                AVM1Globals.instance.MovieClip = AVM1MovieClipCustom.createAVM1Class(AVM1Globals.instance.context);
                if (this._gameConfig.actionOnStop)
                    AVM1MovieClipCustom.pokiSDKonStopAction = this._gameConfig.actionOnStop;
                if (this._gameConfig.retryButtonIDS)
                    AVM1MovieClipCustom.retryButtonIDS = this._gameConfig.retryButtonIDS;
                if (this._gameConfig.actionWhenRetryButtonEncountered)
                    AVM1MovieClipCustom.actionWhenRetryButtonEncountered = this._gameConfig.actionWhenRetryButtonEncountered;
            }
        }
        _super.prototype.onAVMAvailable.call(this, event);
    };
    return AVMPlayerPoki;
}(AVMPlayer));
export { AVMPlayerPoki };
