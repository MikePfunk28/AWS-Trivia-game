import Phaser from 'phaser';
import BootScene from './scenes/bootscene';
import GameScene from './scenes/map1/GameScene';
import GameOver from './scenes/gameover';
// Import other scenes as needed

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, GameScene, GameOver], // Add your scenes here
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    // Additional configurations as needed
};

const game = new Phaser.Game(config);
