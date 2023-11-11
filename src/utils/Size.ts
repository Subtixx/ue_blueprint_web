export class Size {
    protected _width: number;
    protected _height: number;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    public toString(): string {
        return `${this._width}x${this._height}`;
    }

    public static fromString(value: string): Size {
        const [width, height] = value.split("x");
        if (width === undefined || height === undefined) {
            throw new Error("Invalid size string");
        }

        return new Size(parseInt(width), parseInt(height));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static fromObject(value: any): Size {
        if (typeof value === "string") {
            return Size.fromString(value);
        }
        if(value.width === undefined || value.height === undefined) {
            throw new Error("Invalid size object");
        }

        return new Size(value.width, value.height);
    }
}
