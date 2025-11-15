import { Enemy } from "./Enemy.js";
import {canvas} from "../core/canvas.js";

export class EnemyGrid {
    constructor() {
        this.position = {
            x: 0, y: 0,
        }
        this.velocity = {
            x: 3, y: 0
        }
        this.enemies = [];
        this.width = 0;

        new Enemy({
            position: {}, velocity: {}, onImageLoad: (enemy) => {
                const rows = Math.floor(Math.random() * 5) + 2;
                const cols = Math.floor(Math.random() * 10) + 5;
                this.width = cols * enemy.width;
                for (let x = 0; x < cols; x++) {
                    for (let y = 0; y < rows; y++) {
                        this.enemies.push(new Enemy({
                            position: {
                                x: x * enemy.width, y: y * enemy.height,
                            }, velocity: {
                                x: this.velocity.x, y: this.velocity.y,
                            }
                        }));
                    }
                }
            }
        });

    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y += 30;
        }
    }
}