import { getAssetPath } from "../utils/assetLoader";
import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from 'phaser';
import SceneOrderManager from '../utils/SceneOrderManager';
import MiniGameManager from '../utils/MiniGameManager';

export default class SortSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'sort_selection' });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.currentMap = 1;
        this.questions = null;
        this.thumbnails = [];
        this.answeredQuestions = 0;
        this.isTransitioning = false;
        this.clickCooldown = false;
        this.selected = null;
        this.sceneManager = new SceneOrderManager();
        this.currentSortAlgorithm = null;
        this.sortingInProgress = false;
        this.miniGameManager = MiniGameManager.getInstance();
    }

    preload() {
        console.log('SortSelectionScene preload started');

        // Load button assets
        this.load.image('button', getAssetPath('public/images/button.png'));
        
        const nextMiniGame = this.miniGameManager.getNextMiniGame();
        if (nextMiniGame) {
            this.load.image(nextMiniGame, getAssetPath(`public/images/${nextMiniGame}.png`));
        }

        // Map 1 thumbnails
        this.load.image('map1scene164', getAssetPath('public/images/thumbnails/map1scene164.png'));
        this.load.image('map1scene264', getAssetPath('public/images/thumbnails/map1scene264.png'));
        this.load.image('map1scene364', getAssetPath('public/images/thumbnails/map1scene364.png'));
        this.load.image('map1scene464', getAssetPath('public/images/thumbnails/map1scene464.png'));

        // Map 2 thumbnails
        this.load.image('map2scene164', getAssetPath('public/images/thumbnails/map2scene164.png'));
        this.load.image('map2scene264', getAssetPath('public/images/thumbnails/map2scene264.png'));
        this.load.image('map2scene364', getAssetPath('public/images/thumbnails/map2scene364.png'));
        this.load.image('map2scene464', getAssetPath('public/images/thumbnails/map2scene464.png'));

        // Map 3 thumbnails
        this.load.image('map3scene164', getAssetPath('public/images/thumbnails/map3scene164.png'));
        this.load.image('map3scene264', getAssetPath('public/images/thumbnails/map3scene264.png'));
        this.load.image('map3scene364', getAssetPath('public/images/thumbnails/map3scene364.png'));
        this.load.image('map3scene464', getAssetPath('public/images/thumbnails/map3scene464.png'));

        // Load sorting algorithm buttons
        this.load.image('button_bg', getAssetPath('public/images/button_bg.png'));
        
        console.log('SortSelectionScene preload completed');
    }

    create() {
        console.log('SortSelectionScene create started');
        // Set background color
        this.cameras.main.setBackgroundColor('#000000');

        // Initialize thumbnails in random order
        this.initializeThumbnails();

        // Add title
        this.add.text(400, 50, 'Choose Your Sorting Algorithm', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        console.log('SortSelectionScene create completed');
    }

    initializeThumbnails() {
        console.log('Initializing thumbnails');
        // Create thumbnails in random order
        const thumbnailKeys = [
            'map1scene164', 'map1scene264', 'map1scene364', 'map1scene464',
            'map2scene164', 'map2scene264', 'map2scene364', 'map2scene464',
            'map3scene164', 'map3scene264', 'map3scene364', 'map3scene464'
        ];

        // Shuffle the array
        for (let i = thumbnailKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [thumbnailKeys[i], thumbnailKeys[j]] = [thumbnailKeys[j], thumbnailKeys[i]];
        }

        // Calculate matrix layout
        const cols = 4;
        const rows = 3;
        const spacing = 160;
        const startX = 200;
        const startY = 150;

        // Create thumbnail sprites in a matrix
        thumbnailKeys.forEach((key, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * spacing;
            const y = startY + row * spacing;

            const thumbnail = this.add.sprite(x, y, key)
                .setScale(0.3)
                .setInteractive({ useHandCursor: true });

            // Add hover effect
            thumbnail.on('pointerover', () => {
                thumbnail.setTint(0x66ff66);
            });

            thumbnail.on('pointerout', () => {
                thumbnail.clearTint();
            });

            this.thumbnails.push({
                sprite: thumbnail,
                value: parseInt(key.match(/\d+/)[0]) // Extract numeric value for sorting
            });
        });

        // Add sorting algorithm buttons at the bottom
        const algorithms = ['Bubble Sort', 'Quick Sort', 'Merge Sort'];
        const buttonSpacing = 250;
        const buttonY = 500;

        algorithms.forEach((algo, index) => {
            const x = 200 + index * buttonSpacing;
            const button = this.add.sprite(x, buttonY, 'button')
                .setInteractive({ useHandCursor: true });

            const text = this.add.text(x, buttonY, algo, {
                fontSize: '24px',
                fill: '#000'
            }).setOrigin(0.5);

            button.on('pointerover', () => {
                button.setTint(0x66ff66);
                text.setStyle({ fill: '#fff' });
            });

            button.on('pointerout', () => {
                button.clearTint();
                text.setStyle({ fill: '#000' });
            });

            button.on('pointerup', () => {
                if (!this.sortingInProgress) {
                    console.log(`Starting ${algo} algorithm`);
                    this.startSorting(algo.toLowerCase().replace(' ', '_'));
                }
            });
        });
    }

    async startSorting(algorithm) {
        if (this.sortingInProgress) return;
        
        this.sortingInProgress = true;
        this.currentSortAlgorithm = algorithm;
        console.log(`Starting sorting with ${algorithm}`);

        // Start with a mini game first
        const nextMiniGame = this.miniGameManager.getNextMiniGame();
        if (nextMiniGame) {
            console.log(`Starting mini game: ${nextMiniGame}`);
            this.scene.start(nextMiniGame);
            return;
        }

        // The sorting game will be started by the mini game's gameOver function
        this.sortingInProgress = false;
    }

    async startSortingAnimation(algorithm) {
        switch (algorithm) {
            case 'bubble_sort':
                await this.bubbleSort();
                break;
            case 'quick_sort':
                await this.quickSort(0, this.thumbnails.length - 1);
                break;
            case 'merge_sort':
                await this.mergeSort(0, this.thumbnails.length - 1);
                break;
        }
        console.log('Sorting completed');
        this.sortingInProgress = false;
    }

    async swapThumbnails(i, j) {
        const temp = this.thumbnails[i];
        this.thumbnails[i] = this.thumbnails[j];
        this.thumbnails[j] = temp;

        // Animate the swap
        await Promise.all([
            this.tweenThumbnail(this.thumbnails[i], i),
            this.tweenThumbnail(this.thumbnails[j], j)
        ]);
    }

    tweenThumbnail(thumbnail, position) {
        const col = position % 4;
        const row = Math.floor(position / 4);
        const x = 200 + col * 160;
        const y = 150 + row * 160;

        return new Promise(resolve => {
            this.tweens.add({
                targets: thumbnail.sprite,
                x: x,
                y: y,
                duration: 500,
                ease: 'Power2',
                onComplete: resolve
            });
        });
    }

    async bubbleSort() {
        const n = this.thumbnails.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.thumbnails[j].value > this.thumbnails[j + 1].value) {
                    await this.swapThumbnails(j, j + 1);
                }
            }
        }
    }

    async quickSort(low, high) {
        if (low < high) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.thumbnails[high].value;
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (this.thumbnails[j].value < pivot) {
                i++;
                await this.swapThumbnails(i, j);
            }
        }
        await this.swapThumbnails(i + 1, high);
        return i + 1;
    }

    async mergeSort(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await this.mergeSort(left, mid);
            await this.mergeSort(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }

    async merge(left, mid, right) {
        const temp = this.thumbnails.slice(left, right + 1);
        let i = left;
        let j = mid + 1;
        let k = left;

        while (i <= mid && j <= right) {
            if (this.thumbnails[i].value <= this.thumbnails[j].value) {
                temp[k - left] = this.thumbnails[i];
                i++;
            } else {
                temp[k - left] = this.thumbnails[j];
                j++;
            }
            k++;
        }

        while (i <= mid) {
            temp[k - left] = this.thumbnails[i];
            i++;
            k++;
        }

        while (j <= right) {
            temp[k - left] = this.thumbnails[j];
            j++;
            k++;
        }

        // Copy back and animate
        for (let i = left; i <= right; i++) {
            this.thumbnails[i] = temp[i - left];
            await this.tweenThumbnail(this.thumbnails[i], i);
        }
    }
}