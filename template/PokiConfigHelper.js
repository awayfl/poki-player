
const defaultConfig = require('./PokiDefaultGame.config.js');

module.exports = (
	isProd, config, rootPath, CopyWebPackPlugin, HTMLWebPackPlugin,
	BannerPlugin, fs, rimraf, path, TSLoader,
	merge, Terser,
) => {

	if (!config)
		throw "config must be passed to processConfig";
	if (!rootPath)
		throw "rootPath must be passed to processConfig";
	if (!CopyWebPackPlugin)
		throw "CopyWebPackPlugin must be passed to processConfig";
	if (!HTMLWebPackPlugin)
		throw "HTMLWebPackPlugin must be passed to processConfig";
	if (!BannerPlugin)
		throw "BannerPlugin must be passed to processConfig";
	if (!fs)
		throw "fs must be passed to processConfig";
	if (!rimraf)
		throw "rimraf must be passed to processConfig";
	if (!path)
		throw "path must be passed to processConfig";
	if (!TSLoader)
		throw "ts-loader must be passed to processConfig";
	//if (!merge)
	//	throw "merge must be passed to processConfig";


	config = Object.assign(defaultConfig, config);

	// force some configs dependant on prod and dev
	config.rt_pokiSDK = isProd ? true : config.rt_pokiSDK;
	config.rt_debugPoki = (isProd || !config.rt_pokiSDK) ? false : config.rt_debugPoki;

	config.rt_debug = isProd ? false : config.rt_debug;

	config.rt_showFPS = isProd ? false : config.rt_showFPS;

	config.cacheBuster = isProd ? false : config.cacheBuster;

	config.allowURLSearchParams = isProd ? false : config.allowURLSearchParams;

	// split mode right now errors in watch mode
	config.split = isProd ? config.split : false;

	if (config.debugConfig) {
		console.log("global config used for webpack:");
		for (var key in config) {
			console.log("	- config." + key, config[key]);
		}
	}

	const entry = {};
	entry[config.entryName] = [config.entryPath];

	let plugins = processConfig(config, rootPath, CopyWebPackPlugin, HTMLWebPackPlugin, BannerPlugin, fs, rimraf, path);

	const common = {

		entry: entry,

		output: {
			pathinfo: false,
			path: path.join(rootPath, "bin"),
			filename: 'js/[name].js'
		},
		resolve: {
			alias: {
				//uncomment aliases for recompiling libs
				// "tslib": path.join(rootPath, "node_modules", "tslib", "tslib.es6.js"),
				// "@awayjs/core": path.join(rootPath, "node_modules", "@awayjs/core", "bundle", "awayjs-core.umd.js"),
				// "@awayjs/graphics": path.join(rootPath, "node_modules", "@awayjs/graphics", "bundle", "awayjs-graphics.umd.js"),
				// "@awayjs/scene": path.join(rootPath, "node_modules", "@awayjs/scene", "bundle", "awayjs-scene.umd.js"),
				// "@awayjs/stage": path.join(rootPath, "node_modules", "@awayjs/stage", "bundle", "awayjs-stage.umd.js"),
				// "@awayjs/renderer": path.join(rootPath, "node_modules", "@awayjs/renderer", "bundle", "awayjs-renderer.umd.js"),
				// "@awayjs/view": path.join(rootPath, "node_modules", "@awayjs/view", "bundle", "awayjs-view.umd.js"),
				// "@awayjs/materials": path.join(rootPath, "node_modules", "@awayjs/materials", "bundle", "awayjs-materials.umd.js"),
				// "@awayjs/swf-viewer": path.join(rootPath, "node_modules", "@awayjs/swf-viewer", "bundle", "awayjs-swf-viewer.umd.js"),
				//"opentype.js": path.join(rootPath, "node_modules", "opentype.js", "dist", "opentype.js")
			},
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: ['.webpack.js', '.web.js', '.js', '.ts', '.tsx']
		},
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `awesome-typescript-loader`
				{ test: /\.ts(x?)/, exclude: /node_modules/, loader: TSLoader, options: { experimentalWatchApi: true} },

				// all files with a `.js` or `.jsx` extension will be handled by `source-map-loader`
				//{ test: /\.js(x?)/, loader: require.resolve('source-map-loader') }
			]
		},
		plugins: plugins,

		performance: {
			hints: false // wp4
		},
		stats: {
			cached: true, // wp4
			errorDetails: true, // wp4
			colors: true // wp4
		},
		devServer: {
			progress: true, // wp4
		},


	}

	const dev = {
		mode: "development",// wp4
		devtool: 'source-map',
		//devtool: 'cheap-module-eval-source-map',//use this option for recompiling libs
		devServer: {
			contentBase: path.join(process.cwd(), "src"),
			inline: true,
			publicPath: "/",
			open: false,
			progress: true,

		},
		optimization: {
			//minimize: false // wp4
		}
	}

	const prod = {
		mode: "production",// wp4
		bail: true
	};

	if(Terser) {
		prod.optimization = {
			minimize: true,
			minimizer: [
				new Terser({
				  extractComments: {
					condition: /^\**!|@preserve|@license|@cc_on/i,
					filename: 'LICENSES.txt'
				  },
				}),
			],
		}
	} else {
		console.warn("TERSER IS REQUIRE FOR REMOVING COMMENTS!");
	}

	return merge(common, isProd ? prod : dev);

}

