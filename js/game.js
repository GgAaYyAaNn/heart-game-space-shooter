import {canvas, ctx} from "./core/canvas.js";
import {
    actions,
    backgroundStars,
    dynamicScoreLabels,
    enemyGrids,
    enemyProjectiles,
    game,
    particles,
    projectiles,
    resetState,
    setSpaceship,
    getSpaceship,
} from "./core/gameState.js"

import {Spaceship} from "./entities/Spaceship.js";
import {EnemyGrid} from "./entities/EnemyGrid.js";
import {Particle} from "./entities/Particle.js";
import {ScoreLabel} from "./entities/ScoreLabel.js";
import Player from "./core/player.js";


let lastShootTime = 0;
const shootCooldown = 100; // milliseconds between shots (0.1s)
let frames = 0;
let spawnInterval = Math.floor(Math.random() * 500) + 500;

window.addEventListener("auth-changed", ()=>{
    document.querySelector('#score').innerText = Player.getScore();
})

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

    const spaceship = getSpaceship();
    spaceship.update();
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
        } else if (
            projectile.active
            && projectile.position.y > spaceship.position.y
            && projectile.position.y < spaceship.position.y + spaceship.height
            && projectile.position.x > spaceship.position.x
            && projectile.position.x < spaceship.position.x + spaceship.width
        ) {
            projectile.active = false;
            spaceship.health -= projectile.damage;
            createParticles({
                obj: spaceship, color: "red"
            })
            setTimeout(() => {
                enemyProjectiles.splice(index, 1);
                if (spaceship.health <= 0){
                    spaceship.opacity = 0;
                    game.over = true;
                }
            }, 0)
            if (spaceship.health <= 0){
                setTimeout(() => {
                    game.active = false;

                    window.dispatchEvent(new CustomEvent('game-over'));
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
                if (
                    projectile.active
                    && projectile.position.y < enemy.position.y + enemy.height
                    && projectile.position.y > enemy.position.y
                    && projectile.position.x > enemy.position.x
                    && projectile.position.x < enemy.position.x + enemy.width
                ) {
                    projectile.active = false;
                    setTimeout(() => {
                        const projectileFound = projectiles.find(p => p === projectile);
                        const enemyFound = grid.enemies.find(e => e === enemy);
                        if (projectileFound && enemyFound) {
                            projectiles.splice(pindex, 1);
                            grid.enemies.splice(eindex, 1);

                            Player.incrementScore(enemyFound.scoreValue);
                            document.querySelector('#score').innerText = Player.getScore();

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
            projectiles.push(spaceship.shoot());
            lastShootTime = now;
        }

        // player movements
        if (actions.moveLeft && spaceship.position.x > 0) {
            spaceship.velocity.x = -10;
            spaceship.rotation = -.30;
        } else if (actions.moveRight && spaceship.position.x + spaceship.width <= canvas.width) {
            spaceship.velocity.x = 10;
            spaceship.rotation = .30;
        } else {
            spaceship.velocity.x = 0;
            spaceship.rotation = 0;
        }
        if (actions.moveUp && spaceship.position.y > canvas.height * 0.5) {
            spaceship.velocity.y = -10;
        } else if (actions.moveDown && spaceship.position.y + spaceship.height < canvas.height) {
            spaceship.velocity.y = 10;
        } else {
            spaceship.velocity.y = 0;
        }
    }


    frames++;
    // console.log(frames, enemyGrids.length, projectiles.length, enemyProjectiles.length, particles.length);
}



export const startGame = ()=>{
    resetState();
    setSpaceship(new Spaceship());
    frames = 0;

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

    document.querySelector('#score').innerText = Player.getScore();
    animate();
}

