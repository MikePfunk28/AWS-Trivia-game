import { getAssetPath } from "../utils/assetLoader";
import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from '../../node_modules/phaser/dist/phaser.min.js';
import SceneOrderManager from '../utils/SceneOrderManager';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'gameover' });
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        // Game Over text
        this.add.text(400, 200, 'Game Over', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Score text
        this.add.text(400, 300, `Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create Start/Reset button using button.png
        const startButton = this.add.sprite(400, 400, 'button');
        startButton.setScale(0.5);
        startButton.setInteractive({ useHandCursor: true });

        // Add white text overlay
        const buttonText = this.add.text(400, 400, 'Start/Reset', {
            fontSize: '24px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Add hover effects
        startButton.on('pointerover', () => {
            startButton.setTint(0x66ff66); // Light green tint
            buttonText.setStyle({ fill: '#ffffff' });
        });
        
        startButton.on('pointerout', () => {
            startButton.clearTint();
            buttonText.setStyle({ fill: '#ffffff' });
        });
        
        // Add click handler for both Start and Reset functionality
        startButton.on('pointerup', () => {
            // Reset game state
            this.registry.set('score', 0);
            localStorage.removeItem('gameProgress');
            
            // Start fresh game
            this.scene.start('bootscene', { score: 0 });
        });
    }
}
