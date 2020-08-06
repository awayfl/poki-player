import { AVMPlayerPoki } from "./AVMPlayerPoki";

const original = {
  log: console.log,
  warn: console.warn,
  debug: console.debug,
  error: console.error,
};

export class AVMCrashReport {
  public static collectLogs = false;

  protected static player: AVMPlayerPoki;

  public static init(player: AVMPlayerPoki) {
    player = player;

    this._attachReporters();
  }

  private static _attachReporters() {
    window.addEventListener("error", this._catchUnhandled);

    if (this.collectLogs) {
      //@ts-ignore
      Object.assign({
        log: function (...args: any[]) {
          AVMCrashReport._trackLogs("log", ...args);
          original.log.apply(console, args);
        },
        warn: function (...args: any[]) {
          AVMCrashReport._trackLogs("warn", ...args);
          original.warn.apply(console, args);
        },
        debug: function (...args: any[]) {
          AVMCrashReport._trackLogs("debug", ...args);
          original.debug.apply(console, args);
        },
        error: function (...args: any[]) {
          AVMCrashReport._trackLogs("error", ...args);
          original.error.apply(console, args);
        },
      });
    }
  }

  private static _trackLogs(type, ...args: any[]) {}

  private static _catchUnhandled(e: ErrorEvent) {
    console.log(e);
  }
}
