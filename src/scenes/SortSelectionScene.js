import { getAssetPath } from "/src/utils/assetLoader";
import Player from '/src/gameobjects/player';
import Generator from '/src/gameobjects/generator';
import Phaser, { Scene } from 'phaser'; // Default import
import SceneOrderManager from '/src/utils/SceneOrderManager';

export default class SortSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'sort_selection' });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.currentMap = 1;
        this.questions = null;
        this.icons = [];
        this.answeredQuestions = 0;
        this.isTransitioning = false;
        this.clickCooldown = false;
        this.selected = null;
        this.sceneManager = new SceneOrderManager();
    }

    preload() {
        // Map 1 thumbnails
        this.load.image('map1scene164', getAssetPath('images/thumbnails/map1scene164.png'));
        this.load.image('map1scene264', getAssetPath('images/thumbnails/map1scene264.png'));
        this.load.image('map1scene364', getAssetPath('images/thumbnails/map1scene364.png'));
        this.load.image('map1scene464', getAssetPath('images/thumbnails/map1scene464.png'));

        // Map 2 thumbnails
        this.load.image('map2scene164', getAssetPath('images/thumbnails/map2scene164.png'));
        this.load.image('map2scene264', getAssetPath('images/thumbnails/map2scene264.png'));
        this.load.image('map2scene364', getAssetPath('images/thumbnails/map2scene364.png'));
        this.load.image('map2scene464', getAssetPath('images/thumbnails/map2scene464.png'));

        // Map 3 thumbnails
        this.load.image('map3scene164', getAssetPath('images/thumbnails/map3scene164.png'));
        this.load.image('map3scene264', getAssetPath('images/thumbnails/map3scene264.png'));
        this.load.image('map3scene364', getAssetPath('images/thumbnails/map3scene364.png'));
        this.load.image('map3scene464', getAssetPath('images/thumbnails/map3scene464.png'));
    }

    create() {
        // Title
        this.add.text(400, 50, 'Select Sorting Method', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create thumbnail container
        this.container = this.add.container(400, 300);

        // Create thumbnails
        const thumbnailKeys = [
            'map1scene164', 'map1scene264', 'map1scene364', 'map1scene464',
            'map2scene164', 'map2scene264', 'map2scene364', 'map2scene464',
            'map3scene164', 'map3scene264', 'map3scene364', 'map3scene464'
        ];

        thumbnailKeys.forEach((key, index) => {
            const x = (index % 4) * 70 - 105;
            const y = Math.floor(index / 4) * 70 - 70;
            const thumb = this.add.image(x, y, key);
            this.container.add(thumb);
        });

        // Sort method buttons
        const sorts = [
            { text: 'Bubble Sort', method: 'bubble' },
            { text: 'Quick Sort', method: 'quick' },
            { text: 'Merge Sort', method: 'merge' }
        ];

        sorts.forEach((sort, index) => {
            const button = this.add.text(400, 450 + (index * 40), sort.text, {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#333',
                padding: { x: 10, y: 5 }
            })
                .setOrigin(0.5)
                .setInteractive();

            button.on('pointerover', () => button.setTint(0x00ff00));
            button.on('pointerout', () => button.clearTint());
            button.on('pointerdown', () => this.selectSort(sort.method));
        });
    }

    selectSort(method) {
        this.selected = method;
        this.sceneManager.setSortMethod(method);
        this.animateSort();
    }

    animateSort() {
        const elements = this.container.list;
        switch (this.selected) {
            case 'bubble':
                this.animateBubbleSort(elements);
                console.log('Bubble Sort Selected')
                this.startGame;
                break;
            case 'quick':
                this.animateQuickSort(elements);
                console.log('Quick Sort Selected')
                this.startGame();
                break;
            case 'merge':
                this.animateMergeSort(elements);
                console.log('Merge Sort Selected')
                this.startGame();
                break;
        }
    }

    animateBubbleSort(elements) {
        let i = 0;
        let j = 0;

        const timer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (j < elements.length - i - 1) {
                    if (elements[j].x > elements[j + 1].x) {
                        this.tweens.add({
                            targets: [elements[j], elements[j + 1]],
                            x: elements[j].x < elements[j + 1].x ?
                                `+=${70}` : `-=${70}`,
                            duration: 300
                        });
                        [elements[j], elements[j + 1]] = [elements[j + 1], elements[j]];
                    }
                    j++;
                } else {
                    i++;
                    j = 0;
                }

                if (i >= elements.length) {
                    timer.destroy();
                    this.startGame();
                }
            },
            loop: true
        });
    }

    startGame() {
        this.time.delayedCall(1000, () => {
            const firstScene = this.sceneManager.getFirstScene();
            this.scene.start(firstScene, {
                sortType: this.selected,
                structure: this.container.list,
                sortedScenes: this.sceneManager.getSortedScenes()
            });
        });
    }
}