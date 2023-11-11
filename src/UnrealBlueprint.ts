import { EventBus } from "./EventBus";
import { UnrealBlueprintOptions, UnrealError } from "./Types";

export class UnrealBlueprint {
    public _blueprintText: string;
    public _htmlElement: HTMLElement;
    public _options: UnrealBlueprintOptions;
    private _bus: EventBus | null = null;

    private _onError: ((error: UnrealError) => void) | null = null;

    constructor(blueprintText: string, htmlElement: HTMLElement, blueprintOptions: UnrealBlueprintOptions) {
        this._blueprintText = blueprintText;
        this._htmlElement = htmlElement;
        this._options = blueprintOptions;
    }

    start(): void {
        this.stop();
        this._bus = new EventBus();
    }

    stop(): void {
        if (this._bus) {
            this._bus.stop();
            this._bus = null;
        }
    }

    updateBlueprintText(newBlueprintText: string): void {
        this._blueprintText = newBlueprintText;
    }

    getBlueprintData() {
        return "";
    }

    moveTo(x: number, y: number): void {
        console.log("Moving to", x, y);
    }

    setOnError(onError: ((error: UnrealError) => void) | null): void {
        this._onError = onError;
    }
}
