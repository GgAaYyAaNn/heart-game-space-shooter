import {audio} from "./core/audio.js"
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
    getSpaceship, powerUps,
} from "./core/gameState.js"

import {Spaceship} from "./entities/Spaceship.js";
import {EnemyGrid} from "./entities/EnemyGrid.js";
import {Particle} from "./entities/Particle.js";
import {ScoreLabel} from "./entities/ScoreLabel.js";
import {Powerup} from "./entities/Powerup.js";
import Player from "./core/player.js";


let lastShootTime = 0;
const shootCooldown = 100; // milliseconds between shots (0.1s)
let frames = 0;
let scoreMultiplier = 0;
let enemySpawnSpeedModifier = 500;
let enemySpawnInterval = Math.floor(Math.random() * 500) + enemySpawnSpeedModifier;
let lastPowerUpSpawned = window.performance.now();
let powerUpSpawnInterval = Math.floor(Math.random() * 40000) + 20000; // milliseconds

let fps = 60;
let fpsInterval = 1000/fps;
let msPrev = window.performance.now();

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

function removeObj(objArray, obj, index){
    setTimeout(() => {
        if (index && objArray[index] === obj){
            objArray.splice(index, 1);
        }else{
            const index = objArray.findIndex(o => o === obj);
            if (index !== -1){
                objArray.splice(index, 1);
            }
        }
    }, 0);
}

function rectangularCollision(rect1, rect2){
    return (
        rect1.position.y > rect2.position.y
        && rect1.position.y < rect2.position.y + rect2.height
        && rect1.position.x > rect2.position.x
        && rect1.position.x < rect2.position.x + rect2.width
    )
}

function endGame(){
    game.over = true;
    audio.gameOver.play();

    const spaceship = getSpaceship()
    spaceship.opacity = 0;
    createParticles({
        obj: spaceship, color: "red"
    })

    setTimeout(() => {
        game.active = false;
        window.dispatchEvent(new CustomEvent('game-over'));
    }, 2000)
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate);

    const msNow = window.performance.now();
    const elapsed = msNow - msPrev;
    if (elapsed < fpsInterval) return;
    msPrev = msNow - (elapsed % fpsInterval);

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
    powerUps.forEach((powerup, puindex)=>{
        if (powerup.position.x - powerup.radius > canvas.width){
            removeObj(powerUps, powerup, puindex);
        }else{
            powerup.update();
        }
    })

    // explosions
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0) {
            removeObj(particles, particle, index)
        } else {
            particle.update();
        }
    })

    // enemy bullets
    enemyProjectiles.forEach((projectile, index) => {
        if (projectile.position.y > canvas.height) {
            removeObj(enemyProjectiles, projectile, index);
        } else if (
            projectile.active && rectangularCollision(projectile, spaceship)
        ) {
            projectile.active = false;
            spaceship.health -= projectile.damage;
            removeObj(enemyProjectiles, projectile, index);
            if (spaceship.health <= 0){
                endGame();
            }
        }
        projectile.update();
    })

    // player bullets
    projectiles.forEach((projectile, pindex) => {
        // is projectile out of view
        if (projectile.position.y < 0) {
            projectile.active = false;
            removeObj(projectiles, projectile, pindex);
        }

        // powerup hit check
        powerUps.forEach((powerup, puindex)=>{
            if (
                Math.hypot(
                    projectile.position.x - powerup.position.x,
                    projectile.position.y - powerup.position.y,
                ) <= powerup.radius
            ){
                audio.powerup.play();
                spaceship.powerupActive = true;
                projectile.active = false;
                removeObj(projectiles, projectile, pindex);
                removeObj(powerUps, powerup, puindex);

                setTimeout(()=>{
                    spaceship.powerupActive = false;
                }, 5000);
            }
        })

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
                    projectile.active && rectangularCollision(projectile, enemy)
                ) {
                    projectile.active = false;
                    setTimeout(() => {
                        const projectileFound = projectiles.find(p => p === projectile);
                        const enemyFound = grid.enemies.find(e => e === enemy);
                        if (projectileFound && enemyFound) {
                            audio.enemyHit.play();
                            projectiles.splice(pindex, 1);
                            grid.enemies.splice(eindex, 1);

                            const score = enemyFound.scoreValue * scoreMultiplier ;
                            Player.incrementScore(score);
                            document.querySelector('#score').innerText = Player.getScore();

                            dynamicScoreLabels.push(new ScoreLabel({
                                x: enemy.position.x + enemy.width / 2,
                                y: enemy.position.y,
                                value: score,
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
                                enemyGrids.splice(gindex, 1)
                            }

                        }
                    }, 0)
                }
            })


            // remove player if enemy touch it or enemy move out of the canvas
            if (
                !game.over && rectangularCollision(enemy, spaceship) || enemy.position.y + enemy.width > canvas.height
            ){
                spaceship.health = 0;
                endGame();
            }

        })

        // enemy shoot
        if (frames % 100 === 0 && grid.enemies.length > 0) {
            audio.enemyShoot.play();
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
    if (frames % enemySpawnInterval === 0) {
        enemySpawnInterval = Math.floor(Math.random() * 500) + enemySpawnSpeedModifier;
        enemyGrids.push(new EnemyGrid());
        frames = 0;

        enemySpawnSpeedModifier = enemySpawnSpeedModifier < 0 ? 200 : enemySpawnSpeedModifier - 50;
        scoreMultiplier += 1;
    }

    // spanning powerups
    if (msNow - lastPowerUpSpawned >= powerUpSpawnInterval){
        lastPowerUpSpawned = msNow;
        powerUpSpawnInterval = Math.floor(Math.random() * 40000) + 20000; // milliseconds
        powerUps.push(
            new Powerup({
                position: {
                    x: 0,
                    y: Math.random() * canvas.height / 2 + 50,
                },
                velocity: {
                    x: 5,
                    y: 0,
                }
            })
        );
    }

    if (!game.over){
        // player shoot
        const now = Date.now();
        if (actions.shoot && now - lastShootTime > shootCooldown) {
            if (spaceship.powerupActive){
                audio.shoot_machine_gun.play();
            }else{
                audio.shoot.play();
            }

            spaceship.shoot().forEach(projectile=>{
                projectiles.push(projectile);
            })
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
    // console.log(frames, enemyGrids.length, projectiles.length, enemyProjectiles.length, particles.length, powerUps.length);
}



export const startGame = ()=>{
    audio.backgroundMusic.play();
    audio.start.play();


    resetState();
    setSpaceship(new Spaceship());
    frames = 0;
    scoreMultiplier = 0;
    enemySpawnSpeedModifier = 500;

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

export const resumeFromFail = ()=>{
    game.active = true
    game.over = false;
    setSpaceship(new Spaceship());

    audio.start.play();
    enemyGrids.forEach(grid=>{
        grid.enemies.forEach(enemy=>{
            createParticles({
                obj: enemy, color: "#88b903"
            })
        })
    })
    enemyGrids.splice(0, enemyGrids.length);
    enemyProjectiles.splice(0, enemyProjectiles.length);
    enemySpawnInterval = 1;

    animate();
}
