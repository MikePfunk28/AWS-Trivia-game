import { getAssetPath } from '../utils/assetLoader';
import * as Phaser from 'phaser';

export default class DataStructureSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'data_structure_selection' });
        this.selectedStructure = null;
    }

    preload() {
        // Load button assets if not already loaded
        if (!this.textures.exists('button')) {
            this.load.image('button', getAssetPath('images/button.png'));
            this.load.image('button_hover', getAssetPath('images/button_hover.png'));
        }

        // Load data structure icons
        this.load.image('array_icon', getAssetPath('images/data_structures/array.png'));
        this.load.image('linkedlist_icon', getAssetPath('images/data_structures/linkedlist.png'));
        this.load.image('tree_icon', getAssetPath('images/data_structures/tree.png'));
        this.load.image('graph_icon', getAssetPath('images/data_structures/graph.png'));
    }

    create() {
        // Title
        this.add.text(400, 100, 'Select a Data Structure', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create data structure options
        const structures = [
            { name: 'Array', operations: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search'] },
            { name: 'Linked List', operations: ['Insertion Sort', 'Merge Sort', 'Reverse Traversal'] },
            { name: 'Binary Tree', operations: ['In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal'] },
            { name: 'Graph', operations: ['Depth-First Search', 'Breadth-First Search', 'Dijkstra\'s Algorithm'] }
        ];

        structures.forEach((structure, index) => {
            const x = 200 + (index % 2) * 400;
            const y = 250 + Math.floor(index / 2) * 200;

            // Create structure container
            const container = this.add.container(x, y);

            // Add button background
            const button = this.add.image(0, 0, 'button')
                .setScale(0.8)
                .setInteractive({ useHandCursor: true });

            // Add structure icon
            const icon = this.add.image(-80, 0, `${structure.name.toLowerCase()}_icon`)
                .setScale(0.5);

            // Add structure name
            const nameText = this.add.text(0, -30, structure.name, {
                fontSize: '24px',
                fill: '#000'
            }).setOrigin(0.5);

            // Add operations text
            const opsText = this.add.text(0, 20, 'Operations:', {
                fontSize: '16px',
                fill: '#000'
            }).setOrigin(0.5);

            // Add operation list
            const operationsList = structure.operations.map((op, i) => 
                this.add.text(0, 40 + i * 20, `• ${op}`, {
                    fontSize: '14px',
                    fill: '#000'
                }).setOrigin(0.5)
            );

            // Add all elements to container
            container.add([button, icon, nameText, opsText, ...operationsList]);

            // Add hover effects
            button.on('pointerover', () => {
                button.setTexture('button_hover');
                nameText.setStyle({ fill: '#ff0' });
            });

            button.on('pointerout', () => {
                button.setTexture('button');
                nameText.setStyle({ fill: '#000' });
            });

            // Add click handler
            button.on('pointerup', () => {
                this.selectedStructure = structure.name.toLowerCase();
                // Start the sort selection scene with the chosen structure
                this.scene.start('sort_selection', {
                    dataStructure: this.selectedStructure,
                    operations: structure.operations,
                    score: this.score
                });
            });
        });

        // Add back button
        const backButton = this.add.image(100, 50, 'button')
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        const backText = this.add.text(100, 50, 'Back', {
            fontSize: '20px',
            fill: '#000'
        }).setOrigin(0.5);

        backButton.on('pointerover', () => {
            backButton.setTexture('button_hover');
            backText.setStyle({ fill: '#ff0' });
        });

        backButton.on('pointerout', () => {
            backButton.setTexture('button');
            backText.setStyle({ fill: '#000' });
        });

        backButton.on('pointerup', () => {
            this.scene.start('bootscene');
        });
    }
}
