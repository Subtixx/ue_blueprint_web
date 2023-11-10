export type HtmlTemplate = {
    tag: string;
    classes?: string[];
    attrs?: HtmlAttributes[];
    childs?: (HtmlTemplate | null)[];
    text?: string;
}
export type HtmlAttributes = {
    name: string;
    value: string;
}

export type UnrealBlueprintOptions = {
    height?: string;
    width?: string;
    type?: any;
}

export type UnrealPin = {
    name: string;
    value: string | any[];
    useDelimiter: boolean;
}

export type UnrealError = {
    type?: string;
    message?: string;
    stack?: string;
    displayedMessage?: string;
    originalError?: any;
    node?: any;
}

export type UnrealProperty = {
    value: string|any[];
}

export enum UnrealBlueprintTypes {
    BEHAVIOR_TREE = "Behavior Tree",
    ANIMATION = "Animation",
    MATERIAL = "Material",
    METASOUND = "Metasound",
    BLUEPRINT = "Blueprint"
}

export enum MouseButtons {
    LEFT = 0,
    RIGHT = 2,
    MIDDLE = 1
}

export enum Platforms {
    WINDOWS = "WIN",
    MAC = "MAC",
}

export enum Modes {
    READ = "READ",
    WRITE = "WRITE",
}

export enum MouseStates {
    DOWN = "DOWN",
    UP = "UP",
    MOVE = "MOVE",
}

export var STEP = 16;
export var ZOOM_STEP = .08;
export const LIMIT_ZOOM_IN = 7;
export const LIMIT_ZOOM_OUT = -12;
export var INIT_FRAME_SIZE = "250px";
