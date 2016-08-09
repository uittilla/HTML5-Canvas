// TODO: give bullets 0 mass
// TODO: fix diameter of enemy fighter
// TODO: damage counter and removal of dead things
// TODO: explosions
// TODO: work out a way to modularise code
// TODO: enemy AI (basic following)
// TODO: enemy AI (missile)
// TODO: invert facing of enemy images

define(['kran','matter'], function(Kran, Matter){
    'use strict';
    // Drawing
    const canvas = document.getElementById('canvas');
    const render = canvas.getContext('2d');

    // Kran basics
    const kran = new Kran();
    const component = kran.component.bind(kran);
    const system = kran.system.bind(kran);
    const entity = kran.entity.bind(kran);

    // Matter basics
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Events = Matter.Events;
    const world = World.create( {gravity:{x:0,y:0}} );
    const engine = Engine.create( {world: world, enableSleeping: true});

    // now for kran components
    // physical is a 2d entity for the matter engine
    const physical = component("body");
    // drawable tells us to show it - must have a value, but we ignore that
    const drawable = component("bool");
    // controllable indicates the entity receiving control input
    const controllable = component("bool");
    // expiry for entities to remove (time in ms)
    const expiry = component("time");
    // collisions detected for handling
    const collision = component("with");
    // What to do when something collides!
    const collideFunction = component("func");
    // image - what to draw (in this case an image)
    const image = component(function(image,offset) {
        this.image = image; this.offset = offset;
    });

    Events.on(engine, 'collisionStart', function(e) {
        const pairs = e.pairs;
        pairs.forEach(function(p){
            p.bodyA.entity.add(collision, p.bodyB.entity);
            p.bodyB.entity.add(collision, p.bodyA.entity);
        });
    });
    const bulletHit = (e, other) => {
        // Remove bullet next tick
        e.get(expiry).time = 0;
    }
    const addBullet = (e, phys) => {
        const x = phys.body.position.x + 30*Math.cos(phys.body.angle);
        const y = phys.body.position.y + 30*Math.sin(phys.body.angle);
        const bullet = entity();
        // Body has backref to entity for collision resolution
        const bulletBody = Bodies.circle(x,y,2, {entity: bullet, friction: 0, frictionAir: 0, frictionStatic:0});
        bulletBody.velocity.x = phys.body.velocity.x;
        bulletBody.velocity.y = phys.body.velocity.y;
        Matter.Body.applyForce(bulletBody, bulletBody.position, {
            x: 0.0004 * Math.cos(phys.body.angle),
            y: 0.0004 * Math.sin(phys.body.angle)
        });

        // Add bullet to kran
        bullet.add(physical, bulletBody)
            .add(expiry, 400)
            .add(collideFunction, bulletHit)
            .add(drawable, true);
        // Add physical body to matterjs
        World.add(world, bulletBody);
    }

    // Draw - images have a circle body under them for physics
    const draw = (e, phys) => {
        const b = phys.body;
        render.save();
        render.beginPath();
        render.translate( b.position.x, b.position.y );
        render.rotate( b.angle );
        if(e.has(image)) {
            const i = e.get(image);
            render.drawImage(i.image, i.offset.x, i.offset.y);
        } else {
            //console.log("drawing bullet");
        render.fillStyle = "blue";
        render.arc(0, 0, 1, 0, Math.PI*2, true );
        render.fill();
        }
        render.closePath();
        render.restore();
    /*    render.beginPath();
        render.fillStyle = "red";
        render.arc(b.position.x, b.position.y, 5, 0, Math.PI*2, true );
        render.fill();
        render.closePath();*/
    };
    const keys = [];
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
        e.preventDefault();
    });
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
        e.preventDefault();
    });

    system({
        components: [collision],
        every(c,e) {
            if (e.has(collideFunction)) {
                e.get(collideFunction).func(e, c.with);
            }
            e.remove(collision);
        }
    });
    system({
        components: [physical, drawable],
        pre(t) {
            render.clearRect(0,0, canvas.width, canvas.height);
        },
        every(b,d,e) {
            draw(e, b);
        },
    });
    system({
        components: [expiry],
        every(ex, e, step) {
            ex.time -= step;
            if(ex.time < 0) {
                if (e.has(physical)) {
                    const p = e.get(physical);
                    World.remove(world, p.body);
                }
                e.delete();
            }
        },
    });
    system({
        components: [controllable, physical],
        every(c,p,e) {
            const b = p.body;
            if (keys[32]) {
                // shoot
                addBullet(e, p);
            } else if (keys[38]) { // up
                Matter.Body.applyForce(b, b.position, {
                    x: 0.0005* Math.cos(b.angle), 
                    y: 0.0005* Math.sin(b.angle) 
                });
            } else if (keys[37]) { // left
                b.torque = -0.005;
                Matter.Sleeping.set(b,false);
            } else if (keys[39]) { // right
                b.torque = 0.005;
                Matter.Sleeping.set(b,false);
            }
        },
    });

    const playerCraft = new Image();
    playerCraft.src = "images/fighter.png";
    const fighterCraft = new Image();
    fighterCraft.src = "images/speedship.png";
    const bomberCraft = new Image();
    bomberCraft.src = "images/bomber.png";

    const run = () => {
        
        /*const renderDebug = Render.create({
            element: document.body,
            engine: engine,
            options: {
                showVelocity: true,
                showCollisions: true,
                showAngleIndicator: true,
                    showDebug: true,
            }
        });*/
        

        const boxA = Bodies.circle(400,200,20);
        const boxB = Bodies.circle(410,50,20);

        const player = entity()
            .add(physical, boxA)
            .add(drawable, true)
            .add(controllable, true)
            .add(image, playerCraft, {x:-20, y:-23});
        boxA.entity = player;
        const en = entity()
            .add(physical, boxB)
            .add(drawable, true)
            .add(image, fighterCraft, {x:-42, y:-42});
        boxB.entity = en;
        World.add(world, [boxA, boxB]);

        let lastTime = 0;
        const gameLoop = (time) => {
            kran.run("all",time);
            const id = requestAnimationFrame(gameLoop);
            Engine.update(engine, time-lastTime);
            //renderDebug.frameRequestId = id;
            //Render.world(renderDebug);
            lastTime = time;
        }
        gameLoop(0);
        
    };

    return {
        run: run
    };
});
