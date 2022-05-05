import { __spreadArrays } from "tslib";
var STYLE_TMPLATE = "\n\t#report__root {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tposition: absolute;\n\t\tz-index: 1000;\n\t\tuser-select: none;\n\t\tpointer-events: none;\n\t}\n\t.report__btn {\n\t\tpadding: 4px;\n\t\theight: 1.5em;\n\t\tbackground: #222;\n\t\tcolor: #eee;\n\t\ttext-align: center;\n\t\tfont-size: 1.5em;\n\t\tline-height: 1.5em;\n\t\tborder-radius: 1.5em;\n\t\tpointer-events: all;\n\t\tbox-shadow: 1px 3px 5px 2px black;\n\t\ttransition: background-color 0.5s;\n\t}\n\t.report__btn:hover {\n\t\tcursor: pointer;\n\t\tbackground: #444;\n\t}\n\n\t#report__snap:hover {\n\t\tright: -15px;\n\t\tcolor: #ffc;\n\t}\n\n\t#report__snap {\n\t\tposition: absolute;\n\t\ttop: 0.5em;\n\t\tright: -30px;\n\t\twidth: 100px;\n\t\tpadding: 4px 16px 4px 4px;\n\t\ttransition: right 0.5s;\n\t\tdisplay: none;\n\t}\n\n\t#report__poppup {\n\t\tposition: absolute;\n\t\tleft: 50%;\n\t\ttop: 50%;\n\t\ttransform: translate(-50%, -50%);\n\t\twidth: max(60%, 300px);\n\t\tmin-height: 40%;\n\t\tmax-height: 80%;\n\t\theight: auto;\n\t\tdisplay: none;\n\t\tflex-direction: column;\n\t\tbackground: #fcc;\n\t\tbox-shadow: 1px 3px 5px 2px black;\n\t\tborder-radius: 4px;\n\t\tjustify-content: space-around;\n\t\talign-items: center;\n\t\tcolor: #222;\n\t\tpadding: 10px;\n\t}\n\n\t#report__poppup.show{\n\t\tdisplay: flex;\n\t}\n\n\t#report__text {\n\t\twidth: 100%;\n\t\tmin-height: 30%;\n\t\theight: auto;\n\t\tbackground: rgba(255,255,255, 0.5);\n\t\tpointer-events: all;\n\t}\n";
var HTML_TEMPLATE = "\n<div id='report__snap' class = 'report__btn'>\n\t<span>SNAP</span>\n</div>\n<div id='report__poppup'>\n\t<h1>Report!</h1>\n\t<textarea readonly = \"true\" id=\"report__text\" rows='10'>error</textarea>\n\t<div id = 'report__save' class = 'report__btn'>\n\t\tSAVE REPORT\n\t</div>\n</div>\n\n";
var GL_CONST = {
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_VIEWPORT_DIMS: 0x0d3a,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_RENDERBUFFER_SIZE: 0x84e8,
    MAX_ELEMENTS_INDICES: 0x80e9,
    MAX_DRAW_BUFFERS: 0x8824,
    MAX_COLOR_ATTACHMENTS: 0x8cdf,
};
var defaultError = window.onerror;
var original = {
    log: console.log,
    warn: console.warn,
    debug: console.debug,
    error: console.error,
    info: console.info,
};
function attachZip() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js';
    s.crossOrigin = 'anonymous';
    document.body.appendChild(s);
    return new Promise(function (e) { return s.onload = e; });
}
var ZIP = null;
var AVMCrashReport = /** @class */ (function () {
    function AVMCrashReport() {
        this.logs = [];
        this.glInfo = {};
        this.lastCrash = null;
        this.roodtEl = null;
        this._attachReporters();
        this._attachUI();
        this._webGlInfo();
        attachZip().then(function (e) { return ZIP = self['JSZip']; });
        //@ts-ignore
        window.REPORTER = this;
    }
    AVMCrashReport.init = function () {
        AVMCrashReport.instance = new AVMCrashReport();
    };
    AVMCrashReport.bind = function (player) {
        if (AVMCrashReport.instance) {
            AVMCrashReport.instance.bind(player);
        }
    };
    AVMCrashReport.prototype.bind = function (player) {
        this.player = player;
    };
    AVMCrashReport.prototype._attachUI = function () {
        var _this_1 = this;
        var root = this.roodtEl = document.createElement("div");
        root.setAttribute('id', "report__root");
        root.innerHTML = HTML_TEMPLATE;
        document.body.appendChild(root);
        var s = document.createElement('style');
        s.innerHTML = STYLE_TMPLATE;
        document.head.appendChild(s);
        var b = root.querySelector("#report__snap");
        b.addEventListener("click", function () { return _this_1._requsetSnap(); });
    };
    AVMCrashReport.prototype._requsetSnap = function () {
        var _this_1 = this;
        console.log("[AVMCrashReporter] Generate report...");
        var pop = this.roodtEl.querySelector("#report__poppup");
        var area = pop.querySelector("#report__text");
        var save = pop.querySelector("#report__save");
        if (!pop) {
            return null;
        }
        area.textContent = this.logs.join("\n");
        pop.classList.toggle("show", true);
        save.addEventListener("click", function () {
            pop.classList.toggle("show", false);
            var data = _this_1.generateReport();
            var name = "report_" + _this_1.player.config.title + "_" + (new Date().toISOString());
            _this_1._saveFile(data, name);
        }, { once: true });
    };
    AVMCrashReport.prototype._saveFile = function (data, name) {
        var _this_1 = this;
        if (!ZIP) {
            // remove to save size
            data.snap = null;
            this._trigLoad(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), name + '.jzon');
        }
        else {
            var snap = data.snap;
            if (snap) {
                data.snap = name + '.png';
            }
            var zip = new ZIP();
            zip.file(name + ".json", JSON.stringify(data, null, 2));
            if (snap) {
                zip.file(data.snap, snap.toDataURL().replace('data:image/png;base64,', ''), { base64: true });
            }
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                // see FileSaver.js
                _this_1._trigLoad(content, name + '.zip');
            });
        }
    };
    AVMCrashReport.prototype._trigLoad = function (blob, name) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', name);
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    };
    AVMCrashReport.prototype._attachReporters = function () {
        window.addEventListener('error', this._catchUnhandled.bind(this));
        var _this = this;
        if (AVMCrashReport.collectLogs) {
            var _loop_1 = function (key) {
                console[key] = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this._trackLogs.apply(_this, __spreadArrays([key], args));
                    original[key].apply(console, args);
                };
            };
            for (var key in original) {
                _loop_1(key);
            }
        }
    };
    AVMCrashReport.prototype._trackLogs = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        args = args.filter(function (e) { return !!Object.getPrototypeOf(e); });
        if (args.length === 0 && Math.pow(args[0].mode, args[0].stack)) {
            args[0] = JSON.stringify(args[0]);
        }
        this.logs.push("[" + type.toUpperCase() + "]: " + args.join(" "));
    };
    AVMCrashReport.prototype._catchUnhandled = function (error) {
        this._trackLogs("exception", error.message, error.filename, error.lineno);
        this.lastCrash = {
            error: error.error,
            line: error.lineno,
            message: error.message,
            filename: error.filename,
            source: null
        };
        this._requsetSnap();
    };
    AVMCrashReport.prototype.generateReport = function () {
        var data = {
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
    };
    AVMCrashReport.prototype._gameInfo = function () {
        var _a, _b;
        var player = this.player;
        var avm = player._avmHandler.avmVersion;
        var _c = player._swfFile, swfVersion = _c.swfVersion, fpVersion = _c.fpVersion, frameCount = _c.frameCount, frameRate = _c.frameRate, compression = _c.compression, bytesTotal = _c.bytesTotal;
        var path = (_a = player._gameConfig.binary.filter(function (_a) {
            var resourceType = _a.resourceType;
            return resourceType === 'GAME';
        })[0]) === null || _a === void 0 ? void 0 : _a.path;
        if (path && path.indexOf('?') > -1) {
            path = path.substring(0, path.indexOf('?'));
        }
        return {
            file: {
                name: (_b = player._gameConfig) === null || _b === void 0 ? void 0 : _b.title,
                path: path,
                size: bytesTotal
            },
            runtime: {
                swfVersion: swfVersion,
                fpVersion: fpVersion,
                frameCount: frameCount,
                frameRate: frameRate,
                compression: compression,
                avm: avm
            }
        };
    };
    AVMCrashReport.prototype._webGlInfo = function () {
        var c = document.createElement('canvas');
        var version = 2;
        var ctx = c.getContext('webgl2');
        if (!ctx) {
            ctx = c.getContext('webgl');
            version = 1;
        }
        var params = Object.create(null);
        for (var key in GL_CONST) {
            params[key] = ctx.getParameter(GL_CONST[key]);
        }
        var debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
        this.glInfo = {
            version: version,
            params: params,
            vendor: ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        };
    };
    AVMCrashReport.prototype._deviceInfo = function () {
        var store = Object.create(null);
        if (self['_AWAY_DEBUG_STORAGE']) {
            try {
                store = self['_AWAY_DEBUG_STORAGE'].decodedData();
            }
            catch (e) {
                // 
            }
        }
        else {
            try {
                var l = localStorage.length;
                for (var i = 0; i < l; i++) {
                    var k = localStorage.key(i);
                    store[k] = localStorage.getItem(k);
                }
            }
            catch (e) { }
        }
        return {
            agent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                dpi: window.devicePixelRatio
            },
            store: store,
            memory: performance['memory']
        };
    };
    AVMCrashReport.collectLogs = true;
    AVMCrashReport.instance = null;
    return AVMCrashReport;
}());
export { AVMCrashReport };