// process config
// return a list of webpack-plugins
const processConfig = (config, rootPath, CopyWebPackPlugin, HTMLWebPackPlugin, BannerPlugin, fs, rimraf, path) => {

	var plugins = [];

	// insert poki-header (sitelock / debug-block):
	// todo: this makes problems
	if (config.sitelock) {
		// jsStringForHTML += "\n" + pokiHeader + "\n";
		plugins.push(new BannerPlugin({ raw: true, banner: pokiHeader, entryOnly: true, test: /\js/ }))
	}

	// 	if no split, copy as3 buildins to asset folder
	//	if split, we will copy them for each game-config individually
	if (config.buildinsPath && config.buildinsPath.length && !config.split) {
		plugins.push(new CopyWebPackPlugin([
			{ from: config.buildinsPath, to: 'assets/builtins' },
		]));
	}

	//	copy loader.js to js-folder
	//	if split, this will be copied to the subfolder together with webpack-bundel
	plugins.push(new CopyWebPackPlugin([
		{ from: config.loaderTemplate, to: 'js' },
	]));

	// collect all game-urls to create a index.html:
	let gameURLS = {};

	// map to collect copied resources, so we preent any redunant copies
	let copiedResources = {};

	var _loop_1 = function (i) {

		var fileConfig = config.fileconfigs[i];
		var folderName = fileConfig.rt_filename;
		var outputPath = config.split ? folderName + "/" : "";

		//	if split, copy buildins to each output folder:

		if (config.buildinsPath && config.buildinsPath.length && config.split) {
			plugins.push(new CopyWebPackPlugin([
				{ from: config.buildinsPath, to: outputPath + 'assets/builtins' },
			]));
		}

		// get config for this file merged with default values from global config:

		var configForHTML = getConfig(fileConfig, config);

		//	copy assets for this file-config:

		swfPath = path.join(rootPath, "src", "assets", configForHTML.filename + ".swf");
		if (!fs.existsSync(swfPath)) {
			throw ("invalid filename path for fileconfig " + configForHTML.filename);
		}
		stats = fs.statSync(swfPath);
		filesize = stats["size"];
		if (!fs.existsSync(path.join(rootPath, "src", "assets", configForHTML.splash))) {
			throw ("invalid splashscreen path for fileconfig " + configForHTML.splash);
		}
		plugins.push(new CopyWebPackPlugin([
			{ from: swfPath, to: outputPath + "assets" },
		]));
		plugins.push(new CopyWebPackPlugin([
			{ from: path.join(rootPath, "src", "assets", configForHTML.splash), to: outputPath + "assets" },
		]));

		//	optional copy startscreen:

		if (configForHTML.start) {
			if (!fs.existsSync(path.join(rootPath, "src", "assets", configForHTML.start))) {
				throw ("invalid startscreen path for fileconfig " + configForHTML.start);
			}
			plugins.push(new CopyWebPackPlugin([
				{ from: path.join(rootPath, "src", "assets", configForHTML.start), to: outputPath + "assets" },
			]));
		}

		// create/prepare config props needed for runtime

		configForHTML.binary = [];
		// copy and prepare resources for html 
		let resources = getConfigProp(fileConfig, config, "resources");
		if (resources && resources.length > 0) {
			for (let r = 0; r < resources.length; r++) {
				let res_path = path.join(rootPath, resources[r]);
				let res_name = path.basename(res_path);
				let res_outputPath = outputPath + "assets/" + res_name;
				let res_filesize = copiedResources[res_outputPath];
				if (!res_filesize) {
					// only need to copy if it has not yet been done
					if (!fs.existsSync(res_path)) {
						throw ("invalid filename path for resource " + res_path);
					}
					plugins.push(new CopyWebPackPlugin([
						{ from: res_path, to: outputPath + "assets" },
					]));
					stats = fs.statSync(res_path);
					res_filesize = stats["size"];
					copiedResources[res_outputPath] = res_filesize;
				}
				configForHTML.binary.push({
					name: res_name,
					path: res_outputPath,
					size: res_filesize,
				});
			}
		}
		let assets = getConfigProp(fileConfig, config, "assets");
		if (assets && assets.length > 0) {
			for (let r = 0; r < assets.length; r++) {
				let res_path = path.join(rootPath, assets[r]);

				if (!fs.existsSync(res_path)) {
					throw ("invalid filename path for asset " + res_path);
				}
				plugins.push(new CopyWebPackPlugin([
					{ from: res_path, to: outputPath + "assets" },
				]));
				
			}
		}
		
		configForHTML.binary.push({
			name: configForHTML.filename,
			path: "assets/" + configForHTML.filename + ".swf",
			size: filesize,
			resourceType: "GAME",
		});

		if (configForHTML.splash)
			configForHTML.splash = "assets/" + configForHTML.splash;

		if (configForHTML.start)
			configForHTML.start = "assets/" + configForHTML.start;


		var runtimePath = (config.split ? folderName + "/js/" : "js/") + config.entryName + ".js";
		configForHTML["runtime"] = runtimePath;


		// create string for html inject (incl hack to handle functions): 

		var collectedFunctions = collectAndReplaceFunctions({}, configForHTML);
		var configStr = "\nconfig = " + JSON.stringify(configForHTML, null, 4) + ";\n";
		var jsStringForHTML = "";
		var allFunctions;
		if (Object.keys(collectedFunctions).length > 0) {
			jsStringForHTML = "\nlet allFunctions = {};\n";
			for (var key in collectedFunctions) {
				jsStringForHTML += "allFunctions['" + key + "'] = " + collectedFunctions[key].toString() + ";\n";
			}
			jsStringForHTML += configStr;
			jsStringForHTML += "\nlet connectConfigToFunctions =" + (function (obj) {
				for (var key in obj) {
					if (typeof obj[key] == "string" && obj[key].indexOf("___") === 0) {
						obj[key] = allFunctions[obj[key].replace("___", "")];
					}
					if (typeof obj[key] == "object")
						connectConfigToFunctions(obj[key]);
				}
			}).toString() + ";\n";
			jsStringForHTML += "\nconnectConfigToFunctions(config);\n";
		}
		else {
			jsStringForHTML += configStr;
		}

		// code to overwrite config by URLSearchParams
		if (config.allowURLSearchParams) {
			jsStringForHTML += "const q = new URLSearchParams(location.search);\n";
			jsStringForHTML += "for (let key of q.keys()){ config[key] = q.get(key);};\n";
		}

		// add cachebuster
		if (config.cacheBuster) {
			jsStringForHTML += "for (let key in config.binary){ config.binary[key].path = config.binary[key].path+'?v='+Math.random();};\n";
		}

		
		//	copy and mod html:

		var htmlOutputPath = (config.split ? folderName + "/" : "") + (config.split ? "index.html" : folderName + ".html");
		gameURLS[fileConfig.rt_filename] = {
			path: htmlOutputPath,
			name: configForHTML.title
		};

		var htmlSourcePath = getConfigProp(fileConfig, config, "gameTemplate");
		if (!config.rt_pokiSDK) {
			htmlSourcePath = htmlSourcePath.replace(".html", ".nopokisdk.html");
		}

		if (config.debugConfig) {
			console.log("### " + configForHTML.title + " CONFIG THAT WILL BE INJECTED INTO HTML");
			for (var key in configForHTML) {
				console.log("			- config." + key, configForHTML[key]);
			}
		}

		plugins.push(new CopyWebPackPlugin([
			{
				from: htmlSourcePath,
				to: htmlOutputPath,
				transform: function (content, src) {
					return content.toString()
						.replace(/INSERT_TITLE/g, configForHTML.title ? configForHTML.title : "UNTITLED")
						.replace(/INSERT_SPLASHSCREEN/g, configForHTML.splash)
						.replace(/INSERT_CODE/g, jsStringForHTML);
				}
			}
		]));
	};

	var swfPath, stats, filesize;
	for (var i = 0; i < config.fileconfigs.length; i++) {
		_loop_1(i);
	}


	// Generate a listing html that links to all game-htmls:
	plugins.push(new HTMLWebPackPlugin({
		title: config.rt_title,
		template: config.indexTemplate,
		filename: 'index.html',
		games: gameURLS,
		inject: false
	}));

	if (config.split) {
		// 	when webpack is finished, copy the js-folder to subfolders 
		//	this errors with dev-server, so we only use "split" in prod

		plugins.push({
			apply: function (compiler) {
				compiler.plugin('done', function (compilation) {
					console.log("copy build to game-folders");
					for (var i = 0; i < config.fileconfigs.length; i++) {
						copyRecursiveSync(fs, path, path.join(rootPath, "bin", "js"), path.join(rootPath, "bin", config.fileconfigs[i].rt_filename, "js"));
					}
					rimraf.sync(path.join(rootPath, "bin", "js"));
				});
			}
		});

	}

	return plugins;
}

