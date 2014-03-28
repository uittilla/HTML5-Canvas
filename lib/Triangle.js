/**
 * Triangle class
 *
 */ 

var Triangle = function(a, b, c) {
	this.A      = new Vector2d(a.x, a.y);
	this.B      = new Vector2d(b.x, b.y);
	this.c      = new Vector2d(c.x, c.y);
	this.angle  = null;
	this.colour = "#000000";
}

Triangle.prototype.rotate = function(radian) {
    var centre = new Vector2d(this.A.x, this.A.y);

    centre.add(this.B);
    centre.add(this.C);
    centre.scalarDivide(3);
    this.A.rotate(centre, radianAngle);
    this.B.rotate(centre, radianAngle);
    this.C.rotate(centre, radianAngle);
}

Triangle.prototype.checkObjCollision = function(object, context) {
    this.checkObj(this.A, this.B, object, context);
    this.checkObj(this.B, this.C, object, context);
    this.checkObj(this.C, this.A, object, context);
}


Triangle.prototype.checkObj = function (a,b,object, context) {
    var AB = new Vector2d(b.x - a.x, b.y - a.y);
    var AX = new Vector2d(object.position.x - a.x, object.position.y - a.y);
    var u = ((AX.x * AB.x) + (AX.y * AB.y)) / Math.pow(AB.magnitude(), 2);
        
	if (u >= 0 && u <= 1) {
		var P = new Vector2d((a.x, a.y);
		P.add(AB.scalarMultiplyNew(u));
		var XP = P.subtractNew(object.position);
		var N = new Vector2d(AB.y, -AB.x);
	
		N.normalise();
	
		if (XP.magnitude() <= object.radius) {
			var NV = N.dot(ball.velocity);
			var NV2 = N.scalarMultiplyNew(NV * 2);
			object.velocity.subtract(NV2);
		}
	
		var danger = (object.radius * 5);
	
		if (XP.magnitude() <= danger) {			
			context.beginPath();
			context.moveTo(P.x, P.y);
			context.lineTo(P.x + (25*N.x), P.y + (25*N.y));
			context.globalAlpha = 1.25;
			context.strokeStyle = "red";
			context.stroke();
			context.beginPath();
			context.arc(P.x, P.y, 4, 0, Math.PI * 2, true);
			context.closePath();
			context.strokeStyle = "red";
			context.stroke();
		}
	}
}
