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

// Component types
    const loc = component("vector");
    const move = component("vector");
    const impulse = component(function(forward,rotate) {
        this.forward = forward; this.rotate = rotate;
    });
    const image = component(function(image,offset) {
        this.image = image; this.offset = offset;
    });
    const rotate = component("angle");

// Systems
    system({ //render
        components: [image, loc],
        pre() {
            render.save();
            render.clearRect(0, 0, canvas.width, canvas.height);
        },
        every(image, loc, entity) {
            render.beginPath();
            if(entity.has(rotate)) {
                render.translate( loc.vector.x, loc.vector.y );
                render.rotate(entity.get(rotate).angle * Math.PI / 180);
                render.translate( -loc.vector.x, -loc.vector.y );
            }
            render.drawImage(image.image, loc.vector.x + image.offset.x , loc.vector.y + image.offset.y);
            render.closePath();
        },
        post() {
            render.restore();
        },
    });
    system({ // movement
        components: [move, loc],
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

// Add player
    const player = entity()
        .add(loc, new Vector2D(100, 100))
        .add(image, playerCraft, new Vector2D(-20, -23))
        .add(move, new Vector2D(0, 0))
        .add(rotate, 0);

// GO!
    const gameLoop = () => {
        kran.run("all");
        /* // draw red dot where the craft should be - for aligning stuff 
        render.beginPath();
        render.fillStyle  = "red";
        render.arc(100, 100, 5, 0, Math.PI *2, true );
        render.fill();
        render.closePath();
        /**/

        requestAnimationFrame(gameLoop);
    }
    gameLoop();

})(Kran,Vector2D);
