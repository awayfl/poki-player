import { __extends } from "tslib";
import { wrapAVM1NativeClass, AVM1Button } from "@awayfl/avm1";
import { AudioManager } from "@awayjs/core";
/**
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var AVM1ButtonCustom = /** @class */ (function (_super) {
    __extends(AVM1ButtonCustom, _super);
    function AVM1ButtonCustom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AVM1ButtonCustom.createAVM1Class = function (context) {
        return wrapAVM1NativeClass(context, true, AVM1ButtonCustom, [], ['$version#', '_alpha#', 'getAwayJSID', 'attachAudio', 'attachBitmap', 'attachMovie',
            'beginFill', 'beginBitmapFill', 'beginGradientFill', 'blendMode#',
            'cacheAsBitmap#', '_callFrame', 'clear', 'createEmptyMovieClip',
            'createTextField', '_currentframe#', 'curveTo', '_droptarget#',
            'duplicateMovieClip', 'enabled#', 'endFill', 'filters#', '_framesloaded#',
            '_focusrect#', 'forceSmoothing#', 'getBounds',
            'getBytesLoaded', 'getBytesTotal', 'getDepth', 'getInstanceAtDepth',
            'getNextHighestDepth', 'getRect', 'getSWFVersion', 'getTextSnapshot',
            'getURL', 'globalToLocal', 'gotoAndPlay', 'gotoAndStop', '_height#',
            '_highquality#', 'hitArea#', 'hitTest', 'lineGradientStyle', 'lineStyle',
            'lineTo', 'loadMovie', 'loadVariables', 'localToGlobal', '_lockroot#',
            'menu#', 'moveTo', '_name#', 'nextFrame', 'opaqueBackground#', '_parent#',
            'play', 'prevFrame', '_quality#', 'removeMovieClip', '_root#', '_rotation#',
            'scale9Grid#', 'scrollRect#', 'setMask', '_soundbuftime#', 'startDrag',
            'stop', 'stopDrag', 'swapDepths', 'tabChildren#', 'tabEnabled#', 'tabIndex#',
            '_target#', '_totalframes#', 'trackAsMenu#', 'toString',
            'unloadMovie', '_url#', 'useHandCursor#', '_visible#', '_width#',
            '_x#', '_xmouse#', '_xscale#', '_y#', '_ymouse#', '_yscale#']);
    };
    AVM1ButtonCustom.prototype._mouseEventHandler = function (type) {
        var _this = this;
        var actions = this._actions;
        var actionsLength = actions.length;
        for (var i = 0; i < actionsLength; i++) {
            var action = actions[i];
            if (action.stateTransitionFlags === type) {
                if (AVM1ButtonCustom.retryButtonIDS && AVM1ButtonCustom.retryButtonAction) {
                    if (AVM1ButtonCustom.retryButtonIDS[this.adaptee.symbolID]) {
                        AudioManager.setVolume(0);
                        AVM1ButtonCustom.retryButtonAction(function () {
                            AudioManager.setVolume(1);
                            _this._runAction(action);
                        });
                        return;
                    }
                }
                /*
                if(AVM1ButtonCustom.buttonPokiSDKActionsForText){
                    for (var key in AVM1ButtonCustom.buttonPokiSDKActionsForText){
                        var hasText=this.findChildWithText(this.adaptee, key);
                        if(hasText){
                            AVM1ButtonCustom.buttonPokiSDKActionsForText[key]();
                        }
                    }
                }*/
                //console.log("press button", (<MovieClip>this.adaptee.parent).symbolID, this.adaptee.symbolID)
                if (AVM1ButtonCustom.buttonPokiSDKActions[this.adaptee.name]) {
                    //console.log("button has poki sdk action");
                    AudioManager.setVolume(0);
                    AVM1ButtonCustom.buttonPokiSDKActions[this.adaptee.name](function () {
                        AudioManager.setVolume(1);
                        _this._runAction(action);
                    });
                }
                else if (AVM1ButtonCustom.buttonPokiSDKActions["all"]) {
                    //console.log("button has poki sdk action");
                    AudioManager.setVolume(0);
                    AVM1ButtonCustom.buttonPokiSDKActions["all"](function () {
                        AudioManager.setVolume(1);
                        _this._runAction(action);
                    });
                }
                else {
                    this._runAction(action);
                }
            }
        }
    };
    return AVM1ButtonCustom;
}(AVM1Button));
export { AVM1ButtonCustom };
