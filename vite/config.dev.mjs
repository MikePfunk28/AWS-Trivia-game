import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'gameobjects': path.resolve(__dirname, './src/gameobjects'),
            'scenes': path.resolve(__dirname, './src/scenes'),
            'utils': path.resolve(__dirname, './src/utils'),
            'src': path.resolve(__dirname, '../src')
        }
    },
    base: '/assets/',
    define: {
        global: 'globalThis',
        'process.env': process.env
    },
    optimizeDeps: {
        include: ['phaser']
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                globals: {
                    phaser: 'Phaser'
                }
            }
        }
    },
    server: {
        port: 8080,
        open: true,
        cors: true,
        hmr: {
            overlay: true
        }
    }
});