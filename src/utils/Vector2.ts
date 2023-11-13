/**
 * A 2D vector class
 */
export class Vector2 {
    private _x: number;
    private _y: number;

    /**
     * Creates a new vector
     * @param {number} x
     * @param {number} y
     */
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * Adds two vectors
     * @param {Vector2} vector
     * @returns {Vector2}
     */
    add(vector: Vector2): Vector2 {
        return new Vector2(this._x + vector._x, this._y + vector._y);
    }

    /**
     * Subtracts two vectors
     * @param {Vector2} vector
     * @returns {Vector2}
     */
    subtract(vector: Vector2): Vector2 {
        return new Vector2(this._x - vector._x, this._y - vector._y);
    }

    /**
     * Multiplies a vector by a scalar
     * @param {number} scalar
     * @returns {Vector2}
     */
    multiply(scalar: number): Vector2 {
        return new Vector2(this._x * scalar, this._y * scalar);
    }

    /**
     * Divides a vector by a scalar
     * @param {number} scalar
     * @returns {Vector2}
     */
    divide(scalar: number): Vector2 {
        return new Vector2(this._x / scalar, this._y / scalar);
    }

    /**
     * Returns the magnitude of a vector
     * @returns {number}
     */
    magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    /**
     * Returns the normalized vector
     * @returns {Vector2}
     */
    normalize(): Vector2 {
        return this.divide(this.magnitude());
    }

    /**
     * Returns the distance between two vectors
     * @param {Vector2} vector
     * @returns {number}
     */
    distance(vector: Vector2): number {
        return this.subtract(vector).magnitude();
    }

    /**
     * Returns the dot product of two vectors
     * @param {Vector2} vector
     * @returns {number}
     */
    dot(vector: Vector2): number {
        return this._x * vector._x + this._y * vector._y;
    }

    /**
     * Returns the angle between two vectors
     * @param {Vector2} vector
     * @returns {number}
     */
    angle(vector: Vector2): number {
        return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()));
    }

    /**
     * Clones the vector
     * @returns {Vector2}
     */
    clone(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    /**
     * Returns the string representation of the vector
     * @returns {string}
     */
    toString(): string {
        return `(${this._x}, ${this._y})`;
    }

    /**
     * Returns the x component of the vector
     * @returns {number}
     */
    get x(): number {
        return this._x;
    }

    /**
     * Sets the x component of the vector
     */
    set x(value: number) {
        this._x = value;
    }

    /**
     * Returns the y component of the vector
     * @returns {number}
     */
    get y(): number {
        return this._y;
    }

    /**
     * Sets the y component of the vector
     */
    set y(value: number) {
        this._y = value;
    }

    /**
     * Returns the vector as an array
     * @returns {[number, number]}
     */
    get array(): [number, number] {
        return [
            this._x,
            this._y
        ];
    }

    /**
     * Returns a vector from an angle
     * @param {number} angle
     * @returns {Vector2}
     */
    static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    /**
     * Returns a vector from an array
     * @param {number[]} array
     * @returns {Vector2}
     * @throws {Error} if the array is not of length 2
     */
    static fromArray(array: number[]): Vector2 {
        if (array.length !== 2) {
            throw new Error("Array must be of length 2");
        }

        return new Vector2(array[0], array[1]);
    }

    /**
     * Returns a vector from a string
     * @param {string} string
     * @returns {Vector2}
     * @throws {Error} if the string is not in the format “(x, y)”
     */
    static fromString(string: string): Vector2 {
        const regex = /\(([-\d.]+), ([-\d.]+)\)/;
        const match = string.match(regex);

        if (match === null || match.length !== 3) {
            throw new Error("Invalid string format");
        }

        const floatX: number = parseFloat(match[1]);
        const floatY: number = parseFloat(match[2]);
        if (isNaN(floatX) || isNaN(floatY)) {
            throw new Error("Invalid string format");
        }

        return new Vector2(floatX, floatY);
    }
}
