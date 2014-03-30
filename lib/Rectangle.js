/**
 * Rectangle class
 *
 */ 

var Rectangle = function(a, b, c, d) {
	this.A      = new Vector2D(a.x, a.y);
	this.B      = new Vector2D(b.x, b.y);
	this.C      = new Vector2D(c.x, c.y);
    this.D      = new Vector2D(d.x, d.y);
	this.angle  = null;
	this.colour = "green";
}

Rectangle.prototype.getCenter = function() {
    var center = new Vector2D(this.A.x, this.A.y);

    center.add(this.B);
    center.add(this.C);
    center.add(this.D);
    center.scalarDivide(4);

    return center;
}

Rectangle.prototype.rotate = function(radian) {
    var center = this.getCenter();

    this.A.rotate(center, this.angle);
    this.B.rotate(center, this.angle);
    this.C.rotate(center, this.angle);
    this.D.rotate(center, this.angle);
}

Rectangle.prototype.checkObjCollision = function(object, context) {
    this.checkObj(this.A, this.B, object, context);
    this.checkObj(this.B, this.C, object, context);
    this.checkObj(this.C, this.D, object, context);
    this.checkObj(this.D, this.A, object, context);
}


Rectangle.prototype.checkObj = function (a,b,object, context) {
    var AB = new Vector2D(b.x - a.x, b.y - a.y);
    var AX = new Vector2D(object.position.x - a.x, object.position.y - a.y);
    var u = ((AX.x * AB.x) + (AX.y * AB.y)) / Math.pow(AB.magnitude(), 2);
        
	if (u >= 0 && u <= 1) {
		var P = new Vector2D(a.x, a.y);
		P.add(AB.scalarMultiplyNew(u));
		var XP = P.subtractNew(object.position);
		var N = new Vector2D(AB.y, -AB.x);
	
		N.normalise();
	
		if (XP.magnitude() <= object.radius) {
			var NV = N.dot(object.velocity);
			var NV2 = N.scalarMultiplyNew(NV * 2);
			object.velocity.subtract(NV2);
		}
	
		var danger = (object.radius * 5);
	
		if (XP.magnitude() <= danger) {
			context.beginPath();
			context.moveTo(P.x, P.y);
			context.lineTo(P.x + (danger*N.x), P.y + (danger*N.y));
			context.globalAlpha = 1.25;
			context.strokeStyle = "red";
            context.lineWidth = 3;
			context.stroke();
			context.beginPath();
			context.arc(P.x, P.y, 4, 0, Math.PI * 2, true);
			context.closePath();
			context.strokeStyle = "red";
            context.stroke();
            context.lineWidth = 1;

        }
	}
}
