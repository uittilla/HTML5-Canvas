/**
 * Polygon class
 *
 */ 

var Polygon = function(sides, radius, offsetX, offsetY) {
    if (sides < 3) return;
    this.coords = [];
    this.color = 'grey';
    var a = (Math.PI * 2)/sides;
    for (var i = 0; i < sides; i++) {
        this.coords.push(new Vector2D(offsetX - radius*Math.cos(a*i),offsetY - radius*Math.sin(a*i)));
    }

    this.center = this.getCenter();
    this.position = this.center;
    this.radian = 0.005;
    this.radian *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
}

/**
 * Returns coordinates of this polygon's points
 * @returns {Array}
 */
Polygon.prototype.getCoords = function() {
    return this.coords;
}

/**
 * Returns x,y of the polygon center
 * @returns {Vector2D}
 */
Polygon.prototype.getCenter = function() {
    var coords = this.getCoords();
    var center = new Vector2D(coords[0].x, coords[0].y);

    for(var c in coords){
        if(c != 0) {
            center.add(coords[c]);
        }
    }

    center.scalarDivide(coords.length);

    return center;
}

/**
 * Rotates the polygon
 */
Polygon.prototype.rotate = function() {

    for(var i in this.coords) {
        this.coords[i].rotate(this.center, this.radian);
    }
}

/**
 * Check Oject collisions
 * @param object
 * @param context
 */
Polygon.prototype.checkObjCollision = function(object, context) {
  var cLength = this.coords.length-1;

    for (var i = 0; i <= cLength; i++) {
        if(i+1 <= cLength) {
            this.checkObj(this.coords[i], this.coords[i + 1], object, context);
        }
        else{
            this.checkObj(this.coords[i], this.coords[0], object, context);
        }
    }
}

/**
 * Checks each coorinate point and magnitiude
 * Resolves collisions and provides inidcators of danger
 * @param a
 * @param b
 * @param object
 * @param context
 */
Polygon.prototype.checkObj = function (a,b,object, context) {
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
	
		var danger = (object.radius*4);
		if (XP.magnitude() < danger) {
			context.beginPath();
			context.moveTo(P.x, P.y);
			context.lineTo(P.x + (danger*N.x), P.y + (danger*N.y));
			context.strokeStyle = "red";
            context.lineWidth = 1;
            context.globalAlpha = 0.5;
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
