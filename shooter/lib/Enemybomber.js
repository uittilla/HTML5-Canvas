"use strict";

class Enemybomber {
    constructor(width, height, id, src, bullet) {
        let colours = ['red', 'green', 'yellow', 'silver', 'orange', 'pink'];

        let x = Math.floor(Math.random() * width),
            y = Math.floor(Math.random() * height),
            vx = Math.floor(Math.random() * 3),
            vy = Math.floor(Math.random() * 3);

        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(vx, vy);
        this.moveVector = new Vector2D(0, 0);

        this.radius = 40;//Math.floor(Math.random() * 10) + 5;
        this.mass = 60;//Math.floor(Math.random() * 1) + 5;
        this.colour = colours[Math.floor(Math.random() * colours.length)];
        this.shots = [];
        this.shotpower = 10;
        this.id = id;
        this.src = src;
        this.rotation = 90;
        this.bullet = bullet;
        this.life = 50;
        this.particles = [];
    }

    move(angle) {
        let Per_Frame_Distance = 2;
        let sin = Math.sin(angle) * Per_Frame_Distance;
        var cos = Math.cos(angle) * Per_Frame_Distance;

        this.position.x -= this.moveVector.x;
        this.position.y -= this.moveVector.y;
    }

    draw(CONTEXT, angle, ship) {
/*

        CONTEXT.fillStyle = this.colour;
        CONTEXT.beginPath();
        CONTEXT.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        CONTEXT.fill();
        CONTEXT.closePath();
*/

        CONTEXT.save();
        //CONTEXT.setTransform(1,0,0,1,0,0)
        CONTEXT.translate(this.position.x,this.position.y);
        CONTEXT.rotate(angle);
        CONTEXT.translate(-this.position.x,-this.position.y);
        CONTEXT.drawImage(this.src.obj,this.position.x-42,this.position.y-42);
        CONTEXT.setTransform(1,0,0,1,0,0)
        CONTEXT.restore();

        this.rotation = angle; //(angle * (180 / Math.PI))

        this.addShot(ship);
        this.updateMissileXY(CONTEXT, angle);
        this.updateParticles(CONTEXT);
    }

    boundsCheck(obj) {
        if (obj.position.x <= obj.radius) {
            obj.position.x = obj.radius;
            obj.velocity.x = -obj.velocity.x;
        }
        if (obj.position.x >= (canvas.width - obj.radius)) {
            obj.position.x = canvas.width - obj.radius;
            obj.velocity.x = -obj.velocity.x;
        }
        if (obj.position.y <= obj.radius) {
            obj.position.y = obj.radius;
            obj.velocity.y = -obj.velocity.y;
        }
        if (obj.position.y >= (canvas.height - obj.radius)) {
            obj.position.y = canvas.height - obj.radius;
            obj.velocity.y = -obj.velocity.y;
        }
    }

    rotate(radian) {
        this.position.rotate(this.position, radian);
    }

    updateMissileXY(CONTEXT, angle) {
        let missile = {}, missileLength = this.shots.length - 1;
        let Per_Frame_Distance = 2;
        let sin = Math.sin(angle) * Per_Frame_Distance;
        let cos = Math.cos(angle) * Per_Frame_Distance;
        let colours = ['red', 'orange', 'yellow', 'purple', 'green'];

        for (let i = missileLength; i >= 0; i--) {
            missile = this.shots[i];

            // tally up including vx + vy to account for ship speed.
            missile.position.x -= (missile.velocity.x);
            missile.position.y -= (missile.velocity.y);

            missile.lifeCtr++;

            if (missile.lifeCtr > missile.life) {
                this.createExplosion(missile.position.x, missile.position.y, 'red');
                this.shots.splice(i, 1);
                missile = null;
            }
        }

        this.renderMissiles(CONTEXT);
    }

    renderMissiles(CONTEXT) {

        let missile = {};

        let missileLength = this.shots.length - 1;

        for (let i = missileLength; i >= 0; i--) {
            missile = this.shots[i];

            if (missile.hasOwnProperty("position") || missile1.hasOwnProperty("position")) {

                CONTEXT.save();
                CONTEXT.drawImage(this.bullet,missile.position.x, missile.position.y);
                CONTEXT.restore();

               // this.missileContact(1,missile);
               // this.renderParticles();
            }
        }
    }

