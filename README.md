# Heart Game

**Live Demo:** [https://ggaayyaann.github.io/heart-game-space-shooter/](https://ggaayyaann.github.io/heart-game-space-shooter/)

A fast-paced, canvas based space shooter where players fight enemy waves, collect power ups, solve dynamic puzzles, and compete on a global leaderboard.  


## Game Overview

Players control a spaceship and shoot incoming enemies to earn points.
As difficulty increases, the player must avoid enemy fire, collect power ups, and survive as long as possible.
If the player is defeated, they can continue the game by solving a puzzle fetched from the Heart API.

---

## Features

- **Heart API Integration**  
  Fetches heart-count puzzles dynamically from [Marc Conrad’s Heart API](https://marcconrad.com/uob/heart/api.php).

- **Firebase Integration**
    - Google Authentication (sign in with Google)
    - Realtime Database to store user scores
    - Public leaderboard