import { ctx } from "../core/canvas.js";
import { EnemyProjectile } from "./EnemyProjectile.js";

export class Enemy {
    constructor({position, velocity, onImageLoad}) {
        this.position = {
            x: position.x, y: position.y
        }
        this.velocity = {
            x: velocity.x, y: velocity.y
        }
        this.width = 0;
        this.height = 0;
        this.scoreValue = 100;
        // this.health = 100;
        const image = new Image();
        image.src = "./img/enemy_2.png";
        image.onload = () => {
            const scale = 0.35;
            this.image = image;
            this.width = this.image.width * scale;
            this.height = this.image.height * scale;

            if (onImageLoad) {
                onImageLoad(this);
            }
        }
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        // // health bar
        // ctx.fillStyle = "black";
        // ctx.fillRect(
        //     this.position.x,
        //     this.position.y + this.height,
        //     this.width * this.health / 100,
        //     1
        // )
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            //     this.velocity.x = -this.velocity.x;
            // }

        }
    }

    shoot() {
        return new EnemyProjectile({
            position: {
                x: this.position.x + this.width / 2, y: this.position.y + this.height / 2,
            }, velocity: {
                x: 0, y: 5,
            }, damage: 100,
        })
    }
}