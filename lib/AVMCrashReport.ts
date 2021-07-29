import { AVMPlayerPoki } from "./AVMPlayerPoki";

const STYLE_TMPLATE = `
	#report__root {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 1000;
		user-select: none;
		pointer-events: none;
	}
	.report__btn {
		padding: 4px;
		height: 1.5em;
		background: #222;
		color: #eee;
		text-align: center;
		font-size: 1.5em;
		line-height: 1.5em;
		border-radius: 1.5em;
		pointer-events: all;
		box-shadow: 1px 3px 5px 2px black;
		transition: background-color 0.5s;
	}
	.report__btn:hover {
		cursor: pointer;
		background: #444;
	}

	#report__snap:hover {
		right: -15px;
		color: #ffc;
	}

	#report__snap {
		position: absolute;
		top: 0.5em;
		right: -30px;
		width: 100px;
		padding: 4px 16px 4px 4px;
		transition: right 0.5s;
		display: none;
	}

	#report__poppup {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: max(60%, 300px);
		min-height: 40%;
		max-height: 80%;
		height: auto;
		display: none;
		flex-direction: column;
		background: #fcc;
		box-shadow: 1px 3px 5px 2px black;
		border-radius: 4px;
		justify-content: space-around;
		align-items: center;
		color: #222;
		padding: 10px;
	}

	#report__poppup.show{
		display: flex;
	}

	#report__text {
		width: 100%;
		min-height: 30%;
		height: auto;
		background: rgba(255,255,255, 0.5);
		pointer-events: all;
	}
`

const HTML_TEMPLATE = `
<div id='report__snap' class = 'report__btn'>
	<span>SNAP</span>
</div>
<div id='report__poppup'>
	<h1>Report!</h1>
	<textarea readonly = "true" id="report__text" rows='10'>error</textarea>
	<div id = 'report__save' class = 'report__btn'>
		SAVE REPORT
	</div>
</div>

`
const GL_CONST = {
	MAX_TEXTURE_SIZE: 0x0d33,
	MAX_VIEWPORT_DIMS: 	0x0d3a,
	MAX_TEXTURE_IMAGE_UNITS: 0x8872,
	MAX_RENDERBUFFER_SIZE: 0x84e8,
	MAX_ELEMENTS_INDICES: 0x80e9,
	MAX_DRAW_BUFFERS: 0x8824,
	MAX_COLOR_ATTACHMENTS: 0x8cdf,

}
const defaultError = window.onerror;
const original = {
	log: console.log,
	warn: console.warn,
	debug: console.debug,
	error: console.error,
	info: console.info,
};

function attachZip() {
	const s = document.createElement('script');
	s.async = true;
	s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js';
	s.crossOrigin = 'anonymous';

	document.body.appendChild(s);

	return new Promise((e) => s.onload = e);
}

let ZIP = null;

export class AVMCrashReport {
	public static collectLogs = true;
	public static instance: AVMCrashReport = null;

	public logs = [];
	public glInfo = {};
	public lastCrash = null;
	public roodtEl = null;
	protected player: AVMPlayerPoki;

	public constructor() {
		this._attachReporters();
		this._attachUI();
		this._webGlInfo();

		attachZip().then(e => ZIP = self['JSZip']);
		//@ts-ignore
		window.REPORTER = this;
	}

	public static init() {
		AVMCrashReport.instance = new AVMCrashReport();
	}

	public static bind(player: any) {
		if(AVMCrashReport.instance) {
			AVMCrashReport.instance.bind(player);
		}
	}

	public bind(player: any) {
		this.player = player;
	}

	private _attachUI() {
		const root = this.roodtEl = document.createElement("div");

		root.setAttribute('id', "report__root");
		root.innerHTML = HTML_TEMPLATE;
		document.body.appendChild(root);

		const s = document.createElement('style');
		s.innerHTML = STYLE_TMPLATE;
		document.head.appendChild(s);

		const b = root.querySelector("#report__snap");
		b.addEventListener("click", () => this._requsetSnap());
	}

	private _requsetSnap() {
		console.log("[AVMCrashReporter] Generate report...");

		const pop = this.roodtEl.querySelector("#report__poppup");
		const area = pop.querySelector("#report__text");
		const save = pop.querySelector("#report__save");

		if(!pop) {
			return null;
		}

		area.textContent =  this.logs.join("\n");

		pop.classList.toggle("show", true);

		save.addEventListener("click",() => {
			pop.classList.toggle("show", false);
			
			const data = this.generateReport()
			const name = 
				`report_${ this.player.config.title}_${(new Date().toISOString())}`		

			this._saveFile(data, name);

		}, {once: true})
	}

