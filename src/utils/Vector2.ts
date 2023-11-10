export class Vector2 {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    add(vector: Vector2): Vector2 {
        return new Vector2(this._x + vector._x, this._y + vector._y);
    }

    subtract(vector: Vector2): Vector2 {
        return new Vector2(this._x - vector._x, this._y - vector._y);
    }

    multiply(scalar: number): Vector2 {
        return new Vector2(this._x * scalar, this._y * scalar);
    }

    divide(scalar: number): Vector2 {
        return new Vector2(this._x / scalar, this._y / scalar);
    }

    magnitude() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    normalize(): Vector2 {
        return this.divide(this.magnitude());
    }

    distance(vector: Vector2) {
        return this.subtract(vector).magnitude();
    }

    dot(vector: Vector2) {
        return this._x * vector._x + this._y * vector._y;
    }

    angle(vector: Vector2) {
        return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()));
    }

    clone() {
        return new Vector2(this._x, this._y);
    }

    toString() {
        return `(${this._x}, ${this._y})`;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get array() {
        return [this._x, this._y];
    }

    static fromAngle(angle: number) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static fromArray(array: number[]) {
        return new Vector2(array[0], array[1]);
    }
}
