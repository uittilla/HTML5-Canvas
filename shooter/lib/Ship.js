"use strict";

/**
 * Player class
 *
 */
class Player {
    constructor(sides, radius, offsetX, offsetY, craft) {
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
        this.shotpower = 2;
        this.particles = [];
        this.sheild = false;
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.height = 1000;
        this.width = 10000;
        this.radius = radius;
        this.sides = 40;
        this.position = new Vector2D(offsetX, offsetY);
        this.craft = craft;
        this.life = 100;
        this.setCoords();
        this.center = this.getCenter();

        this.radian = -6.283185;
       // this.rotate();
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

       // this.rotate();

        this.velocity.x += Math.cos(this.rotation) * this._thrust;
        this.velocity.y += Math.sin(this.rotation) * this._thrust;

        this.position.add(this.velocity);

        let self = this;

        this.coords.forEach(function (coords) {
            coords.add(self.velocity);
        });

        this.updateMissileXY();

    }

    updateMissileXY() {
        let missile = {}, missileLength = this.shots.length - 1;

        for (let i = missileLength; i >= 0; i--) {
            missile = this.shots[i];


            // tally up including vx + vy to account for ship speed.
            missile.position.x += (missile.velocity.x + this.velocity.x);
            missile.position.y += (missile.velocity.y + this.velocity.y);

            if (missile.position.x > this.width) {
                missile.position.x = -missile.width;
            }
            else if (missile.position.x < -missile.width) {
                missile.position.x = this.width;
            }

            if (missile.position.y > this.height) {
                missile.position.y = -missile.height;
            }
            else if (missile.position.y < -missile.height) {
                missile.position.y = this.height;
            }

            missile.lifeCtr++;

            if (missile.lifeCtr > missile.life) {
                this.shots.splice(i, 1);
                missile = null;
            }
        }
    }

    /**
     * New player missile
     */
    missile() {

        let self = this;

        return {
            position: new Vector2D(self.position.x, self.position.y),
            velocity: new Vector2D(5 * Math.cos(self.rotation), 5 * Math.sin(self.rotation)),
            life: 120,
            lifeCtr: 0,
            width: 2,
            height: 2
        };
    }

    addShot () {
        if (this.shots.length < 15) {
            this.shots.push(this.missile());
        }
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

        let mes = parseInt(canvas.style.marginLeft.replace(/px/, ''),10);
        mes *= -1;
        
        if(this.position.x < mes) {
            this.position.x += mes + 10;
        }

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

            if (XP.magnitude() <= (object.radius + 5)) {
                let NV = N.dot(object.velocity);
                let NV2 = N.scalarMultiplyNew(NV * 2);
                object.velocity.subtract(NV2);
            }

            let danger = 200;

            if (XP.magnitude() < danger) {
                context.beginPath();
                context.moveTo(P.x, P.y);
                context.lineTo(P.x + (danger * N.x), P.y + (danger * N.y));
                context.strokeStyle = "blue";
                context.lineWidth = 1;
                //context.globalAlpha = 0.5;
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

    draw(CONTEXT, enemies) {
        var coords = this.getCoords();
        var cLength = coords.length;
        var exhaust = ['red', 'orange', 'yellow', 'purple', 'green'];
        var flame = [30, 31, 32, 33, 34, 35];

        CONTEXT.save();

        if(this.sheild) {
            CONTEXT.beginPath();
            CONTEXT.moveTo(coords[0].x, coords[0].y);
           // CONTEXT.rotate(this.rotation);

            CONTEXT.fillStyle = "yellow";
            CONTEXT.globalAlpha = 0.5;
            while (cLength--) {
                CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
            }
            //context.fill();
            CONTEXT.stroke();
        }

        //if(ship.sheild) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(coords[0].x, coords[0].y);
        CONTEXT.lineWidth = 1;
        CONTEXT.translate(this.position.x, this.position.y);
        CONTEXT.rotate(this.rotation);


        CONTEXT.globalAlpha = 1;
        CONTEXT.beginPath();
        CONTEXT.drawImage(this.craft, -20, -23);
        CONTEXT.closePath();

        if (this.thruster) {
            CONTEXT.beginPath();
            CONTEXT.moveTo(-17.5, -2.5);
            CONTEXT.lineTo(-flame[Math.floor(flame.length * Math.random())], 0);
            CONTEXT.lineTo(-17.5, 2);
            CONTEXT.fillStyle = exhaust[Math.floor(exhaust.length * Math.random())];
            CONTEXT.fill();
            CONTEXT.stroke();
            CONTEXT.closePath();
        }

        CONTEXT.restore();

        this.renderMissiles(CONTEXT);
    }

    renderMissiles() {
        var missile = {};
        var player = {};
        var missile = {};

        var missileLength = this.shots.length - 1;

        for (var i = missileLength; i >= 0; i--) {
            missile = this.shots[i];
            if (missile.hasOwnProperty("position")) {

                CONTEXT.save();
                CONTEXT.setTransform(1, 0, 0, 1, 0, 0);
                CONTEXT.translate(missile.position.x, missile.position.y);

                CONTEXT.strokeStyle = 'red';
                CONTEXT.globalAlpha = 1;

                CONTEXT.beginPath();
                CONTEXT.moveTo(-1, -1);
                CONTEXT.lineTo(1, -1);
                CONTEXT.lineTo(1, 1);
                CONTEXT.lineTo(-1, 1);
                CONTEXT.lineTo(-1, -1);
                CONTEXT.stroke();
                CONTEXT.closePath();

                CONTEXT.restore();
            }
        }
    }

    /**
     * Player missile to bad guy contact
     */
    missileContact (enemy) {

        for (let i in this.shots) {
            let missile = this.shots[i];
            //console.log(missile);
            let baddy    = enemy, particle,
                dist     = baddy.position.distance(missile),
                min_dist = baddy.radius;

            if (dist < min_dist) {
                missile=null;
                return true;
            }
        }

        return false;
    }

    createExplosion(x, y, color) {
        var minSize = 10;
        var maxSize = 30;
        var count = 20;
        var minSpeed = 60.0;
        var maxSpeed = 200.0;
        var minScaleSpeed = 1.0;
        var maxScaleSpeed = 4.0;

        for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
            var particle = new Particle();

            particle.x = x;
            particle.y = y;

            particle.radius = this.randomFloat(minSize, maxSize);

            particle.color = color;

            particle.scaleSpeed = this.randomFloat(minScaleSpeed, maxScaleSpeed);

            var speed = this.randomFloat(minSpeed, maxSpeed);

            particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
            particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

            this.particles.push(particle);
        }
    }

    updateParticles(CONTEXT) {
        // update and draw particles
        for (var i=0; i<this.particles.length; i++)
        {
            var particle = this.particles[i];

            particle.update(60.0);
            particle.draw(CONTEXT);
        }
    }

    randomFloat (min, max) {
        return min + Math.random()*(max-min);
    }

}
