
var canvas  = document.getElementById("canvas");
var context = this.canvas.getContext("2d");

var keys = {
    KEY_NAME_THRUSTER:"up",
    KEY_NAME_LEFT:"left",
    KEY_NAME_RIGHT:"right",
    KEY_NAME_SPACE:"space",
    KEY_TYPE_UP:"keyup",
    KEY_TYPE_DOWN:"keydown",
    KEY_NAME_CTRL:"control"
};

var Main = function () {
    this.objects = [];
    this.mouse = {};
    this.objects = [];
    this.polygons = [];
}

Main.prototype.setup = function () {
    var numballs = 5, obj;
    var radius = 20;
    var a = (Math.PI * 2) / 3;
    var sides = 0;
    do {
        obj = this.circle();
        obj.id = numballs;

        var Obj = new Circle(obj);
        this.objects.push(Obj);

    } while (--numballs);

    for(var p= 0; p<10; p++) {
        sides = Math.round(Math.random() * 8);
        if(sides < 3)
            sides = 3;

        a = (Math.PI * 2) / sides;

        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height);

        this.polygons.push(new Polygon(sides, 35, x, y));
    }


    document.addEventListener('keydown', function (evt) {
        this.keyPress(evt, this.triangle);
    }.bind(this), false);

    document.addEventListener('keyup', function (evt) {
        this.keyPress(evt, this.triangle);
    }.bind(this), false);
}

Main.prototype.circle = function () {
    var rad = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    var colours = ['red', 'green', 'yellow', 'black', 'silver', 'orange', 'pink'];

    return {
        pos: {
            x: Math.floor(Math.random() * (canvas.width - rad + 1)) + rad,
            y: Math.floor(Math.random() * (canvas.width - rad + 1)) + rad
        },
        vel: {
            x: Math.floor(Math.random() * (50 - rad + 1)) + rad,
            y: Math.floor(Math.random() * (50 - rad + 1)) + rad
        },
        rad: rad,
        mass: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
        col: colours[Math.floor(Math.random() * colours.length)]
    };
}

Main.prototype.getMousePos = function (element, evt) {
    // get canvas position
    var obj = element,
        top = 0,
        left = 0;

    while (obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }

    // return relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;

    return { x: mouseX, y: mouseY };
}

Main.prototype.addball = function () {
    var obj = this.circle();
    obj.id = this.balls.length + 1;
    obj.pos.x = this.mouse.x;
    obj.pos.y = this.mouse.y;

    this.objects.push(new Circle(Obj));

}

Main.prototype.update = function () {

    context.clearRect(0, 0, canvas.width, canvas.height);
   // this.redrawRectangle(this.rectangle);
   // this.triangle.update();
    //this.draw(this.polygon);
    for(var t in this.polygons) {
        this.draw(this.polygons[t]);

        var objLength = this.objects.length;

        for (var i = 0; i < objLength; i++) {
            var obj = this.objects[i];

            obj.boundsCheck(obj);
            this.polygons[t].checkObjCollision(obj, context);
           // this.rectangle.checkObjCollision(obj, context);

            obj.moveVector = obj.velocity.scalarMultiplyNew(0.03);
            obj.move();
            this.redrawCircle(obj);

            for (var j = i + 1; j < objLength; j++) {
                if (obj.checkCollision(this.objects[j])) {
                    obj.resolveCollision(obj, this.objects[j]);
                }
            }
        }
    }

}

Main.prototype.draw = function(polygon) {
    context.save();
    context.beginPath();
    var coords = polygon.getCoords();
    context.moveTo(coords[0].x,coords[0].y);

    var cLength = coords.length;

    while (cLength--) {
        context.lineTo(coords[cLength].x, coords[cLength].y);
    }



    context.strokeStyle = "red";
    context.stroke();
    context.restore();
}

Main.prototype.redrawTriangle = function(triangle) {
    context.save();
    context.beginPath();
    context.moveTo(triangle.A.x,triangle.A.y);

    context.strokeText("A", triangle.A.x, triangle.A.y);
    context.strokeText("B", triangle.B.x, triangle.B.y);
    context.strokeText("C", triangle.C.x, triangle.C.y);

    context.lineTo(triangle.B.x, triangle.B.y);
    context.lineTo(triangle.C.x, triangle.C.y);
    context.lineTo(triangle.A.x, triangle.A.y);

    context.strokeStyle = "red";
    context.stroke();
    context.restore();
}

Main.prototype.redrawCircle = function(circle) {
    context.globalAlpha = 0.25;
    context.strokeStyle = "black";
    context.fillStyle = circle.colour;
    context.beginPath();
    context.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
    context.fill();
    context.closePath();
}



/*Main.prototype.keyPress = function (evt, obj) {
    switch (evt.keyCode) {
        case 38:  *//* Up arrow was pressed *//*
            this.triangle.thrust += 0.003;
        break;
        case 37:  *//* Left arrow was pressed *//*
            this.triangle.angle -= 0.2;
            this.triangle.rotate();
        break;
        case 39:  *//* Right arrow was pressed *//*
            this.triangle.angle += 0.2;
            this.triangle.rotate();
        break;
    }
}*/

Main.prototype.keyPress = function (evt, obj) {
    var keyName = String.fromCharCode(evt.keyCode).toLowerCase();

    if (evt.keyCode == 37) { keyName = keys.KEY_NAME_LEFT; }     // Left arrow key
    if (evt.keyCode == 39) { keyName = keys.KEY_NAME_RIGHT; }    // Right arrow key
    if (evt.keyCode == 38) { keyName = keys.KEY_NAME_THRUSTER; } // Up arrow key
    if (evt.keyCode == 32) { keyName = keys.KEY_NAME_SPACE; }    // space bar
    if (evt.keyCode == 17) { keyName = keys.KEY_NAME_CTRL; }     // left control
    for(var t in this.triangles) {
        this.move(evt.type, keyName, this.triangles[t]);
    }
}

Main.prototype.move = function(keyType, keyName, triangle) {
    console.log(keyType, keyName)
    // Thruster is off
    if (keyName == keys.KEY_NAME_THRUSTER && keyType == keys.KEY_TYPE_UP) {
        triangle.thrust = 0;
    }
    // Thruster on
    if(keyName == keys.KEY_NAME_THRUSTER && keyType == keys.KEY_TYPE_DOWN) {
        triangle.thrust += 0.003;
    }
    // Turning left
    if (keyName == keys.KEY_NAME_LEFT && keyType == keys.KEY_TYPE_DOWN) {
        triangle.angle = -0.05;
        triangle.rotate();
    }
    // Turning right
    if (keyName == keys.KEY_NAME_RIGHT && keyType == keys.KEY_TYPE_DOWN) {
        triangle.angle = 0.05;
        triangle.rotate();
    }
    // Stop turning
    if ((keyName == keys.KEY_NAME_RIGHT || keyName == keys.KEY_NAME_LEFT ) && keyType == keys.KEY_TYPE_UP) {
        this.vr = 0;
    }
    // update here to allow thrusting turning and firing
    if (keyName == keys.KEY_NAME_SPACE && keyType == keys.KEY_TYPE_DOWN) {
        var shot = this.missile();
        this.shots.push(shot);
    }
    else if(keyName == keys.KEY_NAME_SPACE && keyType == keys.KEY_TYPE_UP) {

    }

    if(keyName == keys.KEY_NAME_CTRL && keyType == keys.KEY_TYPE_DOWN) {
        this.sheild = true;
    }

    if(keyName == keys.KEY_NAME_CTRL && keyType == keys.KEY_TYPE_UP) {
        this.sheild = false;
    }
}
