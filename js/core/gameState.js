
export let spaceship = null;
export let enemyGrids = [];
export let projectiles = [];
export let particles = [];
export let enemyProjectiles = [];
export let dynamicScoreLabels = [];
export let backgroundStars = [];

export const actions = {
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    shoot: false,
};

export const game = {
    over: false,
    active: true,
};

export function resetState() {
    spaceship = null;
    enemyGrids = [];
    projectiles = [];
    particles = [];
    enemyProjectiles = [];
    dynamicScoreLabels = [];
    backgroundStars = [];

    game.over = false;
    game.active = true;
}

export function setSpaceship(obj){
    spaceship = obj;
}
export function getSpaceship(){
    return spaceship;
}


addEventListener("keydown", ({key}) => {
    switch (key) {
        case "a":
        case "ArrowLeft":
            actions.moveLeft = true;
            break;
        case "d":
        case "ArrowRight":
            actions.moveRight = true;
            break;
        case "w":
        case "ArrowUp":
            actions.moveUp = true;
            break;
        case "s":
        case "ArrowDown":
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