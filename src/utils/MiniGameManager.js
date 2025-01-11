export default class MiniGameManager {
    constructor() {
        this.miniGames = ['space_invaders', 'tetris'];
        this.currentMiniGameIndex = 0;
    }

    getNextMiniGame() {
        const nextGame = this.miniGames[this.currentMiniGameIndex];
        this.currentMiniGameIndex = (this.currentMiniGameIndex + 1) % this.miniGames.length;
        return nextGame;
    }

    static getInstance() {
        if (!MiniGameManager.instance) {
            MiniGameManager.instance = new MiniGameManager();
        }
        return MiniGameManager.instance;
    }
}