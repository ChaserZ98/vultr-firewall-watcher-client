import { debug, error, info, trace, warn } from "@tauri-apps/plugin-log";

type Log = {
    error: (msg: string) => void;
    warn: (msg: string) => void;
    info: (msg: string) => void;
    debug: (msg: string) => void;
    trace: (msg: string) => void;
};

function forwardLog(level: "error" | "warn" | "info" | "debug" | "log") {
    let tauriLog: (msg: string) => void;
    switch (level) {
        case "error":
            tauriLog = error;
            break;
        case "warn":
            tauriLog = warn;
            break;
        case "info":
            tauriLog = info;
            break;
        case "debug":
            tauriLog = debug;
            break;
        default:
            tauriLog = trace;
    }
    return (msg: string) => {
        console[level](msg);
        try {
            tauriLog(msg);
        } catch (err) {
            console.error(err);
        }
    };
}

const logging: Log =
    "__TAURI_INTERNALS__" in window
        ? {
              error: forwardLog("error"),
              warn: forwardLog("warn"),
              info: forwardLog("info"),
              debug: forwardLog("debug"),
              trace: forwardLog("log"),
          }
        : {
              error: console.error,
              warn: console.warn,
              info: console.info,
              debug: console.debug,
              trace: console.log,
          };
export default logging;
