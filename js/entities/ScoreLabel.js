import { ctx } from "../core/canvas.js";

export class ScoreLabel {
    constructor({ x, y, value }) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.opacity = 1;
        this.velocityY = -0.5;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#fff";
        ctx.font = "1rem sans-serif";
        ctx.fillText(this.value, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.draw();
        this.y += this.velocityY;
        this.opacity -= 0.02;
    }
}