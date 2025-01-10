import BootScene from "./scenes/bootscene";
import GameOver from "./scenes/gameover";
import GameScene from "./scenes/map1/GameScene";
import GameScene2 from "./scenes/map1/GameScene2";
import GameScene3 from "./scenes/map1/GameScene3";
import GameScene4 from "./scenes/map1/GameScene4";
//map2
import Map2GameScene from "./scenes/map2/Map2GameScene2";
import Map2GameScene2 from "./scenes/map2/Map2GameScene";
import Map2GameScene3 from "./scenes/map2/Map2GameScene3";
import Map2GameScene4 from "./scenes/map2/Map2GameScene4";
//map3
import Map3GameScene from "./scenes/map3/Map3GameScene";
import Map3GameScene2 from "./scenes/map3/Map3GameScene2";
import Map3GameScene3 from "./scenes/map3/Map3GameScene3";
import Map3GameScene4 from "./scenes/map3/Map3GameScene4";
//map4
import Map4GameScene from "./scenes/map4/Map4GameScene";
import Map4GameScene2 from "./scenes/map4/Map4GameScene2";
import Map4GameScene3 from "./scenes/map4/Map4GameScene3";
import Map4GameScene4 from "./scenes/map4/Map4GameScene4";
import SpaceInvadersScene from "./scenes/SpaceInvadersScene";
import SortSelectionScene from './scenes/SortSelectionScene';
import PreLoader from './scenes/PreLoader';
import ProgressManager from './utils/ProgressManager';

import MainMenu from '/src/scenes/MainMenu';
import assetLoader from './utils/assetLoader';
import SceneOrderTransition from './utils/SceneOrderManager';
import SceneTransition from "./utils/SceneTransition";
import TetrisGameScene from './scenes/TetrisGameScene';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#000000',
  dom: {
    createContainer: true
  },
  audio: {
    context: new (window.AudioContext || window.webkitAudioContext)()
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: true,
    powerPreference: 'high-performance',
    antialias: true,
    antialiasGL: true,
  },
  scene: [
    MainMenu,
    PreLoader,
    BootScene,
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
    GameOver
  ]
};
const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);

  document.addEventListener('click', function initAudio() {
    if (window.game.sound && window.game.sound.context.state === 'suspended') {
      window.game.sound.context.resume();
    }
    document.removeEventListener('click', initAudio);
  });
});