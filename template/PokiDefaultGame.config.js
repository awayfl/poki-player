module.exports = {


	// all props prefixed with "rt_" will be added to config that is inserted in html
	// all props prefixed with "pokiHack_" will be added to config that is inserted in html if rt_pokiSDK==true

	//------------------------------------------------------
	// global config for this game - same for all swf-files:
	//------------------------------------------------------

	debugConfig: false,			//	log config in build process
	sitelock: false,			//	inject poki sitelock/debug-block
	rt_pokiSDK: false,			//	enable PokiSDK - always true in prod
	rt_debugPoki: false,		//	debug PokiSDK - always false in prod
	rt_showFPS: false,			//	show fps display - always false in prod
	cacheBuster: true,			//	add cachebuster to urls - always false in prod
	allowURLSearchParams: true, //	allow changing config via url-params - always false in prod
	split: false, 				//	create own folder for each file - only available in prod

	entryName: "", 		//	name of webpack-entry - must be set for each config (use package.main ?)
	entryPath: "", 		//	path to webpack-entry - must be set for each config (use package.main ?)

	buildinsPath: "", 	//	path to buildins - must be set when amv2 will be used
	gameTemplate: "", 	//	path to game-html template - must be set - when using rt_pokISDK=false, it will look for *.nopokisdk.html
	indexTemplate: "", 	//	path to index-html template - must be set
	loaderTemplate: "",	//	path to loader.js - must be set

	//-------------------------------------------------------------------------
	// default config for this game - can be overwritten for every file-config:
	//-------------------------------------------------------------------------

	rt_debug: true, 	//	disable JS blobind - always false in prod
	rt_title: "", 		//	title of game - should be overwritten for each file-config, but also available for index
	rt_filename: "",	//	filename of game - no extension - must be set for each config
	rt_splash: "",		//	path to splash-image - with extension
	rt_start: null,		//	path to start-image - with extension - optional - if present, loader wait for user input to start the game
	rt_width: 550,		//	width of preloader screen (todo: grab this from splashimage ?)
	rt_height: 400,		//	height of preloader screen (todo: grab this from splashimage ?)	
	rt_x: 0,		// x offset of stage (either absolute px value, or string with percentage of window.innerWidth (0-100))
	rt_y: 0,		// y offset of stage (either absolute px value, or string with percentage of window.innerHeight (0-100))
	rt_w: "100%",		// width of stage (either absolute px value, or string with percentage of window.innerWidth (0-100))
	rt_h: "100%",		// height of stage (either absolute px value, or string with percentage of window.innerHeight (0-100))

	rt_stageScaleMode:null, // allowed values: EXACT_FIT noBorder noScale showAll
	rt_stageAlign:null, // allowed values: B BL BR L R T TL TR
	
	rt_progressParserWeigth: 1,	// 	weight of parser in reporter - can be ommited or set to 0 aswell

	// properties for progress bar
	rt_progress: {
		direction: "lr", //	lr, td
		back: "#35809e", // #000
		line: "#070bff", // "#00ff00",
		rect: [0.25, 0.65, 0.5, 0.03], // values are percentage of width / height
	},

	// list of file-configs. 
	// each file-config is a object that must provide:
	//	- rt_title 
	//	- rt_filename (no extension)
	// it can overwrite other config props aswell
	fileconfigs: [],

	resources: [],	// list of urls to preload (fonts) - relative to project folder

	assets: [],	// list of assets to copy but not preload

	rt_skipFramesOfScene: null,				// hack to number of frames on the main-timeline
	pokiSdkHack_buttonPokiSDKActions: null, 	// map button ids to actions
	pokiSdkHack_retryButtonIDS: null,		// list of ids with retry buttons
	pokiSdkHack_retryButtonAction: null,		// action to perform on retry buttons
	pokiSdkHack_actionOnStop: null,			// action to perform when mc.stop is called
	pokiSdkHack_actionWhenRetryButtonEncountered: null, // action to perform when a retry button is encountered

};
