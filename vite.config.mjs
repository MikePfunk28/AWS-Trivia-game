import { defineConfig } from 'vite';
import path from 'path';

// Load environment variables from .env files
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables based on the mode
    const env = loadEnv(mode, process.cwd());

    return {
        base: './', // Updated base URL
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'), // Alias for src directory
                'gameobjects': path.resolve(__dirname, './src/gameobjects'),
                'scenes': path.resolve(__dirname, './src/scenes'),
                'utils': path.resolve(__dirname, './src/utils'),
                'phaser': 'phaser/dist/phaser.min.js' // Updated alias for phaser
            }
        },
        server: {
            port: 8082, // Updated port for the development server
            host: true, // Updated host configuration
            open: true, // Automatically open the browser when the server starts
            hmr: {
                overlay: true // Show overlay for HMR errors
            }
        },
        build: {
            outDir: 'dist', // Output directory for production builds
            assetsDir: 'assets', // Updated assets directory
            emptyOutDir: true, // Empty output directory before building
            rollupOptions: {
                input: {
                    main: './index.html' // Updated input file for rollup
                },
                output: {
                    manualChunks: {
                        phaser: ['phaser'] // Manual chunking for the phaser library
                    }
                }
            },
            minify: mode === 'production' ? 'terser' : false, // Minify in production only
            terserOptions: {
                compress: {
                    passes: 2 // Number of passes for compression
                },
                mangle: true, // Enable mangling of variable names
                format: {
                    comments: false // Remove comments from the output
                }
            }
        },
        publicDir: 'public', // Updated public directory
        // Additional configurations can go here
    };
});