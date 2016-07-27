"use strict";

class Particle {
    constructor() {
        this.scale = 1.0;
        this.position = new Vector2D(0,0);
        this.radius = 20;
        this.color = "#000";
        this.velocity = new Vector2D(0,0);
        this.scaleSpeed = 0.5;
    }

    update (ms) {
        // shrinking
        this.scale -= this.scaleSpeed * ms / 1000.0;

        if (this.scale <= 0)
        {
            this.scale = 0;
        }
        // moving away from explosion center
        this.position.x += this.velocity.x * ms/1000.0;
        this.position.y += this.velocity.y * ms/1000.0;
    };

    draw (CONTEXT)
    {
        // translating the 2D context to the particle coordinates
        CONTEXT.save();
        CONTEXT.translate(this.position.x, this.position.y);
        CONTEXT.scale(this.scale, this.scale);

        // drawing a filled circle in the particle's local space
        CONTEXT.beginPath();
        CONTEXT.arc(0, 0, this.radius, 0, Math.PI*2, true);
        CONTEXT.closePath();

        CONTEXT.fillStyle = this.color;
        CONTEXT.fill();

        CONTEXT.restore();
    };
}