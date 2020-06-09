import { AVMPlayer } from "@awayfl/awayfl-player";
import { LoaderEvent } from "@awayjs/core"
import { globalRedirectRules } from "@awayfl/playerglobal";
import { AVMEvent, AVMVERSION } from '@awayfl/swf-loader';
import { AVM1Globals, AVM1SceneGraphFactory } from '@awayfl/avm1';
import { BOX2D_PREFERENCE } from '@awayfl/avm2';
import { AVM1PokiSDK } from './AVM1PokiSDK';
import { AVM2PokiSDK } from './AVM2PokiSDK';
import { AVM1ButtonCustom } from './AVM1ButtonCustom';
import { AVM1MovieClipCustom } from './AVM1MovieClipCustom';

globalRedirectRules.push(
	{
		test: /x.mochiads.com/,
		supressErrors: true,
	},
	{
		test: /AGI.swf/,
		resolve: "/assets/ads/AGI.swf",
	},
	{
		test: "http://cdn.nitrome.com/components/NitromeAPI.pkg",
		resolve: "./assets/NitromeAPI.pkg"
	}
)

export class AVMPlayerPoki extends AVMPlayer {

	constructor(gameConfig: any) {
		super(gameConfig);

		if (!gameConfig.files || !gameConfig.files.length) {
			throw ("AVMPlayerPoki: gameConfig.files must have positive length");
		}

		window["AVMPlayerPoki"] = this;


		if (this._gameConfig.showFPS) {
			this.showFrameRate = true;
		}

		if(this._gameConfig.redirects) {
			globalRedirectRules.push.apply(globalRedirectRules, this._gameConfig.redirects);
		}

		if(this._gameConfig.box2dVersion) {
			BOX2D_PREFERENCE.version = gameConfig.box2dVersion;
		}

		this.addEventListener(LoaderEvent.LOADER_COMPLETE, (event) => {
			if (!this._gameConfig.start) {
				if (window["pokiGameParseComplete"])
					window["pokiGameParseComplete"]();
				this.play(gameConfig.skipFramesOfScene);
				return;
			}
			if (window["pokiGameParseComplete"])
				window["pokiGameParseComplete"](() => this.play(gameConfig.skipFramesOfScene));
		});

		this.load();

	}

	protected onAVMAvailable(event: AVMEvent) {
		if (event.avmVersion == AVMVERSION.AVM2) {
			//console.log("AVM2 has init");
			new AVM2PokiSDK(this._gameConfig.pokiSDK);
		}
		else if (event.avmVersion == AVMVERSION.AVM1) {
			//console.log("AVM1 has init");
			AVM1PokiSDK.usePokiSDK = this._gameConfig.pokiSDK;
			AVM1Globals.registerCustomClass("PokiSDK2",
				AVM1PokiSDK.createAVM1Class((<AVM1SceneGraphFactory>this._avmHandler.factory).avm1Context)
			);

			// custom hacks for PokiSDK on button click :

			// convert list of ids to object 
			if (this._gameConfig.retryButtonIDS) {
				this._gameConfig.retryButtonIDS = this._gameConfig.retryButtonIDS.reduce((acc, curr) => {
					acc[curr] = true;
					return acc;
				}, {})
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
	}
}