// prevent debuging via devtools + sitelock
var pokiHeader = `
const _0x1918 = ['top', 'indexOf', 'aHR0cHM6Ly9wb2tpLmNvbS9zaXRlbG9jaw==', 'hostname', 'length', 'location', 'LnBva2ktZ2RuLmNvbQ==', 'href']; (function (_0x4a02b5, _0x5c0c3d) { const _0x56a85d = function (_0x375c0e) { while (--_0x375c0e) { _0x4a02b5.push(_0x4a02b5.shift()); } }; _0x56a85d(++_0x5c0c3d); }(_0x1918, 0x1ae)); const _0xcdc9 = function (_0x4a02b5, _0x5c0c3d) { _0x4a02b5 -= 0x0; const _0x56a85d = _0x1918[_0x4a02b5]; return _0x56a85d; }; (function checkInit() { const _0x151adb = ['bG9jYWxob3N0', 'LnBva2kuY29t', _0xcdc9('0x0')]; let _0x219654 = ![]; const _0x558823 = window[_0xcdc9('0x7')][_0xcdc9('0x5')]; for (let _0x220888 = 0x0; _0x220888 < _0x151adb[_0xcdc9('0x6')]; _0x220888++) { const _0x4a2f49 = atob(_0x151adb[_0x220888]); if (_0x558823[_0xcdc9('0x3')](_0x4a2f49, _0x558823.length - _0x4a2f49.length) !== -0x1) { _0x219654 = !![]; break; } } if (!_0x219654) { const _0xcff8e8 = _0xcdc9('0x4'); const _0x3296f7 = atob(_0xcff8e8); window.location[_0xcdc9('0x1')] = _0x3296f7; window[_0xcdc9('0x2')][_0xcdc9('0x7')] !== window[_0xcdc9('0x7')] && (window[_0xcdc9('0x2')][_0xcdc9('0x7')] = window[_0xcdc9('0x7')]); } }());
var dd = document.createElement('script');dd.innerHTML = atob('KGZ1bmN0aW9uIGEoKXt0cnl7KGZ1bmN0aW9uIGIoKXtkZWJ1Z2dlcjtiKCl9KSgpfWNhdGNoKGUpe3NldFRpbWVvdXQoYSw1ZTMpfX0pKCk');document.head.appendChild(dd);
`;

