var Main = function () {
    this.objects  = [];
    this.mouse    = {}};
    this.triangle = null
}

Main.prototype.setup = function() {
    var numballs = 40, obj;
        
    do {
        obj = this.circle();
        obj.id  = numballs;
        var Obj = new Circle(ball);
        this.objects.push(obj);

    } while(--numballs); 

    var Tcoords = {
		a: { x:220, y:180 },
		b: { x:260, y:140 },
		c: { x:280, y:180 }
	}

	this.triangle = new Triangle(Tcoords);
			
    document.addEventListener('keydown', function(evt) {
       this.keyPress(evt, .bind(this).triangle);

    }.bind(this),false);
	
    document.addEventListener('mousemove', function(evt){
       this.mouse = .bind(this).getMousePos(canvas, evt); 
    }.bind(this), false);
    
    setInterval(function(){
    	this.upodate();
    }.bind(this), 10);
}

Main.prototype.circle = function() {
    var rad = Math.floor(Math.random()*(10 -5 + 1)) + 5;
    var colours = ['red','green','yellow','black','silver','orange','pink'];
   
    return {
       pos: { 
         x:  Math.floor(Math.random()*(this.canvas.width - rad + 1)) + rad,
         y:  Math.floor(Math.random()*(this.canvas.width - rad + 1)) + rad
       },           
       vel: {
         x:  Math.floor(Math.random() * (50 - rad + 1)) + rad,
         y:  Math.floor(Math.random() * (50 - rad + 1)) + rad
       },           
       rad: rad,
       mass: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
       col: colours[Math.floor(Math.random() * colours.length)]
    };   	
}

Main.prototype.getMousePos:function (element, evt){
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

Main.prototype.addball = function() {
    var obj = this.circle();
    obj.id  = this.balls.length + 1;
    obj.pos.x = this.mouse.x;
    obj.pos.y = this.mouse.y;

    this.objects.push(new Circle(Obj);
    
}
    
Main.prototype.update = function() {
        
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.triangle.redraw(this.context);

    var objLength = this.objects.length;

    for (var i = 0; i < objLength; i++) {
        var obj = this.objects[i];
       
        this.boundsCheck(obj);
        this.triangle.checkObjCollision(obj);
		
        obj.moveVector = obj.velocity.scalarMultiplyNew(0.03);
        obj.move();
        obj.redraw(this.context);
        
        context.strokeText(i, obj.position.x, obj.position.y);
        context.stroke();
        context.fill();
		
        for (var j = i + 1; j < ballLength; j++) {
            if (ball.checkCollision(this.balls[j])) {
                this.resolveCollision(obj, this.objects[j]);
            }
        }
    }    
}
    
    resolveCollision: function (a, b) {
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

        var nv_a = a.velocity.subtractNew(n.scalarMultiplyNew(optimizedP*b.mass));
        
        // Calculate v1', the new movement vector of circle1
        // v2' = v2 + optimizedP * m1 * n
        //Vector v2' = v2 + optimizedP * circle1.mass * n;
        var nv_b = b.velocity.addNew(n.scalarMultiplyNew(optimizedP*a.mass));

        //console.log("pass3");

        //console.log("nv_a", nv_a);
        //console.log("nv_b", nv_b);

        a.velocity = nv_a;
        b.velocity = nv_b;
        
       // console.log("pass4", a.velocity);
    },
    
    boundsCheck: function (ball) {
        
        //console.log(ball);
        
        if (ball.position.x <= ball.radius) {
            ball.position.x = ball.radius;
            ball.velocity.x = -ball.velocity.x;
        }
        if (ball.position.x >= (this.canvas.width - ball.radius)) {
            ball.position.x = this.canvas.width - ball.radius;
            ball.velocity.x = -ball.velocity.x;
        }
        if (ball.position.y <= ball.radius) {
            ball.position.y = ball.radius;
            ball.velocity.y = -ball.velocity.y;
        }
        if (ball.position.y >= (this.canvas.height - ball.radius)) {
            ball.position.y = this.canvas.height - ball.radius;
            ball.velocity.y = -ball.velocity.y;
        }

    },
     
    keyPress: function(evt, obj){
       //console.log(evt.keyCode);
       //console.log(obj);
       switch (evt.keyCode) {
           case 38:  /* Up arrow was pressed */
               //if (this.triangle.A.y - this.canvas.height > 0){
                  this.triangle.A.y -= 3;
		  this.triangle.B.y -= 3;
		  this.triangle.C.y -= 3;				  
               //}
           break;
           case 40:  /* Down arrow was pressed */
               //if (this.ship.y + this.ship.dy < this.height){
                  this.triangle.A.y += 3;
                  this.triangle.B.y += 3;
                  this.triangle.C.y += 3;
               //}
           break;
           case 37:  /* Left arrow was pressed */
               //if (this.ship.x - this.ship.dx > 0){
               //   this.triangle.A.x -= 3;
               //   this.triangle.B.x -= 3;
               //   this.triangle.C.x -= 3;
		this.triangle.rotate(-0.2);
               //}
           break;
           case 39:  /* Right arrow was pressed */
               //if (this.ship.x + this.ship.dx < this.width){
               //   this.triangle.A.x += 3;
               //   this.triangle.B.x += 3;
               //   this.triangle.C.x += 3;
               //}
		this.triangle.rotate(0.2);
           break;
       }
   }
};

