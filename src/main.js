import Phaser from 'phaser';
import BootScene from "./scenes/bootscene";
import GameOver from "./scenes/gameover";
import GameScene from "./scenes/map1/GameScene";
import GameScene2 from "./scenes/map1/GameScene2";
import GameScene3 from "./scenes/map1/GameScene3";
import GameScene4 from "./scenes/map1/GameScene4";

import Map2GameScene from "./scenes/map2/Map2GameScene2";
import Map2GameScene2 from "./scenes/map2/Map2GameScene";
import Map2GameScene3 from "./scenes/map2/Map2GameScene3";
import Map2GameScene4 from "./scenes/map2/Map2GameScene4";

import Map3GameScene from "./scenes/map3/Map3GameScene";
import Map3GameScene2 from "./scenes/map3/Map3GameScene2";
import Map3GameScene3 from "./scenes/map3/Map3GameScene3";
import Map3GameScene4 from "./scenes/map3/Map3GameScene4";

import Map4GameScene from "./scenes/map4/Map4GameScene";
import Map4GameScene2 from "./scenes/map4/Map4GameScene2";
import Map4GameScene3 from "./scenes/map4/Map4GameScene3";
import Map4GameScene4 from "./scenes/map4/Map4GameScene4";
import SpaceInvadersScene from "./scenes/SpaceInvadersScene";
import SortSelectionScene from './scenes/SortSelectionScene';
import PreLoader from './scenes/PreLoader';
import { MainMenu } from './scenes/MainMenu';
import TetrisGameScene from './scenes/TetrisGameScene';
import DataStructureSelectionScene from './scenes/DataStructureSelectionScene';
import TestScene from './scenes/TestScene';
import SceneTester from './scenes/SceneTester';

console.log('Main: Starting game initialization');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    backgroundColor: '#000000',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        SceneTester,  // Add scene tester first
        TestScene,
        BootScene,
        MainMenu,
        DataStructureSelectionScene,
        SpaceInvadersScene,
        SortSelectionScene,
        GameScene,
        TetrisGameScene,
        GameScene2,
        GameScene3,
        GameScene4,
        Map2GameScene,
        Map2GameScene2,
        Map2GameScene3,
        Map2GameScene4,
        Map3GameScene,
        Map3GameScene2,
        Map3GameScene3,
        Map3GameScene4,
        Map4GameScene,
        Map4GameScene2,
        Map4GameScene3,
        Map4GameScene4,
        GameOver,
        PreLoader
    ]
};

console.log('Main: Creating game instance');
const game = new Phaser.Game(config);
console.log('Main: Game instance created');

// Start with scene tester
game.scene.start('scenetester');