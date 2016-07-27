"use strict";

const CANVAS  = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

class Main {

    constructor() {
        this.objects = [];
        this.mouse = {};
        this.objects = [];
        this.bombers = [];
        this.fighters = [];
        this.polygons = [];
        this.enemies = [];
        this.ship = null;
        this.space_station=[];
    }

    setup() {
        let self = this;

        this.craft       = new Image();
        this.craft.src   = "images/fighter.png";
        this.station     = new Image();
        this.station.src = "images/spacestation.png"
        this.bullet      = new Image();
        this.bullet.src  = "images/bullet.png";
        this.bombbullet      = new Image();
        this.bombbullet.src  = "images/bombbullet.png";
        this.stationbullet  = new Image();
        this.stationbullet.src = "images/stationbomb.png";
        self.space_station = {};

        this.doKeyboard();

        setTimeout(function(){
            self.addBombers();
            self.addFighters();
        },5000);

        this.ship          = new Player(8, 25, 200, 300, this.craft);
        this.space_station = new Basestation(25, 220, 8500, 300, this.station, this.stationbullet);
    }

    doKeyboard() {
        let keyboard = new Keyboard();
        document.addEventListener('keydown', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);
        document.addEventListener('keyup', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);
    }

    addBombers () {
        let img = [];
        for (let i=0; i < 10; i++) {
            img[i] = {};
            img[i].obj = new Image();
            img[i].obj.src = 'images/bomber.png';
            this.bombers.push(new Enemyfighter(CANVAS.width, CANVAS.height, i, img[i], this.bombbullet, 5, 50, 1));
        }
    }

    addFighters () {
        let img = [];
        for (let i=0; i < 20; i++) {
            img[i] = {};
            img[i].obj = new Image();
            img[i].obj.src = 'images/speedship.png'
            this.fighters.push(new Enemyfighter(CANVAS.width, CANVAS.height, i, img[i], this.bullet, 1, 20, 5));
        }
    }

    update(animationFrame){

        CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

        let self = this, angle;
        let colours = ['red', 'orange', 'yellow', 'purple', 'green'];

        CONTEXT.save();
        this.doEnemy(this.fighters, this.bombers, colours);
        this.doEnemy(this.bombers, this.fighters, colours);

        this.space_station.missileContact(this.ship);

        this.space_station.checkObjCollision(this.ship, CONTEXT);
        this.ship.checkObjCollision(this.space_station, CONTEXT);

        this.ship.update();
        this.ship.draw(CONTEXT);

        angle = Math.atan2(this.space_station.position.y - this.ship.position.y, this.space_station.position.x - this.ship.position.x );
        this.space_station.update(angle, this.ship);
        this.space_station.draw(CONTEXT, angle);

        CONTEXT.restore();
    }

    doEnemy(obj1, obj2, colours) {
        let i = 0, j = 0, obj, angle;

        for (i; i < obj1.length; i++) {
            obj = obj1[i];

            for (j = i + 1; j < obj2.length; j++) {
                if (obj.checkCollision(obj2[j])) {
                    obj.resolveCollision(obj, obj2[j]);
                }
            }

            this.ship.checkObjCollision(obj, CONTEXT);

            // direct baddies to ship
            angle = Math.atan2(obj.position.y - this.ship.position.y, obj.position.x - this.ship.position.x );

            this.updateEnemy(obj, angle);
            this.shipMissileContact(obj1, obj, colours, i);
            this.enemyMissileContact(obj, colours, i);

        }
    }

    updateEnemy(obj, angle) {
        obj.boundsCheck(obj);
        obj.moveVector = obj.velocity.scalarMultiplyNew(0.9);
        obj.move(angle);
        obj.draw(CONTEXT, angle, this.ship);
        obj.missileContact(this.ship);
    }

    shipMissileContact(obj1, obj, colours, i) {
        this.ship.missileContact(obj1, obj, colours, i);
    }
    
    enemyMissileContact(obj, colours, i) {
        obj.missileContact(this.ship);
    }
}