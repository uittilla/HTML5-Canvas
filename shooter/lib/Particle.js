"use strict";

class Particle {
    constructor() {
        this.scale = 1.0;
        this.x = 0;
        this.y = 0;
        this.radius = 20;
        this.color = "#000";
        this.velocityX = 0;
        this.velocityY = 0;
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
        this.x += this.velocityX * ms/1000.0;
        this.y += this.velocityY * ms/1000.0;
    };

    draw (CONTEXT)
    {
        // translating the 2D context to the particle coordinates
        CONTEXT.save();
        CONTEXT.translate(this.x, this.y);
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