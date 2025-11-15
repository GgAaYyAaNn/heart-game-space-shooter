import {startGame} from "./game.js";
import Player from "./core/player.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const startMenu = document.getElementById("start-menu");
    const restartMenu = document.getElementById("restart-menu");
    const scoreboardMenu = document.getElementById('scoreboard-menu');
    const startBtn = document.querySelector(".start-btn");
    const scoreboardBtn = document.querySelector(".scoreboard-btn");
    const restartBtn = document.querySelector(".restart-btn");
    const backToMenuBtns =document.querySelectorAll(".main-menu-btn");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const profileLoader = document.getElementById("profile-loader");

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
    loginBtn.addEventListener("click", ()=>{
        profileLoader.classList.remove('d-none');
        loginBtn.classList.add("d-none");
        Player.login().then(updatePlayerStats);
    })
    logoutBtn.addEventListener("click", ()=>{
        profileLoader.classList.remove('d-none');
        logoutBtn.classList.add("d-none");
        Player.logout().then(updatePlayerStats);
    })
    window.addEventListener("auth-changed", updatePlayerStats);
    function updatePlayerStats(){
        if (Player.isLoggedIn()){
            document.getElementById("profile-picture").src = Player.getAvatarSrc();
            document.getElementById("username").innerText = Player.getName();
            loginBtn.classList.add("d-none");
            logoutBtn.classList.remove("d-none");
        }else{
            document.getElementById("profile-picture").src = "";
            document.getElementById("username").innerText = "";
            loginBtn.classList.remove("d-none");
            logoutBtn.classList.add("d-none");
        }

        profileLoader.classList.add('d-none');
    }
})