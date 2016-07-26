"use strict";

class Vector2D {

    /**
     * Vector2d library
     * @param x
     * @param y
     * @constructor
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Modify this vector by adding the provided vector to it.
     * @param addVector
     */
    add (addVector) {
        this.x = this.x + addVector.x;
        this.y = this.y + addVector.y;
    }
    /**
     * Create new vector by adding the provided vector to it.
     * @param addVector
     * @returns {Vector2D}
     */
    addNew (addVector) {
        return new Vector2D(this.x + addVector.x, this.y + addVector.y);
    }
    /**
     * Modify this vector by subtracting the provided vector from it.
     * @param subtractVector
     */
    subtract (subtractVector) {
        this.x = this.x - subtractVector.x;
        this.y = this.y - subtractVector.y;
    }
    /**
     * Create new vector by subtracting the provided vector to it.
     * @param subtractVector
     * @returns {Vector2D}
     */
    subtractNew (subtractVector) {
        return new Vector2D(this.x - subtractVector.x, this.y - subtractVector.y);
    }
    /**
     * Gets the radian angle between this and vector
     */
    getAngle (vector) {
        let dx = (vector.position.x) - (this.x),
            dy = (vector.position.y) - (this.y);

        return Math.atan2(dy, dx);
    }
    /**
     * Gets the distance between this and vector
     */
    distance (vector) {
        let dx = (vector.position.x) - (this.x),
            dy = (vector.position.y) - (this.y);

        return Math.sqrt((dx * dx) + (dy * dy));
    }
    /**
     * Returns dot product from this vector and the provided vector.
     * @param dotVector
     * @returns {number}
     */
    dot (dotVector) {
        return (this.x * dotVector.x) + (this.y * dotVector.y);
    }
    /**
     * Length of the vector
     * @returns {number}
     */
    magnitude () {
        let x = this.x * this.x; //Math.pow(this.x,2),
        let y = this.y * this.y; //Math.pow(this.y,2),
        let z = x + y;
        // Using:
        // f(x) = x*x - Input.value
        // f'(x) = 2*x
        // Assumes convergence in 10 iterations
        let X = 1;
        let i = 0;

        for (i; i < 8; i++) {
            X = X - ((X * X - z) / (2 * X));
        }

        z = X;

        return z;
    }

    normalise () {
        let magnitude = this.magnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
    /**
     * Create a copy of the vector
     * @returns {Vector2D}
     */
    copy () {
        return new Vector2D(this.x, this.y);
    }
    /**
     * Multiply vector by the provided number to create a new vector.
     * @param scalar
     */
    scalarMultiply (scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    }

    scalarMultiplyNew (scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    /**
     * Divide this vector by provided vector.
     * @param scalar
     */
    scalarDivide (scalar) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
    }

    angle (vector) {
        return Math.atan2(vector.y,vector.x)
    }

    rotate (pivot, radianAngle) {
        let c = Math.cos(radianAngle);
        let s = Math.sin(radianAngle);

        this.x -= pivot.x;
        this.y -= pivot.y;

        let x = this.x * c - this.y * s;
        let y = this.x * s + this.y * c;

        this.x = x + pivot.x;
        this.y = y + pivot.y;
    }
}

/*

var Vector2D = function (x, y) {
    this.x = x;
    this.y = y;
}


Vector2D.prototype.add = function (addVector) {
    this.x = this.x + addVector.x;
    this.y = this.y + addVector.y;
}


Vector2D.prototype.getAngle = function(vector) {
    var dx = (vector.position.x) - (this.x),
        dy = (vector.position.y) - (this.y);
        
    return Math.atan2(dy, dx);
}


Vector2D.prototype.distance = function(vector) {
    var dx = (vector.position.x) - (this.x),
        dy = (vector.position.y) - (this.y);
    
    return Math.sqrt((dx * dx) + (dy * dy));
}

Vector2D.prototype.addNew = function (addVector) {
    return new Vector2D(this.x + addVector.x, this.y + addVector.y);
}

Vector2D.prototype.subtract = function (subtractVector) {
    this.x = this.x - subtractVector.x;
    this.y = this.y - subtractVector.y;
}

Vector2D.prototype.subtractNew = function (subtractVector) {
    return new Vector2D(this.x - subtractVector.x, this.y - subtractVector.y);
}


Vector2D.prototype.dot = function (dotVector) {
    return (this.x * dotVector.x) + (this.y * dotVector.y);
}

Vector2D.prototype.normalise = function () {
    var magnitude = this.magnitude();
    this.x = this.x / magnitude;
    this.y = this.y / magnitude;
}

Vector2D.prototype.magnitude = function () {
    var x = this.x * this.x; //Math.pow(this.x,2),
    var y = this.y * this.y; //Math.pow(this.y,2),
    var z = x + y;
    // Using:
    // f(x) = x*x - Input.value
    // f'(x) = 2*x
    // Assumes convergence in 10 iterations
    var X = 1;
    for (var i = 0; i < 8; i++)
        X = X - ((X * X - z) / (2 * X));
        
    z = X;

    return z;
    //return Math.sqrt(z);
}


Vector2D.prototype.copy = function () {
    return new Vector2D(this.x, this.y);
}


Vector2D.prototype.scalarMultiply = function (scalar) {
    this.x = this.x * scalar;
    this.y = this.y * scalar;
}

Vector2D.prototype.scalarMultiplyNew = function (scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
}


Vector2D.prototype.scalarDivide = function (scalar) {
    this.x = this.x / scalar;
    this.y = this.y / scalar;
}

Vector2D.prototype.angle = function(vector) {
    return Math.atan2(vector.y,vector.x)
}

Vector2D.prototype.rotate = function (pivot, radianAngle) {
    var c = Math.cos(radianAngle);
    var s = Math.sin(radianAngle);
    this.x -= pivot.x;
    this.y -= pivot.y;
    var x = this.x * c - this.y * s;
    var y = this.x * s + this.y * c;
    this.x = x + pivot.x;
    this.y = y + pivot.y;
}

*/