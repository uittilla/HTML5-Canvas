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


        let p=0,x=0,y=0;

        for(let i=2;i<=7;i++){


            x = Math.random() * 10000;
            y = Math.random() * 800;

            this.planets["p"+i] = {};
            this.planets["p"+i].obj = new Image();
            this.planets["p"+i].obj.src = i+".png";
            this.planets["p"+i].x = x;
            this.planets["p"+i].y = y;

        }

        let self = this, i;
        this.addPolygons();
        this.addPlanets();
        this.addCircle();


        this.ship = new Player(8, 25, 200, 300);

        let keyboard = new Keyboard();

        document.addEventListener('keydown', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);

        document.addEventListener('keyup', function (event) {
            keyboard.keyEvent(event.keyCode, event.type, this.ship);
        }.bind(this), false);
    }

    addPlanets() {
        let p=0,x=0,y=0;

        for(p in this.planets) {
            x = Math.random() * 10000;
            y = Math.random() * 800;
            this.planets[p].x = x;
            this.planets[p].y = y;
        }
    }

    addPolygons() {

        let self = this;
        let x,y;
        let i = 0;
        let points = 3;

        for (i; i < 30; i++) {
            x = Math.random() * 10000;
            y = Math.random() * 800;
            points = Math.random() * 8;
            points = points < 3 ? 3 : points;
            this.polygons.push(new Polygon(points, Math.floor(Math.random() * 50) + 10, x, y));
        }
    }

    addCircle() {
        let i=0;
        for (i; i < 30; i++) {
            this.objects.push(new Circle(CANVAS.width, CANVAS.height, i));
        }
    }

    update () {
        CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

        let t=0;

        for(t in this.polygons) {
            this.draw(this.polygons[t]);
            this.polygons[t].checkObjCollision(this.ship, CONTEXT);
            this.ship.checkObjCollision(this.polygons[t], CONTEXT);

            var objLength = this.objects.length;

            for (var i = 0; i < objLength; i++) {
                var obj = this.objects[i];

                for (var j = i + 1; j < objLength; j++) {
                    if (obj.checkCollision(this.objects[j])) {
                        obj.resolveCollision(obj, this.objects[j]);
                    }
                }

                obj.boundsCheck(obj);
                obj.moveVector = obj.velocity.scalarMultiplyNew(0.03);
                obj.move();

                this.polygons[t].checkObjCollision(obj, CONTEXT);
                this.ship.checkObjCollision(obj, CONTEXT);

                obj.draw(CONTEXT);//
                //this.redrawCircle(obj);
            }

            //   this.polygons[t].position.x -= 0.2;

        }

        CONTEXT.save();

        let p;
        for(p in this.planets) {
            CONTEXT.drawImage(this.planets[p].obj, this.planets[p].x, this.planets[p].y);
        }

        this.ship.update();
        this.drawShip(this.ship);
        CONTEXT.drawImage(this.station,1850,250);
        CONTEXT.restore();
    }

    drawShip(ship) {
        var coords = ship.getCoords();
        var cLength = coords.length;
        var exhaust = ['red', 'orange', 'yellow', 'purple', 'green'];
        var flame = [30, 31, 32, 33, 34, 35];


        //if(ship.sheild) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(coords[0].x, coords[0].y);
        // CONTEXT.translate(ship.position.x, ship.position.y);
        // CONTEXT.rotate(ship.rotation);

        /*
        CONTEXT.fillStyle = "yellow";
        CONTEXT.globalAlpha = 0.5;

        while (cLength--) {
            CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
        }

        CONTEXT.fill();
        CONTEXT.stroke();
        //}

        CONTEXT.fillStyle = "black";
        CONTEXT.fillText(ship.rotation,10, 10);
        CONTEXT.stroke();
        CONTEXT.closePath();
        */
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

    }

    draw (polygon) {
        let coords = polygon.getCoords();
        let cLength = coords.length;

        CONTEXT.save();
        CONTEXT.beginPath();
        CONTEXT.translate(polygon.x, polygon.y);
        CONTEXT.moveTo(coords[0].x,coords[0].y);
        CONTEXT.fillStyle = "white";
        CONTEXT.globalAlpha = 0.8;

        while (cLength--) {
            CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
        }
        CONTEXT.fill();
        CONTEXT.stroke();
        CONTEXT.restore();

        polygon.rotate()
    }

    redrawCircle (circle) {
        CONTEXT.fillStyle = circle.colour;
        CONTEXT.beginPath();
        CONTEXT.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
        CONTEXT.fill();
        CONTEXT.closePath();
    }
}
/*
var Main = function () {
    this.objects = [];
    this.mouse = {};
    this.objects = [];
    this.polygons = [];
    this.ship = null;
}

Main.prototype.setup = function () {

    this.craft = new Image();
    this.craft.src = "fighter.png";
    var self = this;
    var x,y;

    for (var i = 0; i < 35; i++) {
        x = Math.random() * 10000;
        y = Math.random() * 800;
        this.polygons.push(new Polygon(3 + Math.random() * 10, Math.floor(Math.random() * 50) + 10, x, y));
    }

    for (var i = 0; i < 30; i++) {
        this.objects.push(new Circle(CANVAS.width, CANVAS.height, i));
    }

    this.ship = new Player(4, 25, 200, 300);

    var keyboard = new Keyboard();

    document.addEventListener('keydown', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);

    document.addEventListener('keyup', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);
}

Main.prototype.update = function () {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

    for(var t in this.polygons) {
        this.draw(this.polygons[t]);
        this.polygons[t].checkObjCollision(this.ship, CONTEXT);
        this.ship.checkObjCollision(this.polygons[t], CONTEXT);

        var objLength = this.objects.length;

        for (var i = 0; i < objLength; i++) {
            var obj = this.objects[i];

            for (var j = i + 1; j < objLength; j++) {
                if (obj.checkCollision(this.objects[j])) {
                    obj.resolveCollision(obj, this.objects[j]);
                }
            }

            obj.boundsCheck(obj);
            obj.moveVector = obj.velocity.scalarMultiplyNew(0.03);
            obj.move();

            this.polygons[t].checkObjCollision(obj, CONTEXT);
            this.ship.checkObjCollision(obj, CONTEXT);

            this.redrawCircle(obj);
        }

     //   this.polygons[t].position.x -= 0.2;

    }

    CONTEXT.save();

    this.ship.update();
    this.drawShip(this.ship);

    CONTEXT.restore();
}

Main.prototype.drawShip = function(ship) {
    var coords = ship.getCoords();
    var cLength = coords.length;
    var exhaust = ['red', 'orange', 'yellow', 'purple', 'green'];
    var flame = [30, 31, 32, 33, 34, 35];


    //if(ship.sheild) {
        CONTEXT.beginPath();
        CONTEXT.moveTo(coords[0].x, coords[0].y);
       // CONTEXT.translate(ship.position.x, ship.position.y);
       // CONTEXT.rotate(ship.rotation);

        CONTEXT.fillStyle = "yellow";
        CONTEXT.globalAlpha = 0.5;

        while (cLength--) {
            CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
        }

        CONTEXT.fill();
        CONTEXT.stroke();
    //}

    CONTEXT.fillStyle = "black";
    CONTEXT.fillText(ship.rotation,10, 10);
    CONTEXT.stroke();
    CONTEXT.closePath();

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

}

Main.prototype.draw = function(polygon) {
    var coords = polygon.getCoords();
    var cLength = coords.length;

    CONTEXT.save();
    CONTEXT.beginPath();
    CONTEXT.translate(polygon.x, polygon.y);
    CONTEXT.moveTo(coords[0].x,coords[0].y);
    CONTEXT.fillStyle = "grey";
    CONTEXT.globalAlpha = 0.5;

    while (cLength--) {
        CONTEXT.lineTo(coords[cLength].x, coords[cLength].y);
    }
    CONTEXT.fill();
    CONTEXT.stroke();
    CONTEXT.restore();

    polygon.rotate()
}

Main.prototype.redrawCircle = function(circle) {
    CONTEXT.fillStyle = circle.colour;
    CONTEXT.beginPath();
    CONTEXT.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
    CONTEXT.fill();
    CONTEXT.closePath();
}
*/