    /**
     * Enemy to player missile contact
     */
    enemyMissileContact (missile) {
        let player = {}, p = 0;

        for (p in this.players) {
            player = this.players[p];

            let dist     = player.position.distance(missile),
                min_dist = 20;

            if (!player.sheild && dist < min_dist) {
                if (player.particles.length === 0) {
                    player.genParticles();
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * New player missile
     */
    missile() {

        let self = this;

        return {
            position: new Vector2D(self.position.x, self.position.y-10),
            velocity: new Vector2D(7 * Math.cos(self.rotation), 7 * Math.sin(self.rotation)),
            life: 200,
            lifeCtr: 0,
            pwr: 5,
            width: 2,
            height: 2
        };
    }

    addShot (ship) {
        if (this.shots.length < 2) {
            this.shots.push(this.missile());
        }
    }

    checkCollision(other) {

        let separationVector = other.position.subtractNew(this.position);
        let distance = separationVector.magnitude();
        let sumRadii = (this.radius + other.radius);
        let moveVector = this.moveVector.subtractNew(other.moveVector);

        distance -= sumRadii;

        if (moveVector.magnitude() < distance) {
            return false;
        }

        // Normalize the movevector
        let N = moveVector.copy();
        N.normalise();

        // D = N . C = ||C|| * cos(angle between N and C)
        let D = N.dot(separationVector);

        // Another early escape: Make sure that A is moving
        // towards B! If the dot product between the movevec and
        // B.center - A.center is less that or equal to 0,
        // A isn't isn't moving towards B
        if (D <= 0) {
            return false;
        }

        let F = (distance * distance) - (D * D);

        // Escape test: if the closest that A will get to B
        // is more than the sum of their radii, there's no
        // way they are going collide
        let sumRadiiSquared = sumRadii * sumRadii;
        if (F >= sumRadiiSquared) {
            return false;
        }

        // We now have F and sumRadii, two sides of a right triangle.
        // Use these to find the third side, sqrt(T)
        let T = sumRadiiSquared - F;

        // If there is no such right triangle with sides length of
        // sumRadii and sqrt(f), T will probably be less than 0.
        // Better to check now than perform a square root of a
        // negative number.
        if (T < 0) {
            return false;
        }

        // Therefore the distance the circle has to travel along
        // movevec is D - sqrt(T)
        // Using:
        // f(x) = x*x - Input.value
        // f'(x) = 2*x
        // Assumes convergence in 10 iterations
        let X = 1;
        let i = 0;

        for (i; i < 5; i++)
            X = X - ((X * X - T) / (2 * X));

        T = X;
        distance = D - T; //Math.sqrt(T);

        // Get the magnitude of the movement vector
        let mag = moveVector.magnitude()

        // Finally, make sure that the distance A has to move
        // to touch B is not greater than the magnitude of the
        // movement vector.
        if (mag < distance) {
            return false;
        }

        moveVector.normalise();
        moveVector.scalarMultiply(distance);

        let ratio = moveVector.magnitude() / mag;
        moveVector.scalarMultiply(ratio);
        other.moveVector.scalarMultiply(ratio);

        return true;
    }

    resolveCollision(a, b) {
        let n = a.position.subtractNew(b.position);

        //console.log("Enter");

        n.normalise();
        // Find the length of the component of each of the movement
        // vectors along n.
        // a1 = v1 . n
        // a2 = v2 . n
        let a1 = a.velocity.dot(n);
        let a2 = b.velocity.dot(n);
        //console.log("pass2");
        // Using the optimized version,
        // optimizedP =  2(a1 - a2)
        //              -----------
        //                m1 + m2
        let optimizedP = (2.0 * (a1 - a2)) / (a.mass + b.mass);

        // Calculate v1', the new movement vector of circle1
        // v1' = v1 - optimizedP * m2 * n
        //var v1' = v1 - optimizedP * circle2.mass * n;

        let nv_a = a.velocity.subtractNew(n.scalarMultiplyNew(optimizedP * b.mass));

        // Calculate v1', the new movement vector of circle1
        // v2' = v2 + optimizedP * m1 * n
        //Vector v2' = v2 + optimizedP * circle1.mass * n;
        let nv_b = b.velocity.addNew(n.scalarMultiplyNew(optimizedP * a.mass));

        //console.log("pass3");

        //console.log("nv_a", nv_a);
        //console.log("nv_b", nv_b);

        a.velocity = nv_a;
        b.velocity = nv_b;

        // console.log("pass4", a.velocity);
    }

    /**
     * Player missile to bad guy contact
     */
    missileContact (player) {
        let i, baddy, dist, min_dist, missile;
        for (i in this.shots) {
            missile = this.shots[i];
            //console.log(missile);
            baddy    = player;
            dist     = baddy.position.distance(missile);
            min_dist = baddy.radius;

            if (dist < min_dist) {
               // console.log(dist, min_dist);
                missile=null;
                this.shots.splice(i,1);
                return true;
            }
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