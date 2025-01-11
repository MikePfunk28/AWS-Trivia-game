import * as Phaser from 'phaser';

export default class Button extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 160, 40, 0x00ff00); // Green rectangle for button
        scene.add.existing(this);
        this.setOrigin(0.5);
        this.init();
    }

    init() {
        // Add any initialization logic here
        this.setInteractive({ useHandCursor: true });
        
        // Default state
        this.setFillStyle(0x00ff00);
        
        // Add hover effects
        this.on('pointerover', () => {
            this.setFillStyle(0x00ff00); // Brighter green
            this.setAlpha(0.8);
        });
        
        this.on('pointerout', () => {
            this.setFillStyle(0x00ff00); // Normal green
            this.setAlpha(1);
        });
    }
}
