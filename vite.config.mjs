import { defineConfig } from 'vite';
import path from 'path';

// Load environment variables from .env files
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables based on the mode
    const env = loadEnv(mode, process.cwd());

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'), // Alias for src directory
                'gameobjects': path.resolve(__dirname, './src/gameobjects'),
                'scenes': path.resolve(__dirname, './src/scenes'),
                'utils': path.resolve(__dirname, './src/utils')
            }
        },
        base: env.VITE_BASE_URL || '/', // Base URL for the application, can be set in .env files
        build: {
            outDir: 'dist', // Output directory for production builds
            rollupOptions: {
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
        server: {
            port: 8080, // Port for the development server
            open: true, // Automatically open the browser when the server starts
            hmr: {
                overlay: true // Show overlay for HMR errors
            }
        },
        // Additional configurations can go here
    };
});