export const audio = {
    backgroundMusic: new Howl({
        src: "audio/background_music.mp3",
        loop: true
    }),
    enemyShoot: new Howl({
        src: "audio/enemy_shoot.mp3"
    }),
    enemyHit: new Howl({
        src: "audio/enemy_hit.mp3"
    }),
    gameOver: new Howl({
        src: "audio/game_over.wav"
    }),
    shoot: new Howl({
        src: "audio/shoot.wav"
    }),
    start: new Howl({
        src: "audio/start.mp3"
    }),
    powerup: new Howl({
        src: "audio/powerup.mp3"
    }),
    shoot_machine_gun: new Howl({
        src: "audio/shoot_machine_gun.mp3",
        volume: 0.5,
    }),
}