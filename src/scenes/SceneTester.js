import Phaser from 'phaser';

export default class SceneTester extends Phaser.Scene {
    constructor() {
        super({ key: 'scenetester' });
        this.scenes = [
            { key: 'testscene', name: 'Test Scene' },
            { key: 'bootscene', name: 'Boot Scene' },
            { key: 'mainmenu', name: 'Main Menu' },
            { key: 'datastructureselection', name: 'Data Structure Selection' },
            { key: 'spaceinvaders', name: 'Space Invaders' },
            { key: 'sortselection', name: 'Sort Selection' },
            { key: 'gamescene', name: 'Game Scene 1' },
            { key: 'tetris', name: 'Tetris' },
            { key: 'gamescene2', name: 'Game Scene 2' },
            { key: 'gamescene3', name: 'Game Scene 3' },
            { key: 'gamescene4', name: 'Game Scene 4' },
            { key: 'map2gamescene', name: 'Map 2 Scene 1' },
            { key: 'map2gamescene2', name: 'Map 2 Scene 2' },
            { key: 'map2gamescene3', name: 'Map 2 Scene 3' },
            { key: 'map2gamescene4', name: 'Map 2 Scene 4' },
            { key: 'map3gamescene', name: 'Map 3 Scene 1' },
            { key: 'map3gamescene2', name: 'Map 3 Scene 2' },
            { key: 'map3gamescene3', name: 'Map 3 Scene 3' },
            { key: 'map3gamescene4', name: 'Map 3 Scene 4' },
            { key: 'map4gamescene', name: 'Map 4 Scene 1' },
            { key: 'map4gamescene2', name: 'Map 4 Scene 2' },
            { key: 'map4gamescene3', name: 'Map 4 Scene 3' },
            { key: 'map4gamescene4', name: 'Map 4 Scene 4' },
            { key: 'gameover', name: 'Game Over' },
            { key: 'preloader', name: 'Preloader' }
        ];
    }

    create() {
        // Set background
        this.cameras.main.setBackgroundColor('#2c3e50');

        // Add title
        this.add.text(400, 50, 'Scene Tester', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add instruction
        this.add.text(400, 90, 'Click a scene to test it', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add scene buttons
        const buttonWidth = 200;
        const buttonHeight = 30;
        const columns = 3;
        const padding = 10;
        const startX = 400 - ((buttonWidth + padding) * columns) / 2 + buttonWidth/2;
        const startY = 150;

        this.scenes.forEach((scene, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = startX + col * (buttonWidth + padding);
            const y = startY + row * (buttonHeight + padding);

            // Create button background
            const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x3498db);
            button.setInteractive();

            // Add button text
            const text = this.add.text(x, y, scene.name, {
                font: '16px Arial',
                fill: '#ffffff'
            }).setOrigin(0.5);

            // Add hover effect
            button.on('pointerover', () => {
                button.setFillStyle(0x2980b9);
            });

            button.on('pointerout', () => {
                button.setFillStyle(0x3498db);
            });

            // Add click handler
            button.on('pointerdown', () => {
                console.log(`Starting scene: ${scene.key}`);
                try {
                    this.scene.start(scene.key);
                } catch (error) {
                    console.error(`Error starting scene ${scene.key}:`, error);
                    text.setText(`${scene.name} (Error)`);
                    text.setFill('#e74c3c');
                }
            });
        });

        // Add back button
        const backY = startY + Math.ceil(this.scenes.length / columns) * (buttonHeight + padding) + 20;
        const backButton = this.add.rectangle(400, backY, 150, 40, 0xe74c3c);
        backButton.setInteractive();

        this.add.text(400, backY, 'Reset', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        backButton.on('pointerover', () => {
            backButton.setFillStyle(0xc0392b);
        });

        backButton.on('pointerout', () => {
            backButton.setFillStyle(0xe74c3c);
        });

        backButton.on('pointerdown', () => {
            this.scene.start('scenetester');
        });
    }
}
