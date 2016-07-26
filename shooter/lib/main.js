"use strict";

const CANVAS  = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");

class Main {

    constructor() {
        this.objects = [];
        this.mouse = {};
        this.objects = [];
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
        this.space_station = new Basestation(25, 220, 9000, 300, this.station, this.stationbullet);
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
        for (let i=0; i < 12; i++) {
            img[i] = {};
            img[i].obj = new Image();
            img[i].obj.src = 'images/bomber.png';
            this.enemies.push(new Enemybomber(CANVAS.width, CANVAS.height, i, img[i], this.bombbullet));
        }
    }

    addFighters () {
        let img = [];
        for (let i=0; i < 16; i++) {
            img[i] = {};
            img[i].obj = new Image();
            img[i].obj.src = 'images/speedship.png'
            this.enemies.push(new Enemyfighter(CANVAS.width, CANVAS.height, i, img[i], this.bullet));
        }
    }

    update(animationFrame){

        if(this.ship.lives ===0) {
            CONTEXT.font = "50px sans-serif";
            CONTEXT.strokeStyle = "red";
            CONTEXT.strokeText("Game Over", this.ship.position.x + 250, this.ship.position.y - 100);
            CONTEXT.stroke();

            setTimeout(function () {
                window.cancelRequestAnimationFrame(animationFrame);
                window.location = location.href;
            }, 5000);
        }

        CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
        let self = this;
        let colours = ['red', 'orange', 'yellow', 'purple', 'green'];
        let angle = 0;
        this.space_station.checkObjCollision(this.ship, CONTEXT);
        this.ship.checkObjCollision(this.space_station, CONTEXT);

        let objLength = this.enemies.length;
        for (let i = 0; i < objLength; i++) {
            let obj = this.enemies[i];

            for (let j = i + 1; j < objLength; j++) {
                if (obj.checkCollision(this.enemies[j])) {
                    obj.resolveCollision(obj, this.enemies[j]);
                }
            }

            // direct baddies to ship
            angle = Math.atan2(obj.position.y - this.ship.position.y, obj.position.x - this.ship.position.x );

            obj.boundsCheck(obj);
            obj.moveVector = obj.velocity.scalarMultiplyNew(0.9);
            obj.move(angle);
            obj.draw(CONTEXT, angle, this.ship);

            this.space_station.checkObjCollision(obj, CONTEXT);
            this.ship.checkObjCollision(obj, CONTEXT);

            this.space_station.missileContact(this.ship);
            obj.missileContact(this.ship);

            if( this.ship.missileContact(obj) ) {
                if(obj.life > 0 && obj.life <= 10) {
                    obj.createExplosion(obj.position.x, obj.position.y, colours[Math.floor(colours.length * Math.random())]);
                    obj.updateParticles(CONTEXT);
                    obj.life -= this.ship.shotpower;
                } else if(obj.life === 0) {
                    self.enemies.splice(i, 1);
                } else {
                    obj.life -= this.ship.shotpower;
                }
            }

            if(obj.missileContact(this.ship) ) {
                if(this.ship.sheild === false) {
                    if (this.ship.life > 0 && this.ship.life <= 10) {
                        console.log(this.ship.life);
                        this.ship.createExplosion(this.ship.position.x, this.ship.position.y, colours[Math.floor(colours.length * Math.random())]);
                        this.ship.updateParticles(CONTEXT);
                        this.ship.life--;
                    } else if (this.ship.life === 0) {
                        this.ship.position = new Vector2D(10,10);

                        setTimeout(function(){

                            let mes = parseInt(canvas.style.marginLeft.replace(/px/, ''),10);
                            mes *= -1;

                            self.ship.position = new Vector2D(mes, 200);
                            self.ship.life = 100;
                        }, 2000);

                        this.ship.lives--;
                    } else {
                        this.ship.life -= obj.shotpower;
                    }

                    console.log(this.ship.life);
                }
            }
        }

        CONTEXT.save();

        this.ship.update(this.enemies);
        this.ship.draw(CONTEXT);

        this.space_station.update(angle, this.ship);
        this.space_station.draw(CONTEXT, angle);

        CONTEXT.restore();
    }

}