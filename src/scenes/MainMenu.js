import { getAssetPath } from "../utils/assetLoader";
import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from 'phaser';
import SceneOrderManager from '../utils/SceneOrderManager';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(512, 384, 'background');
        this.add.image(512, 200, 'logo');

        // Title
        this.add.text(512, 300, 'AWS Certification Trainer', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Create menu items
        const menuItems = [
            { text: 'Start AWS Training', scene: 'map1_game' },
            { text: 'Space Invaders', scene: 'space_invaders', data: { isIntro: true } },
            { text: 'Chess Game', scene: 'chess_game' },
            { text: 'High Scores', scene: 'high_scores' }
        ];

        let yPosition = 400;
        menuItems.forEach(item => {
            const menuItem = this.add.text(512, yPosition, item.text, {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#ffffff',
                backgroundColor: '#4a4a4a',
                padding: { x: 20, y: 10 }
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            // Hover effects
            menuItem.on('pointerover', () => {
                menuItem.setBackgroundColor('#6a6a6a');
                menuItem.setScale(1.1);
            });

            menuItem.on('pointerout', () => {
                menuItem.setBackgroundColor('#4a4a4a');
                menuItem.setScale(1.0);
            });

            // Click handler
            menuItem.on('pointerdown', () => {
                // Save current high score if exists
                const currentScore = localStorage.getItem('currentScore');
                if (currentScore) {
                    const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
                    highScores.push(parseInt(currentScore));
                    highScores.sort((a, b) => b - a);
                    localStorage.setItem('highScores', JSON.stringify(highScores.slice(0, 10)));
                }

                // Start the selected scene
                this.scene.start(item.scene, item.data);
            });

            yPosition += 60;
        });

        // Add version number
        this.add.text(16, this.game.config.height - 30, 'v1.0.0', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff'
        });

        // Add high score display
        const highScores = JSON.parse(localStorage.getItem('highScores') || '[]');
        if (highScores.length > 0) {
            this.add.text(this.game.config.width - 150, 16, `High Score: ${highScores[0]}`, {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#ffffff'
            });
        }
    }
}