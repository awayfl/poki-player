import { AVMPlayerPoki } from "./AVMPlayerPoki";


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

export class AVMCrashReport {
	public static collectLogs = true;
	public static logs = [];
	public static glInfo = {};
	public static lastCrash = null;
	protected static player: AVMPlayerPoki;

	public static init() {
		this._attachReporters();
		this._attachUI();
		this._webGlInfo();
		//@ts-ignore
		window.REPORTER = AVMCrashReport;
	}

	public static bind(player) {
		AVMCrashReport.player = player;
	}

	private static _attachUI() {
		const b = document.querySelector("#report__snap");
		b.addEventListener("click", () => this._requsetSnap());
	}

	private static _requsetSnap() {
		console.log("[AVMCrashReporter] Generate report...");

		const pop = document.querySelector("#report__poppup");
		const area = pop.querySelector("#report__text");
		const save = pop.querySelector("#report__save");

		if(!pop) {
			return null;
		}

		const _logs = AVMCrashReport.logs.join("\n");
		area.textContent = _logs;

		pop.classList.toggle("show", true);

		save.addEventListener("click",() => {
			pop.classList.toggle("show", false);
			
			const data = AVMCrashReport.generateReport()
			const name = 
				`report_${ AVMCrashReport.player.config.title}_${(new Date().toDateString())}.json`		

			AVMCrashReport.__saveFile(data, name);

		}, {once: true})
	}

	private static __saveFile(data: string, name: string) {

		var blob = new Blob( [ data ], {
			type: 'application/json'
		});

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

	private static _attachReporters() {
		window.onerror = AVMCrashReport._catchUnhandled;

		if (this.collectLogs) {
			for(let key in original) {
				console[key] = function (...args:any[]) {
					AVMCrashReport._trackLogs(key, ...args);
					original[key].apply(console, args);
				}
			}
		}
	}

	private static _trackLogs(type:string, ...args: any[]) {
		this.logs.push("[" + type.toUpperCase() + "]: " + args.join(" "));
	}

	private static _catchUnhandled(error: string, url: string, line: number, coll, errObj: Error) {
		if(defaultError)
			defaultError(error, url, line);

		AVMCrashReport._trackLogs("exeption", errObj.stack);
		AVMCrashReport.lastCrash = {
			error,
			line,
			stack: errObj.stack,
			url,
			source: null
		}

		AVMCrashReport._requsetSnap();
	}

	public static generateReport() {
		const report = {
			date: new Date(),
			game: this._gameInfo(),
			device: this._deviceLog(),
			context: this.glInfo,
			config: this.player.config,
			crash: this.lastCrash,
			snap: null // comming soon
		};

		return JSON.stringify(report);
	}

	private static _gameInfo() {
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

	private static _webGlInfo() {
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

	private static _deviceLog() {
		const store = Object.create(null);

		try {
			const l = localStorage.length;
			for(let i = 0; i < l; i ++) {
				const k = localStorage.key(i);
				store[k] = localStorage.getItem(k);
			}
		} catch(e) {}

		return {
			agent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
				dpi: window.devicePixelRatio
			},
			store,
		}
	}
}
