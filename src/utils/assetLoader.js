import Player from '../gameobjects/player';
import Generator from '../gameobjects/generator';
import * as Phaser from 'phaser';
import SceneOrderManager from './SceneOrderManager';

// Helper function to handle asset paths in both dev and production
export function getAssetPath(path) {
    // Remove leading slash if present
    path = path.startsWith('/') ? path.substring(1) : path;

    // In development, serve from localhost:8082/assets
    return `/public/${path}`;
}