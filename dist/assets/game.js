import Phaser, { Scene } from 'phaser';
import Preloader from '../../src/scenes/PreLoader';
import SortSelectionScene from '../../src/scenes/SortSelectionScene';
import TetrisGameScene from '../../src/scenes/TetrisGameScene';
import GameScene from '../../src/scenes/map1/GameScene';
import BootScene from '../../src/scenes/bootscene';
import GameOverScene from '../../src/scenes/gameover';
import MainMenu from '../../src/scenes/MainMenu';
import SpaceInvaderScene from '../../src/scenes/SpaceInvaderScene';

const config = {
    type: Phaser.AUTO,
    width: 800, // Adjust as needed
    height: 600, // Adjust as needed
    backgroundColor: '#000',
    parent: 'game-container',
    scene: [Preloader, SortSelectionScene, TetrisGameScene, GameScene, BootScene, GameOverScene, MainMenu, SpaceInvaderScene], // Add other scenes here
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

// Setup DOM buttons
function setupButtons() {
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');

    startButton.addEventListener('click', () => {
        console.log('Game Started');
        // Start SortSelectionScene
        game.scene.start('sort_selection');
    });

    resetButton.addEventListener('click', () => {
        console.log('Game Reset');
        // Restart current scene or reset game state
        game.scene.restart('sort_selection');
    });
}

// Initialize buttons after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    setupButtons();
});


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Game state
const GAME_STATE = {
    RUNNING: 'running',
    GAME_OVER: 'gameOver',
    PAUSED: 'paused'
};

// Game configuration
const CONFIG = {
    playerSpeed: 5,
    bulletSpeed: 7,
    asteroidSpawnRate: 0.02,
    satelliteSpawnRate: 0.01,
    initialLives: 3
};

let gameState = GAME_STATE.RUNNING;
let keys = {};
let bullets = [];
let asteroids = [];
let satellites = [];
let stars = [];
let player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 40,
    height: 60,
    color: "white",
    lives: CONFIG.initialLives,
    score: 0,
};

// Initialize game fonts
ctx.font = '20px Arial';

// Create stars for the background
function initializeStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            brightness: Math.random()
        });
    }
}

// Event Listeners
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") {
        shootBullet();
    }
    if (e.key === "r" && gameState === GAME_STATE.GAME_OVER) {
        restartGame();
    }
    if (e.key === "p") {
        togglePause();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function shootBullet() {
    if (gameState !== GAME_STATE.RUNNING) return;

    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 6,
        height: 20,
        color: "yellow",
    });
}

function togglePause() {
    if (gameState === GAME_STATE.RUNNING) {
        gameState = GAME_STATE.PAUSED;
    } else if (gameState === GAME_STATE.PAUSED) {
        gameState = GAME_STATE.RUNNING;
        gameLoop();
    }
}

function restartGame() {
    player.lives = CONFIG.initialLives;
    player.score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    bullets = [];
    asteroids = [];
    satellites = [];
    gameState = GAME_STATE.RUNNING;
    gameLoop();
}

function updatePlayer() {
    if (gameState !== GAME_STATE.RUNNING) return;

    if (keys["w"] || keys["ArrowUp"]) player.y = Math.max(0, player.y - CONFIG.playerSpeed);
    if (keys["s"] || keys["ArrowDown"]) player.y = Math.min(canvas.height - player.height, player.y + CONFIG.playerSpeed);
    if (keys["a"] || keys["ArrowLeft"]) player.x = Math.max(0, player.x - CONFIG.playerSpeed);
    if (keys["d"] || keys["ArrowRight"]) player.x = Math.min(canvas.width - player.width, player.x + CONFIG.playerSpeed);
}

function updateBullets() {
    if (gameState !== GAME_STATE.RUNNING) return;

    bullets = bullets.filter(bullet => {
        bullet.y -= CONFIG.bulletSpeed;
        return bullet.y > -bullet.height;
    });
}

