"use strict";

class Circle {
    constructor(width, height, id) {
        var rad = Math.floor(Math.random() * 30);
        var colours = ['red', 'green', 'yellow', 'black', 'silver', 'orange', 'pink'];

        var x = Math.floor(Math.random() * width),
            y = Math.floor(Math.random() * height),
            vx = Math.floor(Math.random() * 10),
            vy = Math.floor(Math.random() * 10);

        this.position   = new Vector2D(x,y);
        this.velocity   = new Vector2D(vx, vy);
        this.moveVector = new Vector2D(0, 0);

        this.radius     = Math.floor(Math.random() * 10) + 5;
        this.mass       = Math.floor(Math.random() * 1) + 5;
        this.colour     = colours[Math.floor(Math.random() * colours.length)];

        this.id         = id;
    }

    move() {
        this.position.x = this.position.x + (this.moveVector.x);
        this.position.y = this.position.y + (this.moveVector.y);
    }

    checkCollision(other) {
        var separationVector = other.position.subtractNew(this.position);
        var distance = separationVector.magnitude();
        var sumRadii = (this.radius + other.radius);
        var moveVector = this.moveVector.subtractNew(other.moveVector);

        distance -= sumRadii;

        if (moveVector.magnitude() < distance) {
            return false;
        }

        // Normalize the movevector
        var N = moveVector.copy();
        N.normalise();

        // D = N . C = ||C|| * cos(angle between N and C)
        var D = N.dot(separationVector);

        // Another early escape: Make sure that A is moving
        // towards B! If the dot product between the movevec and
        // B.center - A.center is less that or equal to 0,
        // A isn't isn't moving towards B
        if (D <= 0) {
            return false;
        }

        var F = (distance * distance) - (D * D);

        // Escape test: if the closest that A will get to B
        // is more than the sum of their radii, there's no
        // way they are going collide
        var sumRadiiSquared = sumRadii * sumRadii;
        if (F >= sumRadiiSquared) {
            return false;
        }

        // We now have F and sumRadii, two sides of a right triangle.
        // Use these to find the third side, sqrt(T)
        var T = sumRadiiSquared - F;

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
        var X = 1;
        for (var i = 0; i < 5; i++)
            X = X - ((X * X - T) / (2 * X));

        T = X;
        var distance = D - T; //Math.sqrt(T);

        // Get the magnitude of the movement vector
        var mag = moveVector.magnitude()

        // Finally, make sure that the distance A has to move
        // to touch B is not greater than the magnitude of the
        // movement vector.
        if (mag < distance) {
            return false;
        }

        moveVector.normalise();
        moveVector.scalarMultiply(distance);

        var ratio = moveVector.magnitude() / mag;
        moveVector.scalarMultiply(ratio);
        other.moveVector.scalarMultiply(ratio);

        return true;
    }

