
var canvas  = document.getElementById("canvas");
var context = this.canvas.getContext("2d");

var Main = function () {
    this.objects = [];
    this.mouse = {};
    this.objects = [];
    this.polygons = [];
}

Main.prototype.setup = function () {
    var numballs = 12, obj;
    var radius = 35;
    var a = (Math.PI * 2) / 3;
    var sides = 0;
    // Circles
    do {
        this.objects.push(new Circle(canvas.width, canvas.height, numballs));
    } while (--numballs);

    for(var p= 0; p<7; p++) {
        a = (Math.PI * 2) / 3+p;
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height);

        this.polygons.push(new Polygon(3+p, Math.floor(Math.random() * 50) + 10, x, y));
    }
}

Main.prototype.update = function () {

    context.clearRect(0, 0, canvas.width, canvas.height);

    for(var t in this.polygons) {

        this.draw(this.polygons[t]);

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

            this.redrawCircle(obj);
        }
    }
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
