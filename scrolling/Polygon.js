"use strict";

/**
 * Polygon class
 *
 */

class Polygon {
    constructor(sides, radius, offsetX, offsetY) {
        if (sides < 3) return;

        this.coords = [];
        this.color  = 'grey';

        let a = (Math.PI * 2)/sides;
        let i = 0;

        for (i; i < sides; i++) {
            this.coords.push(new Vector2D(offsetX - radius * Math.cos(a*i), offsetY - radius * Math.sin(a*i)));
        }

        this.center   = this.getCenter();
        this.position = this.center;
        this.radian   = 0.005;
        this.radian   *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.height   = 800;
        this.width    = 10000;
    }

    update() {
        let right = this.width, left = 0,
            top = 0, bottom = this.height;

        if (this.position.x > right) {
            this.position.x = left;
        }
        else if (this.position.x < left) {
            this.position.x = right;
        }
        if (this.position.y > bottom) {
            this.position.y = top;
        }
        else if (this.position.y < top) {
            this.position.y = bottom;
        }

        this.position.x -= 0.5;
        this.position.y = 0;

        this.coords.forEach(function(coords) {
            coords.x -= 0.1;
        });
    }

    getCoords() {
        return this.coords;
    }

    getCenter() {
        let coords = this.getCoords();
        let center = new Vector2D(coords[0].x, coords[0].y);
        let c = 0;

        for(c in coords){
            if(c != 0) {
                center.add(coords[c]);
            }
        }

        center.scalarDivide(coords.length);

        return center;
    }

    rotate() {
        let i = 0;

        for(i in this.coords) {
            this.coords[i].rotate(this.center, this.radian);
        }
    }

    checkObjCollision(object, context) {
        let cLength = this.coords.length-1;
        let i = 0;

        for (i; i <= cLength; i++) {
            if(i+1 <= cLength) {
                this.checkObj(this.coords[i], this.coords[i + 1], object, context);
            }
            else{
                this.checkObj(this.coords[i], this.coords[0], object, context);
            }
        }
    }

    checkObj (a,b,object, context) {
        let AB = new Vector2D(b.x - a.x, b.y - a.y);
        let AX = new Vector2D(object.position.x - a.x, object.position.y - a.y);
        let u = ((AX.x * AB.x) + (AX.y * AB.y)) / Math.pow(AB.magnitude(), 2);

        if (u >= 0 && u <= 1) {
            let P = new Vector2D(a.x, a.y);
            P.add(AB.scalarMultiplyNew(u));
            let XP = P.subtractNew(object.position);
            let N = new Vector2D(AB.y, -AB.x);

            N.normalise();

            if (XP.magnitude() <= object.radius) {
                let NV  = N.dot(object.velocity);
                let NV2 = N.scalarMultiplyNew(NV * 2);
                object.velocity.subtract(NV2);
            }

            let danger = (object.radius*4);

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
}

/*
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
    this.height     = 600;
    this.width      = 800;
}

Polygon.prototype.update = function() {
    var right = this.width, left = 0,
        top = 0, bottom = this.height;

    if (this.position.x > right) {
        this.position.x = left;
    }
    else if (this.position.x < left) {
        this.position.x = right;
    }
    if (this.position.y > bottom) {
        this.position.y = top;
    }
    else if (this.position.y < top) {
        this.position.y = bottom;
    }

    this.position.x -= 0.5;
    this.position.y = 0;

    var self = this;

    this.coords.forEach(function(coords) {
        coords.x -= 0.1;
    });
}

Polygon.prototype.getCoords = function() {
    return this.coords;
}

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

Polygon.prototype.rotate = function() {

    for(var i in this.coords) {
        this.coords[i].rotate(this.center, this.radian);
    }
}

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

*/
