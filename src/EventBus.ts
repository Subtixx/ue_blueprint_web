import {logger} from "./utils/Logger";
import {CanvasEvent, CanvasEventCallback} from "./CanvasEvent";

/**
 * A simple event bus.
 */
export class EventBus {
    private readonly data: { [key in CanvasEvent]?: CanvasEventCallback[] };
    private isDebug: boolean = false;

    constructor() {
        this.data = {};
    }

    listen(event: CanvasEvent, func: CanvasEventCallback) {
        if (this.data[event] === undefined) {
            this.data[event] = [];
        }

        if (this.isDebug) {
            logger.d(`Listening for event ${event}`, "bus.ts");
        }
        this.data[event]!.push(func);
    }

    emit(event: CanvasEvent, args: any[] | null = null) {
        if (this.data[event] === undefined || this.data[event]!.length === 0) {
            this.warnNoListeners(event);
            return false;
        }

        for (let r = this.data[event]!.length, n = 0; n < r; ++n) {
            if (this.data[event]![n] === undefined) {
                logger.error(`Event ${event} has an undefined listener`);
                continue;
            }

            if (typeof this.data[event]![n] !== "function") {
                logger.error(`Event ${event} has a non-function listener`);
                continue;
            }

            if (this.isDebug) {
                logger.d(`Emitting event ${event}`, "bus.ts");
            }
            if (!this.data[event]![n](args)) {
                return false;
            }
        }
        return true;
    }

    private warnedListeners: string[] = [];

    private warnNoListeners(event: string) {
        if (this.warnedListeners.indexOf(event) !== -1) {
            return;
        }

        if (logger.isDebug) {
            logger.error(`No listeners for event ${event}`);
        } else {
            logger.warn(`No listeners for event ${event}`);
        }
        this.warnedListeners.push(event);
    }
}
