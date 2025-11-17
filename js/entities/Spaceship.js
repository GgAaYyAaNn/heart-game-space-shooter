import { canvas, ctx } from "../core/canvas.js";
import { Projectile } from "./Projectile.js";

export class Spaceship {
    constructor() {
        this.position = {
            x: 0, y: 0,
        }
        this.velocity = {
            x: 0, y: 0,
        }
        this.width = 0;
        this.height = 0;
        this.health = 100;
        this.rotation = 0;
        this.opacity = 1;
        this.powerupActive = false;

        const image = new Image();
        image.src = "./img/player_2.png";
        image.onload = () => {
            const scale = 0.4;
            this.image = image;
            this.width = this.image.width * scale;
            this.height = this.image.height * scale;

            this.position.x = canvas.width / 2 - this.width / 2;
            this.position.y = canvas.height - this.height - 10;
        }
    }

    draw() {
        // ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        ctx.save()
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);


        // // health bar
        // ctx.fillStyle = "black";
        // ctx.fillRect(
        //     this.position.x,
        //     this.position.y + this.height,
        //     this.width * this.health / 100,
        //     1
        // )

        ctx.restore();


    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    shoot(){
        let projectiles = [];
        projectiles.push(
            new Projectile({
                position: {
                    x: this.position.x + this.width * (2/4),
                    y: this.position.y,
                }, damage: 100,
            })
        )
        if (this.powerupActive){
            projectiles.push(
                new Projectile({
                    position: {
                        x: this.position.x + this.width * (1/4),
                        y: this.position.y,
                    }, damage: 100,
                })
            )
            projectiles.push(
                new Projectile({
                    position: {
                        x: this.position.x + this.width * (3/4),
                        y: this.position.y,
                    }, damage: 100,
                })
            )
        }
        return projectiles;
    }
}
