var includePaths = require('rollup-plugin-includepaths');
var nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
	input: './dist/index.js',
	output: {
		name: 'AwayflPlayerPoki',
		sourcemap: true,
		format: 'umd',
		file: './bundle/poki-player.umd.js',
		globals: {
			'@awayfl/awayfl-player': 'Awayflplayer',
			'@awayfl/swf-loader': 'AwayflSwfLoader',
			'@awayfl/swf-loader': 'AwayflSwfLoader',
			'@awayfl/avm1': 'AwayflAvm1',
			'@awayfl/avm2': 'AwayflAvm2',
			'@awayfl/playerglobal': 'AwayflPlayerglobal',
			'@awayjs/core': 'AwayjsCore',
			'@awayjs/graphics': 'AwayjsGraphics',
			'@awayjs/materials': 'AwayjsMaterials',
			'@awayjs/renderer': 'AwayjsRenderer',
			'@awayjs/scene': 'AwayjsScene',
			'@awayjs/stage': 'AwayjsStage',
			'@awayjs/view': 'AwayjsView',
		},
	},
	external: [
		'@awayfl/awayfl-player',
		'@awayfl/swf-loader',
		'@awayfl/avm1',
		'@awayfl/avm2',
		'@awayfl/playerglobal',
		'@awayjs/core',
		'@awayjs/graphics',
		'@awayjs/materials',
		'@awayjs/renderer',
		'@awayjs/scene',
		'@awayjs/stage',
		'@awayjs/view',
	],
	plugins: [
		nodeResolve({
			jsnext: true,
			main: true,
			module: true
		}) ]
};