function spawnAsteroids() {
    if (gameState !== GAME_STATE.RUNNING) return;

    if (Math.random() < CONFIG.asteroidSpawnRate) {
        asteroids.push({
            x: Math.random() * (canvas.width - 30),
            y: -50,
            size: 30,
            rotation: Math.random() * Math.PI * 2,
            speed: Math.random() * 2 + 1,
        });
    }
}

function spawnSatellites() {
    if (gameState !== GAME_STATE.RUNNING) return;

    if (Math.random() < CONFIG.satelliteSpawnRate) {
        satellites.push({
            x: Math.random() * (canvas.width - 40),
            y: -50,
            width: 40,
            height: 20,
            speed: Math.random() * 2 + 1,
        });
    }
}

function updateObstacles() {
    if (gameState !== GAME_STATE.RUNNING) return;

    asteroids = asteroids.filter(asteroid => {
        asteroid.y += asteroid.speed;
        asteroid.rotation += 0.03;
        return asteroid.y < canvas.height;
    });

    satellites = satellites.filter(satellite => {
        satellite.y += satellite.speed;
        return satellite.y < canvas.height;
    });
}

function checkCollisions() {
    if (gameState !== GAME_STATE.RUNNING) return;

    // Check bullet collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        // Check asteroid collisions
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            if (detectCollision(bullet, asteroid)) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                player.score += 1;
                break;
            }
        }

        // Check satellite collisions
        for (let j = satellites.length - 1; j >= 0; j--) {
            const satellite = satellites[j];
            if (detectCollision(bullet, satellite)) {
                bullets.splice(i, 1);
                satellites.splice(j, 1);
                player.lives -= 1;
                checkGameOver();
                break;
            }
        }
    }

    // Check player collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
        if (detectCollision(player, asteroids[i])) {
            asteroids.splice(i, 1);
            player.lives -= 1;
            checkGameOver();
        }
    }

    for (let i = satellites.length - 1; i >= 0; i--) {
        if (detectCollision(player, satellites[i])) {
            satellites.splice(i, 1);
            player.lives -= 1;
            checkGameOver();
        }
    }
}

function detectCollision(obj1, obj2) {
    const obj2Width = obj2.width || obj2.size;
    const obj2Height = obj2.height || obj2.size;

    return (
        obj1.x < obj2.x + obj2Width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2Height &&
        obj1.y + obj1.height > obj2.y
    );
}

function checkGameOver() {
    if (player.lives <= 0) {
        gameState = GAME_STATE.GAME_OVER;
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        ctx.save();
        ctx.translate(asteroid.x + asteroid.size / 2, asteroid.y + asteroid.size / 2);
        ctx.rotate(asteroid.rotation);
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(0, 0, asteroid.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function drawSatellites() {
    satellites.forEach(satellite => {
        ctx.fillStyle = "red";
        ctx.fillRect(satellite.x, satellite.y, satellite.width, satellite.height);
        // Add solar panels
        ctx.fillRect(satellite.x - 10, satellite.y + 5, 8, 10);
        ctx.fillRect(satellite.x + satellite.width + 2, satellite.y + 5, 8, 10);
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + star.brightness * 0.5})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

function drawUI() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${player.score}`, 10, 30);
    ctx.fillText(`Lives: ${player.lives}`, 10, 60);

    if (gameState === GAME_STATE.GAME_OVER) {
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press 'R' to restart", canvas.width / 2 - 80, canvas.height / 2 + 40);
    } else if (gameState === GAME_STATE.PAUSED) {
        ctx.font = "40px Arial";
        ctx.fillText("PAUSED", canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press 'P' to continue", canvas.width / 2 - 80, canvas.height / 2 + 40);
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    drawPlayer();
    drawBullets();
    drawAsteroids();
    drawSatellites();
    drawUI();
}

function gameLoop() {
    if (gameState === GAME_STATE.RUNNING) {
        updatePlayer();
        updateBullets();
        spawnAsteroids();
        spawnSatellites();
        updateObstacles();
        checkCollisions();
        draw();
        requestAnimationFrame(gameLoop);
    } else if (gameState === GAME_STATE.GAME_OVER) {
        draw();
    }
}

// Initialize the game
initializeStars();
gameLoop();