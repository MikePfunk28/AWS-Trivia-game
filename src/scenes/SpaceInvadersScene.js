import { getAssetPath } from "../utils/assetLoader";
import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from 'phaser';
import SceneOrderManager from '../utils/SceneOrderManager';
import ProgressManager from '../utils/ProgressManager';



export default class SpaceInvadersScene extends Phaser.Scene {
    constructor() {
        super({ key: 'space_invaders' });
        this.progressManager = new ProgressManager();
        this.nextScene = 'SceneSelectionScene';
    }

    init(data) {
        this.nextScene = data.nextScene;
        this.isIntro = data.isIntro || false;
        this.previousScore = data.score || 0;
        // Set up container bounds
        this.width = this.game.config.width;
        this.height = this.game.config.height;
        this.resetGame();
    }

    resetGame() {
        this.player = {
            x: this.width / 2,
            y: this.height - 80,
            width: 60,
            height: 40,
            lives: 3,
            score: 0,
            speed: 300
        };
        this.bullets = [];
        this.asteroids = [];
        this.satellites = [];
        this.stars = [];
        this.gameStarted = false;
        this.gameOver = false;
    }

    create() {
        // Create stars within bounds
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1
            });
        }

        // Setup keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Apply stored stats
        this.player.fireRate = this.progressManager.stats.fireRate;
        this.player.bulletSpeed = this.progressManager.stats.bulletSpeed;
        this.player.multiShot = this.progressManager.stats.multiShot;

        // Add text
        if (this.isIntro) {
            this.add.text(this.width / 2, 50, 'Welcome to AWS Certification Trainer', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);

            this.add.text(this.width / 2, 100, 'Practice Space Invaders while you wait', {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Add start trivia button at bottom with padding
            const startButton = this.add.text(this.width / 2, this.height - 50, 'Click here to Start Trivia', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#4a4',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            startButton.on('pointerover', () => startButton.setTint(0x88ff88));
            startButton.on('pointerout', () => startButton.clearTint());
            startButton.on('pointerdown', () => {
                if (this.player.score > 0) {
                    localStorage.setItem('currentScore', this.player.score);
                }
                this.scene.start('sort_selection', { score: this.player.score });
            });
        } else {
            this.add.text(this.width / 2, 50, 'Space Invaders Mini-Game', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);
        }

        // Add reset button in top-left corner with padding
        const resetButton = this.add.text(10, 10, 'Reset Game', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#a44',
            padding: { x: 10, y: 5 }
        })
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive();

        resetButton.on('pointerover', () => resetButton.setTint(0xff8888));
        resetButton.on('pointerout', () => resetButton.clearTint());
        resetButton.on('pointerdown', () => {
            this.resetGame();
            this.scene.restart();
        });

        // Add controls text
        this.add.text(this.width / 2, 150, 'Controls: Arrow Keys or WASD to move\nSPACE to shoot', {
            fontSize: '20px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.width / 2, this.height / 2, 'Press SPACE to start', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Add score and lives with proper padding
        this.scoreText = this.add.text(this.width - 150, 10, `Score: ${this.previousScore + this.player.score}`, {
            fontSize: '20px',
            fill: '#fff'
        }).setScrollFactor(0);

        this.livesText = this.add.text(this.width - 150, 40, `Lives: ${this.player.lives}`, {
            fontSize: '20px',
            fill: '#fff'
        }).setScrollFactor(0);

        // Setup player sprite with proper bounds
        this.playerSprite = this.add.text(this.player.x, this.player.y, '/^\\\n//--\\\\\n/_//_\\_\\\n/// ||| \\\\\\', {
            fontSize: '16px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Handle space key
        this.spaceKey.on('down', () => {
            if (!this.gameStarted && !this.gameOver) {
                this.gameStarted = true;
                this.startGame();
            }
            if (this.gameStarted && !this.gameOver) {
                this.shoot();
            }
        });

        // Enable click/tap to shoot
        this.input.on('pointerdown', () => {
            if (this.gameStarted && !this.gameOver) {
                this.shoot();
            }
        });
    }

    startGame() {
        // Start spawning enemies
        this.asteroidTimer = this.time.addEvent({
            delay: 1000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });

        this.satelliteTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnSatellite,
            callbackScope: this,
            loop: true
        });
    }

    shoot() {
        const bullet = this.add.text(this.player.x, this.player.y - 20, '^o^', {
            fontSize: '16px',
            fill: '#ff0'
        }).setOrigin(0.5);
        this.bullets.push(bullet);
    }

    fireBullet() {
        const angles = [-5, 0, 5];
        for (let i = 0; i < this.player.multiShot; i++) {
            const bullet = this.bullets.create(
                this.player.x,
                this.player.y,
                'bullet'
            );
            const angle = angles[i % angles.length];
            bullet.setVelocityY(-this.player.bulletSpeed);
            if (angle !== 0) {
                bullet.setVelocityX(angle * 20);
            }
        }
    }

    spawnAsteroid() {
        const asteroid = this.add.text(
            Phaser.Math.Between(40, this.width - 40),
            -50,
            '({})',
            {
                fontSize: '16px',
                fill: '#888'
            }
        ).setOrigin(0.5);
        asteroid.speed = Phaser.Math.Between(100, 200);
        this.asteroids.push(asteroid);
    }

    spawnSatellite() {
        const satellite = this.add.text(
            Phaser.Math.Between(40, this.width - 40),
            -50,
            '\\--(O)--\\',
            {
                fontSize: '16px',
                fill: '#f00'
            }
        ).setOrigin(0.5);
        satellite.speed = Phaser.Math.Between(150, 250);
        this.satellites.push(satellite);
    }

    update(time, delta) {
        if (!this.gameStarted || this.gameOver) return;

        // Update player position based on input
        const moveSpeed = this.player.speed * (delta / 1000);

        // Handle both arrow keys and WASD with proper bounds
        if ((this.cursors.left.isDown || this.wasdKeys.left.isDown) && this.player.x > 40) {
            this.player.x -= moveSpeed;
        }
        if ((this.cursors.right.isDown || this.wasdKeys.right.isDown) && this.player.x < this.width - 40) {
            this.player.x += moveSpeed;
        }
        if ((this.cursors.up.isDown || this.wasdKeys.up.isDown) && this.player.y > 100) {
            this.player.y -= moveSpeed;
        }
        if ((this.cursors.down.isDown || this.wasdKeys.down.isDown) && this.player.y < this.height - 40) {
            this.player.y += moveSpeed;
        }

        this.playerSprite.setPosition(this.player.x, this.player.y);

        // Update bullets with bounds check
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= 7;
            if (bullet.y < -20) {
                bullet.destroy();
                this.bullets.splice(i, 1);
            }
        }

        // Update asteroids and satellites with proper bounds
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.y += asteroid.speed * (delta / 1000);
            if (asteroid.y > this.height + 50) {
                asteroid.destroy();
                this.asteroids.splice(i, 1);
            }
        }

        for (let i = this.satellites.length - 1; i >= 0; i--) {
            const satellite = this.satellites[i];
            satellite.y += satellite.speed * (delta / 1000);
            if (satellite.y > this.height + 50) {
                satellite.destroy();
                this.satellites.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update score and lives text
        this.scoreText.setText(`Score: ${this.previousScore + this.player.score}`);
        this.livesText.setText(`Lives: ${this.player.lives}`);

        // Check game over condition
        if (this.player.lives <= 0) {
            this.gameOver = true;
            this.showGameOver();
        }
    }

    checkCollisions() {
        // Check bullet collisions
        this.bullets.forEach((bullet, bulletIndex) => {
            // Check asteroid collisions
            this.asteroids.forEach((asteroid, asteroidIndex) => {
                const bulletBounds = bullet.getBounds();
                const asteroidBounds = asteroid.getBounds();

                if (Phaser.Geom.Intersects.RectangleToRectangle(bulletBounds, asteroidBounds)) {
                    // Create explosion effect
                    const explosion = this.add.text(asteroid.x, asteroid.y, '*BOOM*', {
                        fontSize: '20px',
                        fill: '#ff0'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: explosion,
                        alpha: 0,
                        scale: 2,
                        duration: 500,
                        onComplete: () => explosion.destroy()
                    });

                    bullet.destroy();
                    this.bullets.splice(bulletIndex, 1);
                    asteroid.destroy();
                    this.asteroids.splice(asteroidIndex, 1);
                    this.player.score += 10;
                }
            });

            // Check satellite collisions
            this.satellites.forEach((satellite, satelliteIndex) => {
                const bulletBounds = bullet.getBounds();
                const satelliteBounds = satellite.getBounds();

                if (Phaser.Geom.Intersects.RectangleToRectangle(bulletBounds, satelliteBounds)) {
                    // Create hit effect
                    const hit = this.add.text(satellite.x, satellite.y, '*HIT*', {
                        fontSize: '20px',
                        fill: '#f00'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: hit,
                        alpha: 0,
                        scale: 2,
                        duration: 500,
                        onComplete: () => hit.destroy()
                    });

                    bullet.destroy();
                    this.bullets.splice(bulletIndex, 1);
                    satellite.destroy();
                    this.satellites.splice(satelliteIndex, 1);
                    this.player.lives -= 1;
                }
            });
        });

        // Check player collisions with expanded hitbox
        const playerBounds = this.playerSprite.getBounds();
        playerBounds.x += 10; // Shrink hitbox horizontally
        playerBounds.width -= 20;
        playerBounds.y += 5; // Shrink hitbox vertically
        playerBounds.height -= 10;

        this.asteroids.forEach((asteroid, asteroidIndex) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                playerBounds,
                asteroid.getBounds()
            )) {
                // Create collision effect
                const collision = this.add.text(this.player.x, this.player.y, '**CRASH**', {
                    fontSize: '24px',
                    fill: '#f00'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: collision,
                    alpha: 0,
                    scale: 2,
                    duration: 800,
                    onComplete: () => collision.destroy()
                });

                asteroid.destroy();
                this.asteroids.splice(asteroidIndex, 1);
                this.player.lives -= 1;

                // Flash player on hit
                this.tweens.add({
                    targets: this.playerSprite,
                    alpha: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 100
                });
            }
        });

        this.satellites.forEach((satellite, satelliteIndex) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                playerBounds,
                satellite.getBounds()
            )) {
                // Create collision effect
                const collision = this.add.text(this.player.x, this.player.y, '**ZAP**', {
                    fontSize: '24px',
                    fill: '#f00'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: collision,
                    alpha: 0,
                    scale: 2,
                    duration: 800,
                    onComplete: () => collision.destroy()
                });

                satellite.destroy();
                this.satellites.splice(satelliteIndex, 1);
                this.player.lives -= 1;

                // Flash player on hit
                this.tweens.add({
                    targets: this.playerSprite,
                    alpha: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 100
                });
            }
        });
    }

    showGameOver() {
        // Stop spawning
        if (this.asteroidTimer) this.asteroidTimer.destroy();
        if (this.satelliteTimer) this.satelliteTimer.destroy();

        const gameOverText = this.add.text(this.width / 2, this.height / 2, 'Game Over!', {
            fontSize: '48px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        // Add continue button with proper positioning
        const continueButton = this.add.text(this.width / 2, this.height / 2 + 100, 'Continue to Trivia', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#4a4',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        continueButton.on('pointerover', () => continueButton.setTint(0x88ff88));
        continueButton.on('pointerout', () => continueButton.clearTint());
        continueButton.on('pointerdown', () => {
            // Save score before transitioning
            if (this.player.score > 0) {
                localStorage.setItem('currentScore', this.previousScore + this.player.score);
            }
            // If we're in intro mode or have no next scene, go to map1_game
            const nextScene = this.isIntro || !this.nextScene ? 'map1_game' : this.nextScene;
            this.scene.start(nextScene, { score: this.previousScore + this.player.score });
        });

        // Add play again button
        const playAgainButton = this.add.text(this.width / 2, this.height / 2 + 160, 'Play Again', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#44a',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        playAgainButton.on('pointerover', () => playAgainButton.setTint(0x8888ff));
        playAgainButton.on('pointerout', () => playAgainButton.clearTint());
        playAgainButton.on('pointerdown', () => {
            this.resetGame();
            this.scene.restart();
        });
    }

    showWin() {
        if (this.asteroidTimer) this.asteroidTimer.destroy();
        if (this.satelliteTimer) this.satelliteTimer.destroy();

        const winText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, 'You Win!\nPress SPACE to continue', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            if (!this.isIntro) {
                this.scene.start(this.nextScene, { score: this.previousScore + this.player.score });
            }
        });
    }

    gameOver() {
        this.playSound('gameOver');
        alert(`Game Over!\nYour Score: ${this.score}`);
        this.resetGame();
        // Return to the sort selection scene to start the sorting
        const sortScene = this.scene.get('sort_selection');
        const algorithm = sortScene.currentSortAlgorithm;
        
        // Start the sorting animation
        this.scene.start('sort_selection');
        sortScene.startSortingAnimation(algorithm);
    }
}