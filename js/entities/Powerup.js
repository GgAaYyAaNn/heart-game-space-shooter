import { ctx } from "../core/canvas.js";

export class Powerup {
    constructor({position, velocity}) {
        this.position = {
            x: position.x, y: position.y,
        }
        this.velocity = {
            x: velocity.x, y: velocity.y,
        }
        this.radius = 15;
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}