import {UnrealError} from "../Types";

export enum LogType {
    ERROR,
    WARN,
    INFO,
    DEBUG,
}

class Logger {
    private _name: string;
    private _showDebug: boolean;
    private _verbosity: LogType = LogType.WARN;

    public get isDebug(): boolean {
        return this._showDebug;
    }

    constructor(name: string, showDebug: boolean = false) {
        this._name = name;
        this._showDebug = showDebug;
        this._verbosity = showDebug ? LogType.DEBUG : LogType.WARN;
    }

    public info(message: any, ...args: any[]) {
        this.log(LogType.INFO, null, message, ...args);
    }

    public i(message: any, sink: string = "UNNAMED", ...args: any[]) {
        this.log(LogType.INFO, sink, message, ...args);
    }

    public error(message: any | UnrealError, ...args: any[]) {
        this.log(LogType.ERROR, null, message, ...args);
        if ((message as UnrealError).stack !== undefined) {
            let unrealError = message as UnrealError;
            this.log(LogType.ERROR, null, unrealError.stack);
        }
    }

    public e(message: any, sink: string = "UNNAMED", ...args: any[]) {
        this.log(LogType.ERROR, sink, message, ...args);
    }

    public warn(message: any, ...args: any[]) {
        this.log(LogType.WARN, null, message, ...args);
    }

    public w(message: any, sink: string = "UNNAMED", ...args: any[]) {
        this.log(LogType.WARN, sink, message, ...args);
    }

    public debug(message: any, ...args: any[]) {
        this.log(LogType.DEBUG, null, message, ...args);
    }

    public d(message: any, sink: string = "UNNAMED", ...args: any[]) {
        this.log(LogType.DEBUG, sink, message, ...args);
    }

    public log(type: LogType, sink: string | null, message: any, ...args: any[]) {
        if (type === LogType.DEBUG && !this._showDebug) {
            return;
        }

        if (type > this._verbosity) {
            return;
        }

        if (typeof message === "object") {
            message = JSON.stringify(message);
        }

        let logTypeString = this._getLogTypeString(type);
        let logTypeBackgroundColor = this._getLogTypeBackgroundColor(type);
        let logTypeForegroundColor = this._getLogTypeForegroundColor(type);

        let logString = `[${this._getTimestamp()}] [${this._name}] %c[${logTypeString}]%c ${message}`;
        if (sink !== null) {
            logString = `[${this._getTimestamp()}] [${this._name}] %c[${logTypeString}]%c %c[${sink}]%c ${message}`;
        }
        let logStyle = `background-color: ${logTypeBackgroundColor}; color: ${logTypeForegroundColor};`;

        // Convert all args to strings
        args = args.map((arg) => {
            if (typeof arg === "object") {
                return JSON.stringify(arg);
            }
            if (typeof arg?.inspect === "function") {
                return arg.inspect();
            }
            return arg.toString();
        });

        if (type === LogType.INFO) {
            if (sink === null) {
                console.log(logString, logStyle, "", ...args);
            } else {
                console.log(logString, logStyle, "", this._getSinkColor(sink), "", ...args);
            }
        } else if (type === LogType.ERROR) {
            if (sink === null) {
                console.error(logString, logStyle, "", ...args);
            } else {
                console.error(logString, logStyle, "", this._getSinkColor(sink), "", ...args);
            }
        } else if (type === LogType.WARN) {
            if (sink === null) {
                console.warn(logString, logStyle, "", ...args);
            } else {
                console.warn(logString, logStyle, "", this._getSinkColor(sink), "", ...args);
            }
        } else {
            if (console.groupCollapsed !== undefined) {
                if (sink === null) {
                    console.groupCollapsed(logString, logStyle, "", ...args);
                } else {
                    console.groupCollapsed(logString, logStyle, "", this._getSinkColor(sink), "", ...args);
                }
                console.trace();
                console.groupEnd();
            } else {
                console.log(logString, logStyle, "", ...args);
            }
        }
    }

    private _getSinkColor(sink: string | null): string {
        if (sink === null) {
            return "white";
        }

        let hash = 0;
        for (let i = 0; i < sink.length; i++) {
            hash = sink.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = "#";
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ("00" + value.toString(16)).substr(-2);
        }

        return `background-color: ${color}; color: white;`;
    }

    private _getTimestamp(): string {
        return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
    }

    private _getLogTypeString(type: LogType): string {
        switch (type) {
            case LogType.INFO:
                return "INFO ";
            case LogType.ERROR:
                return "ERROR";
            case LogType.WARN:
                return "WARN ";
            case LogType.DEBUG:
                return "DEBUG";
            default:
                return "UNKNOWN";
        }
    }

    private _getLogTypeBackgroundColor(type: LogType): string {
        switch (type) {
            case LogType.INFO:
                return "#50FA7B";
            case LogType.ERROR:
                return "#FF5555";
            case LogType.WARN:
                return "#F1FA8C";
            case LogType.DEBUG:
                return "#8BE9FD";
            default:
                return "white";
        }
    }

    private _getLogTypeForegroundColor(type: LogType): string {
        switch (type) {
            case LogType.INFO:
                return "#282A36";
            case LogType.ERROR:
                return "#282A36";
            case LogType.WARN:
                return "#282A36";
            case LogType.DEBUG:
                return "#282A36";
            default:
                return "#282A36";
        }
    }

    public setVerbosity(verbosity: LogType) {
        this._showDebug = (verbosity === LogType.DEBUG);
        this._verbosity = verbosity;
    }
}

export const logger = new Logger("main");
