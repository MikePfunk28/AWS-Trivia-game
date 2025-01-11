import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const useCDN = env.VITE_USE_CDN === 'true';

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'), 
                'gameobjects': path.resolve(__dirname, '../src/gameobjects'),
                'scenes': path.resolve(__dirname, '../src/scenes'),
                'utils': path.resolve(__dirname, '../src/utils'),
                'src': path.resolve(__dirname, '../src')
            }
        },
        base: env.VITE_BASE_URL || '/assets/',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production')
        },
        build: {
            sourcemap: false,
            rollupOptions: {
                external: useCDN ? ['phaser'] : [],
                output: useCDN ? {
                    globals: {
                        phaser: 'Phaser'
                    }
                } : {}
            },
            minify: 'terser',
            terserOptions: {
                compress: {
                    passes: 2,
                    drop_console: true
                },
                mangle: true,
                format: {
                    comments: false
                }
            },
            assetsInlineLimit: 4096,
            chunkSizeWarningLimit: 1000,
            reportCompressedSize: false
        }
    };
});
