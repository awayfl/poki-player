import { wrapAVM1NativeClass, AVM1Context, AVM1Object, AVM1Button, AVM1MovieClip } from "@awayfl/avm1";
import { AudioManager } from "@awayjs/core";
import { DisplayObjectContainer } from "@awayjs/scene";

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


export class AVM1MovieClipCustom extends AVM1MovieClip {

	static pokiSDKonStopAction:any;
	static retryButtonIDS:any;
	static actionWhenRetryButtonEncountered:any;
	static createAVM1Class(context: AVM1Context) : AVM1Object {
		return wrapAVM1NativeClass(context, true, AVM1MovieClipCustom,
			[],
			['$version#', '_alpha#', 'getAwayJSID', 'attachAudio', 'attachBitmap', 'attachMovie',
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
	}

	private findChildWithSymbolIDs(obj:DisplayObjectContainer) {
		var childNum:number = obj._children.length;
		for (var i = 0; i < childNum; i++) {
			var child=obj._children[i];
			if(child && (<any>child).symbolID && AVM1MovieClipCustom.retryButtonIDS[(<any>child).symbolID]){
				return true;
			}
			if(child && (<any>child)._children){
				var hasChildWithSymbolID=this.findChildWithSymbolIDs(<DisplayObjectContainer>child);
				if(hasChildWithSymbolID)
					return true;
			}
		}
		return false;

	}
	public stop() {

		if (AVM1MovieClipCustom.actionWhenRetryButtonEncountered && AVM1MovieClipCustom.retryButtonIDS) {
			var hasChildWithSymbolID=this.findChildWithSymbolIDs(this.adaptee);
			if(hasChildWithSymbolID)
				AVM1MovieClipCustom.actionWhenRetryButtonEncountered();
		}
			
		if (AVM1MovieClipCustom.pokiSDKonStopAction && AVM1MovieClipCustom.pokiSDKonStopAction.action && AVM1MovieClipCustom.pokiSDKonStopAction.childName && this.adaptee.getChildByName(AVM1MovieClipCustom.pokiSDKonStopAction.childName)) {
			AVM1MovieClipCustom.pokiSDKonStopAction.action();//console.log("called stop on retry mc")
		}
		else if (AVM1MovieClipCustom.pokiSDKonStopAction && AVM1MovieClipCustom.pokiSDKonStopAction.action  && AVM1MovieClipCustom.pokiSDKonStopAction.childName && AVM1MovieClipCustom.pokiSDKonStopAction.childName == "all") {
			AVM1MovieClipCustom.pokiSDKonStopAction.action();
		}
		else if (AVM1MovieClipCustom.pokiSDKonStopAction && AVM1MovieClipCustom.pokiSDKonStopAction.action  && AVM1MovieClipCustom.pokiSDKonStopAction.mcName && AVM1MovieClipCustom.pokiSDKonStopAction.mcName == this.adaptee.name) {
			if(AVM1MovieClipCustom.pokiSDKonStopAction.ignoreFrames && AVM1MovieClipCustom.pokiSDKonStopAction.ignoreFrames.indexOf(this.adaptee.currentFrameIndex)>=0){
				// this frame is ignored for stop actions
			}
			else{
				AVM1MovieClipCustom.pokiSDKonStopAction.action();
			}
		}
		return this.adaptee.stop();
	}
}

