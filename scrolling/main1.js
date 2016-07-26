"use strict";

const CANVAS  = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

class Main {

    constructor() {
        this.objects = [];
        this.mouse = {};
        this.objects = [];
        this.polygons = [];
        this.planets = [];
        this.ship = null;
    }

    setup() {
        this.craft = new Image();
        this.craft.src = "fighter.png";

        this.station = new Image();
        this.station.src = "spacestation.png"
        let p = 0, x = 0, y = 0;
        let src = ["2.png", "3.png", "4.png", "5.png", "6.png", "7.png"];
        for (let i = 2; i <= 5; i++) {
            x = Math.random() * 10000;
            y = Math.random() * 800;

            this.planets["p" + i] = {};
            this.planets["p" + i].obj = new Image();
            this.planets["p" + i].obj.src = src[Math.floor(src.length * Math.random())];
            this.planets["p" + i].x = x;
            this.planets["p" + i].y = y;

        }

        this.explosion = new Image();
        this.explosion.src = "explosion.png";

        this.addCircle();
        let self = this, i;
        this.ship = new Player(8, 25, 200, 300);

        let keyboard = new Keyboard();

        document.addEventListener('keydown', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);

        document.addEventListener('keyup', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);
        this.update();

    }

    addCircle() {
        let i=0;
        let src = ["2.png", "3.png", "4.png", "5.png", "6.png", "7.png"];
        let img = [];

        for (i; i < 30; i++) {
            img[i] = {};
            img[i].obj = new Image();
            img[i].obj.src = src[Math.floor(src.length * Math.random())];
            this.objects.push(new Circle(CANVAS.width, CANVAS.height, i, img[i]));
        }
    }
    
    update() {
        CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

        var objLength = this.objects.length;

        for (var i = 0; i < objLength; i++) {
            var obj = this.objects[i];

            for (var j = i + 1; j < objLength; j++) {
                if (obj.checkCollision(this.objects[j])) {
                    obj.resolveCollision(obj, this.objects[j]);
                }
            }

            obj.boundsCheck(obj);
            obj.moveVector = obj.velocity.scalarMultiplyNew(0.9);
            obj.move();

            this.ship.checkObjCollision(obj, CONTEXT);

            //obj.draw(CONTEXT);//
            this.redrawCircle(obj);
        }


        let p;
       // for (p in this.planets) {
       //     CONTEXT.drawImage(this.planets[p].obj, this.planets[p].x, this.planets[p].y);
       // }

        //CONTEXT.drawImage(this.station,1850,250);

        CONTEXT.save();

        this.ship.update();
        this.drawShip(this.ship);
        this.renderMissiles();


        CONTEXT.restore();

    }

    renderMissiles() {
        var missile = {};
        var player = {};
        var missile = {};

//console.log(this.ship.shots);
        var missileLength = this.ship.shots.length - 1;

        for (var i = missileLength; i >= 0; i--) {
            missile = this.ship.shots[i];
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

                this.missileContact(1,missile);
                this.renderParticles();
            }
        }

    }

    /**
     * Player missile to bad guy contact
     */
    missileContact (id, missile) {
        let j = 0;

        for (j in this.objects) {

            let baddy    = this.objects[j];

            console.log(baddy);
            let particle,
                dist     = baddy.position.distance(missile),
                min_dist = 20;

            if (dist < min_dist) {
                console.log("bang");
                baddy.explode = true;
                baddy.timeout = 5;
                this.renderParticles(baddy);
            }
        }

        return false;
    }

    /**
     * Draw explosion from sprite
     */
    renderParticles(baddy) {

        console.log(baddy);
        let   srcX = 0, srcY = 0, eX = 0, eY =0, offset=70;;

        for (var i = 1000; i >= 0; i--) {
            if(baddy && baddy.hasOwnProperty("position")) {
                CONTEXT.save(); //save current state in stack
                CONTEXT.beginPath();
                CONTEXT.drawImage(this.explosion, srcX, srcY, 124, 124, baddy.position.x, baddy.position.y, 124, 124);
                CONTEXT.stroke();
                CONTEXT.closePath();

                CONTEXT.restore(); //pop old state on to screen
            }
        }

    }

    drawShip(ship) {
        var coords = ship.getCoords();
        var cLength = coords.length;
        var exhaust = ['red', 'orange', 'yellow', 'purple', 'green'];
        var flame = [30, 31, 32, 33, 34, 35];

        CONTEXT.save();

        if(ship.sheild) {
            CONTEXT.beginPath();
            CONTEXT.moveTo(coords[0].x, coords[0].y);
            CONTEXT.rotate(this.rotation);

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
        CONTEXT.translate(ship.position.x, ship.position.y);
        CONTEXT.rotate(ship.rotation);


        CONTEXT.globalAlpha = 1;
        CONTEXT.beginPath();
        CONTEXT.drawImage(this.craft, -20, -23);
        CONTEXT.closePath();

        if (ship.thruster) {
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
    }

    redrawCircle (circle) {

        CONTEXT.drawImage(circle.src.obj,circle.position.x-(circle.radius+5),circle.position.y-(circle.radius+5));

    }

}