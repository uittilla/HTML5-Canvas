"use strict";

/**
 * Basestation class
 *
 */

class Basestation {
    constructor(sides, radius, offsetX, offsetY, station, bullet) {
        if (sides < 3) return;

        this.coords = [];
        this.color  = 'grey';

        let a = (Math.PI * 2)/sides;
        let i = 0;

        for (i; i < sides; i++) {
            this.coords.push(new Vector2D(offsetX - radius * Math.cos(a*i), offsetY - radius * Math.sin(a*i)));
        }

        this.center   = this.getCenter();
        this.position = this.center;
        this.radian   = 0.25;
        this.radian   *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.height   = 1000;
        this.width    = 10000;
        this.bullet   = bullet;
        this.station  = station;
        this.shots = [];
        this.particles = [];
        this.offset = this.station.width;
        this.dist = 0;
        this.fire = false;
    }
/*

    update(angle) {
        this.rotation = angle;
        this.addShot(angle);
        this.updateMissileXY(CONTEXT, angle);
        this.renderMissiles(CONTEXT);
        this.rotate();
    }*/

    update(angle, player) {
       /* let right = this.width, left = 0,
            top = 0, bottom = this.height;

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

        this.position.x -= 0.5;
        this.position.y = 0;

        this.coords.forEach(function(coords) {
            coords.x -= 0.1;
        });
*/
        this.rotation = angle;
        this.addShot(angle);
        this.updateMissileXY(CONTEXT, angle);
        this.renderMissiles(CONTEXT);
        this.updateParticles(CONTEXT);
        this.dist = Math.sqrt( (player.position.x-this.position.x)*(player.position.x-this.position.x) +
                               (player.position.y-this.position.y)*(player.position.y-this.position.y) );
        //this.rotate();
    }

    getCoords() {
        return this.coords;
    }

    getCenter() {
        let coords = this.getCoords();
        let center = new Vector2D(coords[0].x, coords[0].y);
        let c = 0;

        for(c in coords){
            if(c != 0) {
                center.add(coords[c]);
            }
        }

        center.scalarDivide(coords.length);

        return center;
    }

    rotate() {
        let i = 0;

        for(i in this.coords) {
            this.coords[i].rotate(this.center, this.radian);
        }
    }

    checkObjCollision(object, context) {
        let cLength = this.coords.length-1;
        let i = 0;

        for (i; i <= cLength; i++) {
            if(i+1 <= cLength) {
                this.checkObj(this.coords[i], this.coords[i + 1], object, context);
            }
            else{
                this.checkObj(this.coords[i], this.coords[0], object, context);
            }
        }
    }

    checkObj (a,b,object, context) {
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
                let NV  = N.dot(object.velocity);
                let NV2 = N.scalarMultiplyNew(NV * 2);
                object.velocity.subtract(NV2);
            }

            let danger = (object.radius*4);

            if (XP.magnitude() < danger) {
                context.beginPath();
                context.moveTo(P.x, P.y);
                context.lineTo(P.x + (danger*N.x), P.y + (danger*N.y));
                context.strokeStyle = "red";
                context.lineWidth = 1;
                context.globalAlpha = 0.5;
                context.stroke();
                context.beginPath();
                context.arc(P.x, P.y, 4, 0, Math.PI * 2, true);
                context.closePath();
                context.strokeStyle = "red";
                context.stroke();
                context.lineWidth = 1;
                context.globalAlpha = 1;
            }
        }
    }

    updateMissileXY(angle) {
        let missile = {}, missileLength = this.shots.length - 1;
        let Per_Frame_Distance = 2;
        let sin = Math.sin(angle) * Per_Frame_Distance;
        var cos = Math.cos(angle) * Per_Frame_Distance;

        for (let i = missileLength; i >= 0; i--) {
            missile = this.shots[i];

            // tally up including vx + vy to account for ship speed.
            missile.position.x -= (missile.velocity.x);
            missile.position.y -= (missile.velocity.y);

            missile.lifeCtr++;

            if (missile.lifeCtr > missile.life) {
                this.createExplosion(missile.position.x, missile.position.y);
                this.shots.splice(i, 1);
                missile = null;
            }
        }
    }

    renderMissiles(CONTEXT) {
        let missile = {}, i;
        let missileLength = this.shots.length - 1;

        for (i = missileLength; i >= 0; i--) {
            missile = this.shots[i];

            if (missile.hasOwnProperty("position")) {
                CONTEXT.save();
                CONTEXT.drawImage(this.bullet,missile.position.x, missile.position.y);
                CONTEXT.restore();
            }
        }
    }

    /**
     * New player missile
     */
    missile(angle) {
        let self = this;
        let Per_Frame_Distance = 7;
        let sin = Math.sin(-angle) * Per_Frame_Distance;
        let cos = Math.cos(-angle) * Per_Frame_Distance;

        this.fire = false;

        return {
            position: new Vector2D(self.position.x, self.position.y),
            velocity: new Vector2D(-cos, -sin),
            life: (parseInt(self.dist)/10) + 25,
            lifeCtr: 0
        };

    }

    addShot (angle) {
        console.log(this.dist, (parseInt(this.dist)/10));
        let i=0;
        if (this.fire && this.shots.length < 10 && this.dist < 2000) {
            this.shots.push(this.missile(angle));
        } else {
            this.fire = true;
        }
    }

    draw (CONTEXT, angle) {
        /*var coords = this.getCoords();
        var cLength = coords.length;

        CONTEXT.save();
        CONTEXT.beginPath();

        CONTEXT.moveTo(coords[0].x,coords[0].y);
        CONTEXT.fillStyle = "grey";

        while (cLength--) {
            CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
        }
        CONTEXT.fill();
        CONTEXT.stroke();
        CONTEXT.restore();*/


        CONTEXT.save();
        CONTEXT.translate(this.position.x,this.position.y);
        CONTEXT.rotate(angle);
        CONTEXT.translate(-this.position.x,-this.position.y);
        CONTEXT.drawImage(this.station,this.position.x-250, this.position.y-250);
        CONTEXT.restore();
    }

    missileContact (player) {

        for (let i in this.shots) {
            let missile = this.shots[i];
            //console.log(missile);
            let baddy    = player, particle,
                dist     = baddy.position.distance(missile),
                min_dist = baddy.radius;

            if (dist < min_dist) {
                console.log("baddy hit", missile);

                return true;
            }

            return true;
        }

        return false;
    }

    createExplosion(x, y, color) {
        var minSize = 10;
        var maxSize = 30;
        var count = 10;
        var minSpeed = 60.0;
        var maxSpeed = 200.0;
        var minScaleSpeed = 1.0;
        var maxScaleSpeed = 4.0;

        for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
            var particle = new Particle();

            particle.x = x;
            particle.y = y;

            particle.radius = this.randomFloat(minSize, maxSize);

            particle.color = color || 'orange';

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
