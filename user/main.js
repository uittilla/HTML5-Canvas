
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
    for(var p= 0; p<17; p++) {
        var a = (Math.PI * 2) / 3+p;
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height);

        this.polygons.push(new Polygon(3+p, Math.floor(Math.random() * 50) + 10, x, y));
    }

    this.ship = new Player(3, 15, 200, 300);

    var keyboard = new Keyboard();

    document.addEventListener('keydown', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);

    document.addEventListener('keyup', function (event) {
        keyboard.keyEvent(event.keyCode, event.type, this.ship);
    }.bind(this), false);
}

Main.prototype.update = function () {
    console.log(this.ship);


    context.clearRect(0, 0, canvas.width, canvas.height);

    for(var t in this.polygons) {

        this.draw(this.polygons[t]);
        this.polygons[t].checkObjCollision(this.ship, context);
        this.ship.checkObjCollision(this.polygons[t], context);
    }

    this.ship.position = this.ship.getCenter();

    this.ship.update();
    this.drawShip(this.ship);
}

Main.prototype.drawShip = function(ship) {
    var coords = ship.getCoords();
    var cLength = coords.length;

    context.save();
    context.beginPath();
    context.moveTo(coords[0].x,coords[0].y);
    context.fillStyle = "yellow";
    context.globalAlpha = 0.5;

    while (cLength--) {
        context.lineTo(coords[cLength].x, coords[cLength].y);
    }
    context.fill();
    context.stroke();
    context.restore();
}

Main.prototype.draw = function(polygon) {
    var coords = polygon.getCoords();
    var cLength = coords.length;

    context.save();
    context.beginPath();

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
