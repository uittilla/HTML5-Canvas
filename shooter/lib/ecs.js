(function(Kran,Vector2D){
    'use strict';

    const canvas = document.getElementById('canvas');
    const render = canvas.getContext('2d');

    const kran = new Kran();
    const component = kran.component.bind(kran);
    const system = kran.system.bind(kran);
    const entity = kran.entity.bind(kran);
// Images
    const playerCraft = new Image();
    playerCraft.src = "images/fighter.png";
    const fighterCraft = new Image();
    fighterCraft.src = "images/speedship.png";
    const bomberCraft = new Image();
    bomberCraft.src = "images/bomber.png";

// Component types
    const drawable = component("visible");
    const position = component("vector");
    const move = component("vector");
    const impulse = component(function(forward,rotate) {
        this.forward = forward; this.rotate = rotate;
    });
    const image = component(function(image,offset) {
        this.image = image; this.offset = offset;
    });
    const rotate = component("angle");
    const enemyAi = component("type");
    const collidable = component(function(radius,mass) {
        this.radius = radius; this.mass = mass;
    });
    const collision = component("with");

    const draw = (e, loc) => {
        render.save();
        render.beginPath();
        render.translate( loc.vector.x, loc.vector.y );
        if(e.has(rotate)) {
            render.rotate(e.get(rotate).angle * Math.PI / 180);
        }
        if(e.has(image)) {
            const i = e.get(image);
            render.drawImage(i.image, i.offset.x , i.offset.y);
        }
        if(e.has(impulse)) {
            const i = e.get(impulse);
            if(i.forward!=0) {
                render.moveTo(-17.5,-2.5)
                render.lineTo(-30,0)
                render.lineTo(-17.5,2)
                render.fillStyle = "red";
                render.fill();
                render.stroke();
            }
        }
        render.closePath();
        render.restore();
    }

// Systems
    system({ //render
        components: [position,drawable],
        pre(t) {
            render.clearRect(0, 0, canvas.width, canvas.height);
        },
        every(loc, d, e) {
            draw(e, loc);
        },
    });
    system({ // movement
        components: [move, position],
        every(move, loc, entity) {
            loc.vector.add(move.vector);
        },
    });
    system({ // impulse - adding movement from button press
        components: [impulse, move, rotate],
        every(impulse, move, rotate, entity) {
            rotate.angle += impulse.rotate * 3;
            if(impulse.forward) {
                move.vector.add( new Vector2D(
                            Math.cos(rotate.angle * Math.PI / 180) * 0.05,
                            Math.sin(rotate.angle * Math.PI / 180) * 0.05
                            ));
            }
        },
    });
    system({ // simpleAI
        components: [enemyAi, position, rotate],
        every(ai, loc, rot, entity) {
            const ploc = player.get(position);
            const angle = loc.vector.getAngle(ploc.vector) - Math.PI;
            rot.angle = angle * 180 / Math.PI;
        }
    });
    system({ // collision detection and movement
        components: [collidable, position],
        pre() {
            kran.getEntityCollection([collidable, position]).ents
                .forEach(function (ent1, elm) {
                    let ent2;
                    while((elm = elm.next) && (ent2 = elm.data)) {
                        handleCollision(ent1, ent2)
                    }
                }, this);
        }
    });
    system({ // collision resolution
        components: [collision],
        every(col, ent) {
            // what happens depends on what components is has
            // some collidables explode, some do nothing

            // whatever happens, this entity has handled the collision
            ent.remove(collision);
        }
    });
    system({ // keyboard
        on: ['keydown', 'keyup'],
        pre(ev) {
            let r = ev.keyCode == 37 ? -1 : ( ev.keyCode == 39 ? 1 : 0 );
            let t = ev.keyCode == 38 ? 1 : 0;

            if(ev.type == 'keyup') {
                r *= -1;
                t *= -1;
            }
            if( r==0 && t==0 ) {
                return;
            }
            ev.preventDefault();
            if(player.has(impulse)) {
                const i = player.get(impulse);
                t += i.forward;
                r += i.rotate;
                if( r==0 && t==0 ) {
                    player.remove(impulse);
                } else {
                    i.forward = t > 0 ? 1 : 0;
                    i.rotate = r > 0 ? 1 : ( r < 0 ? -1 : 0 );
                }
            } else {
                player.add(impulse,t,r);
            }
        },
        
    });

    const handleCollision = (e1, e2) => {
        if (e1 == e2) return;
        const minD = e1.get(collidable).radius + e2.get(collidable).radius;
        const p1 = e1.get(position).vector;
        const p2 = e2.get(position).vector;
        const angle = p1.getAngle(p2);
        const sepVector = p2.subtractNew(p1);
        const curD = sepVector.magnitude();
        // TODO - unfortunately, this handles collision AFTER impact, which at low speeds can cause
        // repeated impact, and at high speeds can cause objects to "phase" through each other
        // more nuanced collision required
        if (curD > minD) {
            return;
        }
        e1.add(collision, e2);
        e2.add(collision, e1);
        const a1 = e1.get(collidable).mass;
        const a2 = e2.get(collidable).mass;

        // maintain momentum total
        const m1 = e1.get(move).vector.scalarMultiplyNew(a1);
        const m2 = e2.get(move).vector.scalarMultiplyNew(a2);
        const momSum = m1.addNew(m2);

        // Normalise separation vector
        sepVector.normalise();
        // Set momentum vectors portions
        e2.get(move).vector = sepVector.scalarMultiplyNew(momSum.dot(sepVector));
        e1.get(move).vector = momSum.subtractNew(e2.get(move).vector);

        // adjust by mass
        e2.get(move).vector.scalarMultiply(1/a2);
        e1.get(move).vector.scalarMultiply(1/a1);
    };

// Add player
    const player = entity()
        .add(position, new Vector2D(100, 100))
        .add(image, playerCraft, new Vector2D(-20, -23))
        .add(move, new Vector2D(0, 0))
        .add(rotate, 0)
        .add(collidable, 20, 1)
        .add(drawable,true);
    const fighter = entity()
        .add(position, new Vector2D(500,100))
        .add(image, fighterCraft, new Vector2D(-42,-42))
        .add(move, new Vector2D(0, 0))
        .add(rotate, 0)
        .add(collidable, 20, 2)
        .add(drawable, true)
        .add(enemyAi, 'fighter');
    const bomber = entity()
        .add(position, new Vector2D(500,300))
        .add(image, bomberCraft, new Vector2D(-42,-42))
        .add(move, new Vector2D(0, 0))
        .add(rotate, 0)
        .add(drawable, true)
        .add(enemyAi, 'bomber');

// GO!
    const gameLoop = (time) => {
        kran.run("all", time);
        /* // draw red dot where the craft should be - for aligning stuff 
        render.beginPath();
        render.fillStyle  = "red";
        render.arc(100, 100, 5, 0, Math.PI *2, true );
        render.fill();
        render.closePath();
        /**/

        requestAnimationFrame(gameLoop);
    }
    gameLoop(0);

})(Kran,Vector2D);
