import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'testscene' });
    }

    preload() {
        // Nothing to preload for this test
    }

    create() {
        // Set background color
        this.cameras.main.setBackgroundColor('#3498db');

        // Add some text
        this.add.text(400, 300, 'Test Scene Working!', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add instructions
        this.add.text(400, 350, 'Click anywhere to change color', {
            font: '16px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Add click handler
        this.input.on('pointerdown', () => {
            // Generate random color
            const color = Phaser.Display.Color.RandomRGB();
            this.cameras.main.setBackgroundColor(color);
        });
    }

    update() {
        // Nothing needed in update for this test
    }
}
