"use strict";

/**
 * Player class
 *
 */
class Player {
    constructor(sides, radius, offsetX, offsetY) {
        if (sides < 3) return;
        this.coords = [];
        this.color = 'grey';
        this.velocity = new Vector2D(0, 0);
        this.moveVector = 1;
        this.vr = 0; // rotation in degrees
        this._thrust = 0;
        this.rotation = 0;
        this.thruster = false;
        this.shots = [];
        this.particles = [];
        this.sheild = false;
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.height = 800;
        this.width = 10000;
        this.radius = radius;
        this.sides = sides;
        this.position = new Vector2D(offsetX, offsetY);

        this.setCoords();
        this.center = this.getCenter();

        this.radian = -6.283185;
        this.rotate();
    }

    update() {
        this.center = this.getCenter();
        this.boundsCheck();

        this.rotation += this.vr * Math.PI / 180;

        if (this.rotation < -6.283185) {
            this.rotation = 0;
        }

        if (this.rotation > 6.283185) {
            this.rotation = 0;
        }

        this.radian = this.rotation;

        this.rotate();

        this.velocity.x += Math.cos(this.rotation) * this._thrust;
        this.velocity.y += Math.sin(this.rotation) * this._thrust;

        this.position.add(this.velocity);

        let self = this;

        this.coords.forEach(function (coords) {
            coords.add(self.velocity);
        });
    }


    /**
     * Returns coordinates of this polygon's points
     * @returns {Array}
     */
    setCoords() {
        let a = (Math.PI * 2) / this.sides;
        let i = 0;

        for (i; i < this.sides; i++) {
            this.coords[i] = new Vector2D(this.position.x - this.radius * Math.cos(a * i), this.position.y - this.radius * Math.sin(a * i));
        }
    }

    /**
     * Returns coordinates of this polygon's points
     * @returns {Array}
     */
    getCoords() {
        return this.coords;
    }

    /**
     * Returns x,y of the polygon center
     * @returns {Vector2D}
     */
    getCenter() {
        let coords = this.getCoords();
        let center = new Vector2D(coords[0].x, coords[0].y);
        let c = 0;

        for (c in coords) {
            if (c != 0) {
                center.add(coords[c]);
            }
        }

        center.scalarDivide(coords.length);

        return center;
    }

    /**
     * Rotates the polygon
     */
    rotate() {
        let i = 0;
        for (i in this.coords) {
            this.coords[i].rotate(this.position, this.radian);
        }
    }

    boundsCheck() {
        let right = this.width, left = 0,
            top = 0, bottom = this.height;

        let diff = 0;

        if (this.position.x > right) {
            this.position.x = left;
        }
        else if (this.position.x < left) {
            this.position.x = right;
        }
        if (this.position.y > bottom) {
            this.position.y = top;
        }
        else if (this.position.y < top) {
            this.position.y = bottom;
        }

        this.setCoords();
    }

    /**
     * Check Oject collisions
     * @param object
     * @param context
     */
    checkObjCollision(object, context) {
        let cLength = this.coords.length - 1;
        let i = 0;

        for (i; i <= cLength; i++) {
            if (i + 1 <= cLength) {
                this.checkObj(this.coords[i], this.coords[i + 1], object, context);
            }
            else {
                this.checkObj(this.coords[i], this.coords[0], object, context);
            }
        }
    }

    /**
     * Checks each coorinate point and magnitiude
     * Resolves collisions and provides inidcators of danger
     * @param a
     * @param b
     * @param object
     * @param context
     */
    checkObj(a, b, object, context) {
        let AB = new Vector2D(b.x - a.x, b.y - a.y);
        let AX = new Vector2D(object.position.x - a.x, object.position.y - a.y);
        let u = ((AX.x * AB.x) + (AX.y * AB.y)) / Math.pow(AB.magnitude(), 2);

        if (u >= 0 && u <= 1) {
            let P = new Vector2D(a.x, a.y);
            P.add(AB.scalarMultiplyNew(u));
            let XP = P.subtractNew(object.position);
            let N = new Vector2D(AB.y, -AB.x);

            N.normalise();

            if (XP.magnitude() <= object.radius) {
                let NV = N.dot(object.velocity);
                let NV2 = N.scalarMultiplyNew(NV * 2);
                object.velocity.subtract(NV2);
            }

            let danger = 95;

            if (XP.magnitude() < danger) {
                context.beginPath();
                context.moveTo(P.x, P.y);
                context.lineTo(P.x + (danger * N.x), P.y + (danger * N.y));
                context.strokeStyle = "blue";
                context.lineWidth = 1;
                context.globalAlpha = 0.5;
                context.stroke();
                context.beginPath();
                context.arc(P.x, P.y, 4, 0, Math.PI * 2, true);
                context.closePath();
                context.strokeStyle = "blue";
                context.stroke();
                context.lineWidth = 1;
            }

        }
    }
}
