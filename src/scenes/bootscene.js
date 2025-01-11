import { getAssetPath } from "../utils/assetLoader";
import * as Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bootscene' });
        this.ascii = `
        *     *        .     *       .     *     .     *
         .       .      .     #       .           .
            .      *           .-+- .         *  .    '
                   .   #     .-'   '-.       .
         *  .        .     .'         '.        *    .
         -+-      *      /   .   .   .   \\    .    .
      .  /|\\            /   .     .     .   \\      #
         /|\\           /   /   .     .     \\   \\    .
        /|\\          /   /   /   .     \\   \\   \\
       /||o\\     |  /   /   /   /   \\   \\   \\   \\  |
      /o|||\\    |  .   /   /   /   \\   \\   \\   .  |
     /||o||\\    |  |   .   /   /   \\   \\   .   |  |
    /o||o||\\    |  |   |   .   /   \\   .   |   |  |
   /||o||o|\\    |  |   |   |   .   .   |   |   |  |
        `;
    }

    init(data) {
        this.score = data.score || 0;
    }

    preload() {
        // Load button assets - using absolute path
        this.load.image('button', getAssetPath('public/images/button.png'));
        
        // Load other assets
        this.load.image('map1scene1', getAssetPath('public/images/map1scene1.png'));
        this.load.json('map-config', getAssetPath('public/data/map1/map-config.json'));
        this.load.json('questions', getAssetPath('public/data/questions.json'));
        this.load.bitmapFont('arcade',
            getAssetPath('public/fonts/arcade.png'),
            getAssetPath('public/fonts/arcade.xml')
        );

        // Load feedback marks
        this.load.image('checkMark', getAssetPath('public/images/checkmark.png'));
        this.load.image('xMark', getAssetPath('public/images/xmark.png'));
    }

    create() {
        // Set background color to black
        this.cameras.main.setBackgroundColor('#000000');

        // Add ASCII art background
        const asciiText = this.add.text(400, 300, this.ascii, {
            font: '12px monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add welcome text
        this.add.text(400, 150, 'Welcome to AWS Trivia Game!', {
            fill: '#fff',
            fontSize: '32px'
        }).setOrigin(0.5);

        // Add description text
        this.add.text(400, 220, 'Learn AWS while exploring data structures\nand sorting algorithms!', {
            fill: '#fff',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        // Create green rectangle as fallback if button image fails to load
        const buttonBg = this.add.rectangle(400, 300, 200, 50, 0x00ff00);
        buttonBg.setInteractive({ useHandCursor: true });

        // Create Start button sprite on top of rectangle
        const startButton = this.add.sprite(400, 300, 'button');
        if (startButton.texture.key === '__MISSING') {
            // If button texture failed to load, hide the sprite
            startButton.setVisible(false);
        } else {
            // If button texture loaded, hide the rectangle and setup the sprite
            buttonBg.setVisible(false);
            startButton.setScale(0.5);
            startButton.setInteractive({ useHandCursor: true });
        }
        
        // Add button text
        const buttonText = this.add.text(400, 300, 'Start Game', {
            fontSize: '24px',
            fill: '#000000',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Add hover effects to both button and fallback
        buttonBg.on('pointerover', () => {
            buttonBg.setFillStyle(0x66ff66);
            buttonText.setStyle({ fill: '#ffffff' });
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setFillStyle(0x00ff00);
            buttonText.setStyle({ fill: '#000000' });
        });
        
        startButton.on('pointerover', () => {
            startButton.setTint(0x66ff66);
            buttonText.setStyle({ fill: '#ffffff' });
        });
        
        startButton.on('pointerout', () => {
            startButton.clearTint();
            buttonText.setStyle({ fill: '#000000' });
        });
        
        // Add click handlers to both
        const startGame = () => {
            console.log('Starting game...');
            this.scene.start('sort_selection', { score: 0 });
        };
        
        buttonBg.on('pointerup', startGame);
        startButton.on('pointerup', startGame);

        // Add back button (using same pattern)
        const backBg = this.add.rectangle(100, 50, 100, 30, 0x00ff00);
        backBg.setInteractive({ useHandCursor: true });

        const backButton = this.add.sprite(100, 50, 'button');
        if (backButton.texture.key === '__MISSING') {
            backButton.setVisible(false);
        } else {
            backBg.setVisible(false);
            backButton.setScale(0.3);
            backButton.setInteractive({ useHandCursor: true });
        }

        const backText = this.add.text(100, 50, 'Back', {
            fontSize: '20px',
            fill: '#000000',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        backBg.on('pointerover', () => {
            backBg.setFillStyle(0x66ff66);
            backText.setStyle({ fill: '#ffffff' });
        });

        backBg.on('pointerout', () => {
            backBg.setFillStyle(0x00ff00);
            backText.setStyle({ fill: '#000000' });
        });

        backButton.on('pointerover', () => {
            backButton.setTint(0x66ff66);
            backText.setStyle({ fill: '#ffffff' });
        });

        backButton.on('pointerout', () => {
            backButton.clearTint();
            backText.setStyle({ fill: '#000000' });
        });

        const goBack = () => {
            console.log('Going back...');
            this.scene.start('bootscene');
        };

        backBg.on('pointerup', goBack);
        backButton.on('pointerup', goBack);
    }
}