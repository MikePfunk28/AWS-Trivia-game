import { getAssetPath } from "./assetLoader";
import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from 'phaser';
import SceneOrderManager from './SceneOrderManager';

export default class SceneTransition {
    static to(currentScene, nextSceneName, data = {}) {
        if (currentScene.scene.key === 'space_invaders') {
            currentScene.scene.start('sort_selection', data);
        } else {
            const sortedScenes = data.sortedScenes;
            const currentIndex = sortedScenes.indexOf(currentScene.scene.key);
            const nextScene = sortedScenes[currentIndex + 1];

            if (nextScene && nextScene.includes('game')) {
                currentScene.scene.start('space_invaders', {
                    nextScene: nextScene,
                    score: data.score || 0,
                    sortedScenes: sortedScenes
                });
            } else if (nextScene) {
                currentScene.scene.start(nextScene, {
                    ...data,
                    sortedScenes: sortedScenes
                });
            }
        }
    }
}