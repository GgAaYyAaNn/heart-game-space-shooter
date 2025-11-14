import {startGame} from "./game.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const startMenu = document.getElementById("start-menu");
    const restartMenu = document.getElementById("restart-menu");
    const scoreboardMenu = document.getElementById('scoreboard-menu');
    const startBtn = document.querySelector(".start-btn");
    const scoreboardBtn = document.querySelector(".scoreboard-btn");
    const restartBtn = document.querySelector(".restart-btn");
    const backToMenuBtns =document.querySelectorAll(".main-menu-btn");

    function hideAllMenus(){
        startMenu.classList.add("d-none");
        restartMenu.classList.add('d-none')
        scoreboardMenu.classList.add('d-none')
    }

    startBtn.addEventListener("click", ()=>{
        hideAllMenus();
        startGame();
    });
    restartBtn.addEventListener("click", ()=>{
        hideAllMenus();
        startGame();
    })
    scoreboardBtn.addEventListener("click", ()=>{
        hideAllMenus();
        scoreboardMenu.classList.remove('d-none');
    })
    backToMenuBtns.forEach(btn=>{
      btn.addEventListener("click", ()=>{
          hideAllMenus();
          startMenu.classList.remove('d-none')
      })
    })

    window.addEventListener("game-over", ()=>{
        restartMenu.classList.remove('d-none');
    })
})