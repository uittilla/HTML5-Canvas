var Circle = function(ball) {
	this.position   = new Vector2d(ball.pos.x,ball.pos.y);
    this.velocity   = Object.create(ANIMATE.Vector2D).init(ball.vel.x, ball.vel.y);
    this.moveVector = Object.create(ANIMATE.Vector2D).init(0, 0); 
    this.radius     = ball.rad;
    this.mass       = ball.mass;
    this.colour     = ball.col;  
    this.id         = ball.id;
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