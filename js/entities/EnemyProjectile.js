import { ctx } from "../core/canvas.js";

export class EnemyProjectile {
    constructor({position, velocity, damage}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 5;
        this.height = 15;
        this.damage = damage;
        this.active = true;
    }d

    draw() {
        ctx.fillStyle = "#88b903";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}