// get config prop from file-config, or from global-config if it doesnt eists
var getConfigProp = function (fileconfig, config, name) {
	return fileconfig[name] ? fileconfig[name] : config[name];
};

// get a config for a game-file.
// this filters out all props that are not prefixed by "rt_" or "pokiSdkHack_"
// "pokiSdkHack_"-props are only included when "rt_pokiSDK" is true
// also takes care that it uses props from global-config if file-config does not provide it
// this can probably be done better and cleaner
// but for now it should do the job
var getConfig = function (fileconfig, config) {
	var newConfig = {};
	for (var key in fileconfig) {
		if (key.indexOf("rt_") == 0) {
			newConfig[key.replace("rt_", "")] = fileconfig[key];
		}
		if (config.rt_pokiSDK) {
			if (key.indexOf("pokiSdkHack_") == 0) {
				newConfig[key.replace("pokiSdkHack_", "")] = fileconfig[key];
			}
		}
	}
	for (var key in config) {
		if (key.indexOf("rt_") == 0 && !newConfig.hasOwnProperty(key.replace("rt_", ""))) {
			newConfig[key.replace("rt_", "")] = config[key];
		}
		if (config.rt_pokiSDK) {
			if (key.indexOf("pokiSdkHack_") == 0 && !newConfig.hasOwnProperty(key.replace("pokiSdkHack_", ""))) {
				newConfig[key.replace("pokiSdkHack_", "")] = config[key];
			}
		}
	}

	return newConfig;
};

