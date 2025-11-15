import { ctx } from "../core/canvas.js";

export class Projectile {
    constructor({position, damage}) {
        this.position = {
            x: position.x, y: position.y,
        }
        this.velocity = {
            x: 0, y: -10,
        }
        this.damage = damage;
        this.active = true;
        this.width = 3;
        this.height = 10;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}