	private _saveFile(data: any, name: string) {

		if (!ZIP) {
			// remove to save size
			data.snap = null;
			this._trigLoad(
				new Blob( [ JSON.stringify (data, null, 2) ], {type: 'application/json'} ),
				name + '.jzon'
			);

		} else {
			const snap: HTMLCanvasElement = data.snap;

			if (snap) {
				data.snap = name + '.png';
			}

			const zip = new ZIP();

			zip.file(`${name}.json`, JSON.stringify(data, null, 2));
			
			if (snap) {
				zip.file(data.snap, snap.toDataURL().replace('data:image/png;base64,', ''), {base64: true});
			}

			zip.generateAsync({ type:"blob" })
				.then((content: Blob) => {
					// see FileSaver.js
					this._trigLoad(content, name + '.zip');
				});
		}
	}

	private _trigLoad(blob, name) {
		const url = URL.createObjectURL( blob );
		const link = document.createElement( 'a' );
		link.setAttribute( 'href', url );
		link.setAttribute( 'download', name );

		const event = document.createEvent( 'MouseEvents' );
		event.initMouseEvent( 'click', 
				true, true, window, 
				1, 0, 0, 0, 0, 
				false, false, false, 
				false, 0, null);

		link.dispatchEvent( event );
	}

	private _attachReporters() {
		window.addEventListener('error', this._catchUnhandled.bind(this));

		const _this = this;
		if (AVMCrashReport.collectLogs) {
			for(let key in original) {
				console[key] = function (...args:any[]) {
					_this._trackLogs(key, ...args);
					original[key].apply(console, args);
				}
			}
		}
	}

	private _trackLogs(type:string, ...args: any[]) {
		args = args.filter(e => !!Object.getPrototypeOf(e));

		if (args.length === 0 && args[0].mode ** args[0].stack) {
			args[0] = JSON.stringify(args[0]);
		}

		this.logs.push("[" + type.toUpperCase() + "]: " + args.join(" "));
	}

	private _catchUnhandled(error: ErrorEvent) {

		this._trackLogs("exception", error.message, error.filename, error.lineno);
		this.lastCrash = {
			error: error.error,
			line: error.lineno,
			message: error.message,
			filename: error.filename,
			source: null
		}

		this._requsetSnap();
	}

	public generateReport() {
		const data = {
			date: new Date(),
			game: this._gameInfo(),
			device: this._deviceInfo(),
			context: this.glInfo,
			config: this.player.config,
			logs: this.logs,
			crash: this.lastCrash,
			snap: null // comming soon
		};

		return data;
	}

	private _gameInfo() {
		const player = <any>this.player;

		const avm = player._avmHandler.avmVersion;
		const { 
			swfVersion,
			fpVersion,
			frameCount,
			frameRate,
			compression,
			bytesTotal
		} = player._swfFile;

		let path: string = (<any>player._gameConfig).binary.filter(({resourceType}) => resourceType === 'GAME')[0]?.path;

		if(path && path.indexOf('?') > -1) {
			path = path.substring(0, path.indexOf('?'));
		}

		return {
			file: {
				name: (<any>player._gameConfig)?.title,
				path: path,
				size: bytesTotal
			},
			runtime: {
				swfVersion, 
				fpVersion, 
				frameCount, 
				frameRate, 
				compression,
				avm
			}
		}
	}

	private _webGlInfo() {
		const c = document.createElement('canvas');
		let version = 2;
		let ctx: WebGL2RenderingContext | WebGLRenderingContext = c.getContext('webgl2');

		if(!ctx) {
			ctx = c.getContext('webgl');
			version = 1;
		}
		
		let params = Object.create(null);

		for(const key in GL_CONST) {
			params[key] = ctx.getParameter(GL_CONST[key])
		}

		const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');

		this.glInfo =  {
			version,
			params,
			vendor: ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
			renderer: ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
		}
	}

	private _deviceInfo() {
		let store = Object.create(null);

		if (self['_AWAY_DEBUG_STORAGE']) {
			try {
				store = self['_AWAY_DEBUG_STORAGE'].decodedData();
			} catch (e) {
				// 
			}
		} else {
			try {
				const l = localStorage.length;
				for(let i = 0; i < l; i ++) {
					const k = localStorage.key(i);
					store[k] = localStorage.getItem(k);
				}
			} catch(e) {}
		}

		return {
			agent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
				dpi: window.devicePixelRatio
			},
			store,
			memory: performance['memory']
		}
	}
}