// collect all js-functions found in config obj and replace them with string-id
// we will inject the functions sepperatly, so we can inject config as json string
// we also inject a function that wires the collected functions back to the js-obj
// this way we can support injecting simple js-function into the html (dont use "this" in functions)
var collectAndReplaceFunctions = function (collectedFunctions, obj, path) {
	if (path === void 0) { path = ""; }
	if (path != "") { path += ""; }
	if (typeof obj === "object") {
		for (var key in obj) {
			if (typeof obj[key] === "function") {
				collectedFunctions[path + key] = obj[key];
				obj[key] = "___" + path + key;
			}
			else {
				collectedFunctions = collectAndReplaceFunctions(collectedFunctions, obj[key], path + key);
			}
		}
	}
	return collectedFunctions;
};
// used to copy the output to sub-folder when building in split mode
var copyRecursiveSync = function (fs, path, src, dest) {
	var exists = fs.existsSync(src);
	var stats = exists && fs.statSync(src);
	var isDirectory = exists && stats.isDirectory();
	if (isDirectory) {
		fs.mkdirSync(dest);
		fs.readdirSync(src).forEach(function (childItemName) {
			copyRecursiveSync(fs, path, path.join(src, childItemName), path.join(dest, childItemName));
		});
	}
	else {
		fs.copyFileSync(src, dest);
	}
};
