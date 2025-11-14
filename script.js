class Player {
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
        ctx.translate(this.position.x + player.width / 2, this.position.y + this.height / 2);
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
        return new Projectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y,
            }, damage: 100,
        })
    }
}


class Enemy {
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

class EnemyGrid {
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

class Projectile {
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

class EnemyProjectile {
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

class Particle {
    constructor({ position, velocity, radius, color, fade }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fade = fade;
    }
    draw() {
        ctx.save()

        ctx.globalAlpha = this.opacity;
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.restore()
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.fade){
            this.opacity -= 0.01;
        }

    }
}

class ScoreLabel {
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


function createParticles({ obj, color }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: obj.position.x + obj.width / 2,
                y: obj.position.y + obj.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            },
            radius: Math.random() * 3,
            color: color || "#fff",
            fade: true,
        }))
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    backgroundStars.forEach(star => {
        star.update();
        if (star.position.y > canvas.height){
            star.position.y = -star.radius;
            star.position.x = Math.random() * canvas.width;
        }
    })

    // explosions
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        } else {
            particle.update();
        }
    })

    // enemy bullets
    enemyProjectiles.forEach((projectile, index) => {
        if (projectile.position.y > canvas.height) {
            setTimeout(() => {
                enemyProjectiles.splice(index, 1);
            }, 0)
        } else if (projectile.active && projectile.position.y > player.position.y && projectile.position.y < player.position.y + player.height && projectile.position.x > player.position.x && projectile.position.x < player.position.x + player.width) {
            projectile.active = false;
            player.health -= projectile.damage;
            createParticles({
                obj: player, color: "red"
            })
            setTimeout(() => {
                enemyProjectiles.splice(index, 1);
                if (player.health <= 0){
                    player.opacity = 0;
                    game.over = true;
                }
            }, 0)
            if (player.health <= 0){
                setTimeout(() => {
                    game.active = false;
                }, 2000)
            }
        }
        projectile.update();
    })

    // player bullets
    projectiles.forEach((projectile, pindex) => {
        // is projectile out of view
        if (projectile.position.y < 0) {
            projectile.active = false;
            setTimeout(() => {
                projectiles.splice(pindex, 1)
            }, 0)
        }
        projectile.update();
    })

    enemyGrids.forEach((grid, gindex) => {
        grid.update();
        grid.enemies.forEach((enemy, eindex) => {
            enemy.velocity.x = grid.velocity.x;
            enemy.velocity.y = grid.velocity.y;
            enemy.update()
            projectiles.forEach((projectile, pindex) => {
                if (projectile.active && projectile.position.y < enemy.position.y + enemy.height && projectile.position.y > enemy.position.y && projectile.position.x > enemy.position.x && projectile.position.x < enemy.position.x + enemy.width) {
                    projectile.active = false;
                    setTimeout(() => {
                        const projectileFound = projectiles.find(p => p === projectile);
                        const enemyFound = grid.enemies.find(e => e === enemy);
                        if (projectileFound && enemyFound) {
                            projectiles.splice(pindex, 1);
                            grid.enemies.splice(eindex, 1);
                            score += enemy.scoreValue;

                            dynamicScoreLabels.push(new ScoreLabel({
                                x: enemy.position.x + enemy.width / 2,
                                y: enemy.position.y,
                                value: enemy.scoreValue,
                            }))

                            createParticles({
                                obj: enemy, color: "#88b903"
                            })

                            if (grid.enemies.length > 0){
                                // recalculating grid width
                                const firstEnemy = grid.enemies[0];
                                const lastEnemy = grid.enemies[grid.enemies.length - 1];
                                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width;
                                grid.position.x = firstEnemy.position.x;
                            }else{
                                setTimeout(()=>{
                                    enemyGrids.slice(gindex, 1)
                                }, 0)
                            }

                        }
                    }, 0)
                }
            })
        })

        // enemy shoot
        if (frames % 100 === 0 && grid.enemies.length > 0) {
            let _enemy = grid.enemies[Math.floor(Math.random() * grid.enemies.length)];
            enemyProjectiles.push(_enemy.shoot());
        }

    })

    // score label
    ctx.fillStyle = '#fff';
    ctx.font = '1.5rem sans-serif'
    ctx.fillText(`Score: ${score}`, 20, 40);

    // dynamic score labels
    dynamicScoreLabels.forEach((label, index)=>{
        if (label.opacity <= 0){
            setTimeout(()=>{
                dynamicScoreLabels.splice(index, 1);
            }, 0)
        }else{
            label.update();
        }
    })

    // enemy grid spawn
    if (frames % spawnInterval === 0) {
        spawnInterval = Math.floor(Math.random() * 500) + 500;
        enemyGrids.push(new EnemyGrid());
        frames = 0;
    }

    if (!game.over){
        // player shoot
        const now = Date.now();
        if (actions.shoot && now - lastShootTime > shootCooldown) {
            projectiles.push(player.shoot());
            lastShootTime = now;
        }

        // player movements
        if (actions.moveLeft && player.position.x > 0) {
            player.velocity.x = -10;
            player.rotation = -.30;
        } else if (actions.moveRight && player.position.x + player.width <= canvas.width) {
            player.velocity.x = 10;
            player.rotation = .30;
        } else {
            player.velocity.x = 0;
            player.rotation = 0;
        }
        if (actions.moveUp && player.position.y > canvas.height * 0.5) {
            player.velocity.y = -10;
        } else if (actions.moveDown && player.position.y + player.height < canvas.height) {
            player.velocity.y = 10;
        } else {
            player.velocity.y = 0;
        }
    }


    frames++;
    // console.log(frames, enemyGrids.length, projectiles.length, enemyProjectiles.length, particles.length);


}

addEventListener("keydown", ({key}) => {
    switch (key) {
        case "a":
        case "ArrowLeft":
            actions.moveLeft = true;
            actions.moveRight = false;
            break;
        case "d":
        case "ArrowRight":
            actions.moveLeft = false;
            actions.moveRight = true;
            break;
        case "w":
        case "ArrowUp":
            actions.moveUp = true;
            actions.moveDown = false;
            break;
        case "s":
        case "ArrowDown":
            actions.moveUp = false;
            actions.moveDown = true;
            break;
        case " ":
            actions.shoot = true;
            break;
    }
})
addEventListener("keyup", ({key}) => {
    switch (key) {
        case "a":
        case "ArrowLeft":
            actions.moveLeft = false;
            break;
        case "d":
        case "ArrowRight":
            actions.moveRight = false;
            break;
        case "w":
        case "ArrowUp":
            actions.moveUp = false;
            break;
        case "s":
        case "ArrowDown":
            actions.moveDown = false;
            break;
        case " ":
            actions.shoot = false;
            break;
    }
})


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1024*0.8;
canvas.height = 576*0.8;
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

const player = new Player();
const projectiles = [];
const particles = [];
const backgroundStars = [];
const enemyProjectiles = [];
// const enemies = [];
const enemyGrids = [];
const dynamicScoreLabels = [];
const actions = {
    moveLeft: false, moveRight: false, moveUp: false, moveDown: false, shoot: false,
}
const game = {
    over: false,
    active: true,
}
let lastShootTime = 0;
const shootCooldown = 100; // milliseconds between shots (0.1s)
let frames = 0;
let score = 0;
let spawnInterval = Math.floor(Math.random() * 500) + 500;

// stars
for (let i = 0; i < 50; i++) {
    backgroundStars.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.4,
        },
        radius: Math.random() * 2,
        color: "#fff",
        fade: false,
    }))
}

animate();

