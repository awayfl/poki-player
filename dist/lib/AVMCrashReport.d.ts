import { AVMPlayerPoki } from "./AVMPlayerPoki";
export declare class AVMCrashReport {
    static collectLogs: boolean;
    static instance: AVMCrashReport;
    logs: any[];
    glInfo: {};
    lastCrash: any;
    roodtEl: any;
    protected player: AVMPlayerPoki;
    constructor();
    static init(): void;
    static bind(player: any): void;
    bind(player: any): void;
    private _attachUI;
    private _requsetSnap;
    private _saveFile;
    private _trigLoad;
    private _attachReporters;
    private _trackLogs;
    private _catchUnhandled;
    generateReport(): {
        date: Date;
        game: {
            file: {
                name: any;
                path: string;
                size: any;
            };
            runtime: {
                swfVersion: any;
                fpVersion: any;
                frameCount: any;
                frameRate: any;
                compression: any;
                avm: any;
            };
        };
        device: {
            agent: string;
            viewport: {
                width: number;
                height: number;
                dpi: number;
            };
            store: any;
            memory: any;
        };
        context: {};
        config: import("@awayfl/swf-loader/dist/lib/AVMStage").IGameConfig;
        logs: any[];
        crash: any;
        snap: any;
    };
    private _gameInfo;
    private _webGlInfo;
    private _deviceInfo;
}
//# sourceMappingURL=AVMCrashReport.d.ts.map