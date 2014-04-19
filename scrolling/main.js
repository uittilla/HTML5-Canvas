
var canvas  = document.getElementById("canvas");
var context = this.canvas.getContext("2d");

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

    for(var p= 0; p<10; p++) {
        var a = (Math.PI * 2) / 3+p;
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height);

        this.polygons.push(new Polygon(3+p, Math.floor(Math.random() * 50) + 10, x, y));
        this.objects.push(new Circle(canvas.width, canvas.height, p));
    }

    this.ship = new Player(12, 25, 200, 300);

    var keyboard = new Keyboard();

    document.addEventListener('keydown', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);

    document.addEventListener('keyup', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);
}

Main.prototype.update = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(var t in this.polygons) {
        this.draw(this.polygons[t]);
        this.polygons[t].checkObjCollision(this.ship, context);
        this.ship.checkObjCollision(this.polygons[t], context);

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

            this.polygons[t].checkObjCollision(obj, context);
            this.ship.checkObjCollision(obj, context);

            this.redrawCircle(obj);
        }

     //   this.polygons[t].position.x -= 0.2;

    }

    this.ship.update();
    this.drawShip(this.ship);
}

Main.prototype.drawShip = function(ship) {
    var coords = ship.getCoords();
    var cLength = coords.length;
    var exhaust = ['red', 'orange', 'yellow', 'purple', 'green'];
    var flame = [30, 31, 32, 33, 34, 35];

    context.save();
    if(ship.sheild) {
        context.beginPath();
        context.moveTo(coords[0].x, coords[0].y);
        context.rotate(this.rotation);

        context.fillStyle = "yellow";
        context.globalAlpha = 0.5;
        while (cLength--) {
            context.lineTo(coords[cLength].x, coords[cLength].y);
        }
        //context.fill();
        context.stroke();
    }

    context.fillStyle = "black";
    context.fillText(ship.rotation,10, 10);
    context.stroke();
    context.closePath();

    context.lineWidth = 1;
    context.translate(ship.position.x, ship.position.y);
    context.rotate(ship.rotation);

    context.globalAlpha = 1;
    context.beginPath();
    context.drawImage(this.craft, -20, -23);
    context.closePath();

    if (ship.thruster) {
        context.beginPath();
        context.moveTo(-17.5, -2.5);
        context.lineTo(-flame[Math.floor(flame.length * Math.random())], 0);
        context.lineTo(-17.5, 2);
        context.fillStyle = exhaust[Math.floor(exhaust.length * Math.random())];
        context.fill();
        context.stroke();
        context.closePath();
    }

    context.restore();
}

Main.prototype.draw = function(polygon) {
    var coords = polygon.getCoords();
    var cLength = coords.length;

    context.save();
    context.beginPath();
    context.translate(polygon.x, polygon.y);
    context.moveTo(coords[0].x,coords[0].y);
    context.fillStyle = "grey";
    context.globalAlpha = 0.5;

    while (cLength--) {
        context.lineTo(coords[cLength].x, coords[cLength].y);
    }
    context.fill();
    context.stroke();
    context.restore();

    polygon.rotate()
}

Main.prototype.redrawCircle = function(circle) {
    context.fillStyle = circle.colour;
    context.beginPath();
    context.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
}
