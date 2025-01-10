import { getAssetPath } from "/src/utils/assetLoader";
import Player from '/src/gameobjects/player';
import Generator from '/src/gameobjects/generator';
import Phaser, { Scene } from 'phaser'; // Default import
import SceneOrderManager from '/src/utils/SceneOrderManager';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bootscene' });
        const asciiBackground = document.getElementById('ascii-background');
        const asciiBackground2 = document.getElementById('/public/assets/images/ASCII-Art-Night-Sky.txt');
        const asciiText = asciiBackground.textContent;
        console.log(asciiText);
    }

    init(data) {
        this.score = data.score || 0;
    }

    preload() {
        // Load assets
        this.load.image('map1scene1', getAssetPath('images/map1scene1.png'));
        this.load.json('map-config', getAssetPath('data/map1/map-config.json'));
        this.load.json('questions', getAssetPath('data/questions.json'));
        this.load.bitmapFont('arcade',
            getAssetPath('fonts/arcade.png'),
            getAssetPath('fonts/arcade.xml')
        );

        // Load feedback marks
        this.load.image('checkMark', getAssetPath('images/checkmark.png'));
        this.load.image('xMark', getAssetPath('images/xmark.png'));
    }

    create() {
        // Initialize sound settings properly
        if (this.sound && this.sound.context) {
            this.sound.pauseOnBlur = false;
        }
        this.add.text(100, 100, 'Welcome to AWS Trivia Game!')
        this.questions = this.cache.json.get('questions');

        
        const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
        helloButton.setInteractive();
        helloButton.on('pointerover', () => { console.log('pointerover'); });
        helloButton.on('pointerout', () => { console.log('pointerout'); });
        helloButton.on('pointerdown', () => { console.log('pointerdown'); });
        helloButton.on('pointerup', () => { console.log('pointerup'); });

        const startButton = this.add.text(100, 100, 'Start!', { fill: '#fff' });
        startButton.setInteractive();
        startButton.on('pointerover', () => { console.log('pointerover'); });
        startButton.on('pointerout', () => { console.log('pointerout'); });
        startButton.on('pointerdown', () => { console.log('pointerdown'); });
        startButton.on('pointerup', () => { console.log('pointerup'); });

        const resetButton = this.add.text(100, 100, 'Reset!', { fill: '#fff' });
        resetButton.setInteractive();
        resetButton.on('pointerover', () => { console.log('pointerover'); });
        resetButton.on('pointerout', () => { console.log('pointerout'); });
        resetButton.on('pointerdown', () => { console.log('pointerdown'); });
        resetButton.on('pointerup', () => { console.log('pointerup'); });


        const mapConfig = this.cache.json.get('map-config'); // Ensure correct key

        const asciiArt = `
        *     *        .     *       .     *     .     *
     *        .     *     *     .     *     .     *     .
        *     *        .     *       .     *     .     *
     *        .     *     *     .     *     .     *     .
        *     *        .     *       .     *     .     *
        `;

        this.add.text(550, 550, asciiArt, { font: '12px monospace', fill: '#ffffff' });

        // Set up the map based on config
        const activeZone = mapConfig.zones[0];
        const map = this.add.image(activeZone.x, activeZone.y, 'map1scene1');
        map.setScale(activeZone.scale);

        // Load AWS icons after we have the config
        this.loadAwsIcons(mapConfig);
        this.setupScore();

    }

    startGame() {
        // Logic to start the game
        this.scene.start('SpaceInvaderScene'); // Transition to the main game scene

    }

    resetGame() {
        // Logic to reset the game
        // You can reload the scene or reset game variables here
        this.scene.restart(); // Restart the current scene
    }

    // ... rest of your BootScene class methods
}