    resolveCollision(a, b) {
        var n = a.position.subtractNew(b.position);

        //console.log("Enter");

        n.normalise();
        // Find the length of the component of each of the movement
        // vectors along n.
        // a1 = v1 . n
        // a2 = v2 . n
        var a1 = a.velocity.dot(n);
        var a2 = b.velocity.dot(n);
        //console.log("pass2");
        // Using the optimized version,
        // optimizedP =  2(a1 - a2)
        //              -----------
        //                m1 + m2
        var optimizedP = (2.0 * (a1 - a2)) / (a.mass + b.mass);

        // Calculate v1', the new movement vector of circle1
        // v1' = v1 - optimizedP * m2 * n
        //var v1' = v1 - optimizedP * circle2.mass * n;

        var nv_a = a.velocity.subtractNew(n.scalarMultiplyNew(optimizedP * b.mass));

        // Calculate v1', the new movement vector of circle1
        // v2' = v2 + optimizedP * m1 * n
        //Vector v2' = v2 + optimizedP * circle1.mass * n;
        var nv_b = b.velocity.addNew(n.scalarMultiplyNew(optimizedP * a.mass));

        //console.log("pass3");

        //console.log("nv_a", nv_a);
        //console.log("nv_b", nv_b);

        a.velocity = nv_a;
        b.velocity = nv_b;

        // console.log("pass4", a.velocity);
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
}

/*
var Circle = function(width, height, id) {
    var rad = Math.floor(Math.random() * 30);
    var colours = ['red', 'green', 'yellow', 'black', 'silver', 'orange', 'pink'];

    var x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height),
        vx = Math.floor(Math.random() * 10),
        vy = Math.floor(Math.random() * 10);

	this.position   = new Vector2D(x,y);
    this.velocity   = new Vector2D(vx, vy);
    this.moveVector = new Vector2D(0, 0);

    this.radius     = Math.floor(Math.random() * 10) + 5;
    this.mass       = Math.floor(Math.random() * 1) + 5;
    this.colour     = colours[Math.floor(Math.random() * colours.length)];

    this.id         = id;
}

Circle.prototype.move = function() {
    this.position.x = this.position.x + (this.moveVector.x);
    this.position.y = this.position.y + (this.moveVector.y);
}

Circle.prototype.checkCollision = function(other) {
    var separationVector = other.position.subtractNew(this.position);
    var distance = separationVector.magnitude();
    var sumRadii = (this.radius + other.radius);
    var moveVector = this.moveVector.subtractNew(other.moveVector);
    
    distance -= sumRadii;
    
    if (moveVector.magnitude() < distance) {
        return false;
    }
    
    // Normalize the movevector
    var N = moveVector.copy();
    N.normalise();
    
    // D = N . C = ||C|| * cos(angle between N and C)
    var D = N.dot(separationVector);

    // Another early escape: Make sure that A is moving 
    // towards B! If the dot product between the movevec and 
    // B.center - A.center is less that or equal to 0, 
    // A isn't isn't moving towards B
    if (D <= 0) {
        return false;
    }

    var F = (distance * distance) - (D * D);

    // Escape test: if the closest that A will get to B 
    // is more than the sum of their radii, there's no 
    // way they are going collide
    var sumRadiiSquared = sumRadii * sumRadii;
    if (F >= sumRadiiSquared) {
        return false;
    }

    // We now have F and sumRadii, two sides of a right triangle. 
    // Use these to find the third side, sqrt(T)
    var T = sumRadiiSquared - F;

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
    var X = 1;
    for (var i = 0; i < 5; i++)
     X = X - ((X*X - T) / (2*X));
   
    T = X;
    var distance = D - T; //Math.sqrt(T);

    // Get the magnitude of the movement vector
    var mag = moveVector.magnitude()

    // Finally, make sure that the distance A has to move 
    // to touch B is not greater than the magnitude of the 
    // movement vector.
    if (mag < distance) {
        return false;
    }
    
    moveVector.normalise();
    moveVector.scalarMultiply(distance);

    var ratio = moveVector.magnitude() / mag;
    moveVector.scalarMultiply(ratio);
    other.moveVector.scalarMultiply(ratio);
    
    return true;
}

Circle.prototype.resolveCollision = function (a, b) {
    var n = a.position.subtractNew(b.position);

    //console.log("Enter");

    n.normalise();
    // Find the length of the component of each of the movement
    // vectors along n.
    // a1 = v1 . n
    // a2 = v2 . n
    var a1 = a.velocity.dot(n);
    var a2 = b.velocity.dot(n);
    //console.log("pass2");
    // Using the optimized version,
    // optimizedP =  2(a1 - a2)
    //              -----------
    //                m1 + m2
    var optimizedP = (2.0 * (a1 - a2)) / (a.mass + b.mass);

    // Calculate v1', the new movement vector of circle1
    // v1' = v1 - optimizedP * m2 * n
    //var v1' = v1 - optimizedP * circle2.mass * n;

    var nv_a = a.velocity.subtractNew(n.scalarMultiplyNew(optimizedP * b.mass));

    // Calculate v1', the new movement vector of circle1
    // v2' = v2 + optimizedP * m1 * n
    //Vector v2' = v2 + optimizedP * circle1.mass * n;
    var nv_b = b.velocity.addNew(n.scalarMultiplyNew(optimizedP * a.mass));

    //console.log("pass3");

    //console.log("nv_a", nv_a);
    //console.log("nv_b", nv_b);

    a.velocity = nv_a;
    b.velocity = nv_b;

    // console.log("pass4", a.velocity);
}

Circle.prototype.boundsCheck = function (obj) {

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
    */