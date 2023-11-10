
export enum CanvasEvent {
    DRAW_NEW_LINK = 'DRAW_NEW_LINK',
    MOVE_LINK = 'MOVE_LINK',
    NEW_LINK = 'NEW_LINK',
    INIT_ENVIRONMENT = 'INIT_ENVIRONMENT',
    INIT_INTERACTOR = 'INIT_INTERACTOR',
    INIT_UPDATER = 'INIT_UPDATER',
    COPY_NODES_TO_CLIPBOARD = 'COPY_NODES_TO_CLIPBOARD',
    PASTE_TEXT_FROM_CLIPBOARD = 'PASTE_TEXT_FROM_CLIPBOARD',
    DOUBLE_CLICK = 'DOUBLE_CLICK',
    INTERACTOR_EXPAND_NODE = 'INTERACTOR_EXPAND_NODE',
    INTERACTOR_COLLAPSE_NODE = 'INTERACTOR_COLLAPSE_NODE',
    EDITOR_EXPAND_NODE = 'EDITOR_EXPAND_NODE',
    EDITOR_COLLAPSE_NODE = 'EDITOR_COLLAPSE_NODE',
    REDRAW_LINKS = 'REDRAW_LINKS',
}

export type CanvasEventCallback = (...args: any[]) => boolean;
