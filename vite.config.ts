import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import { componentTagger } from 'lovable-tagger';

// PWA Configuration
const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'UTBK Tracker',
    short_name: 'UTBK Tracker',
    description: 'Pantau prestasi UTBK 2025 dan cek statistik kampus',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: ({ url }: { url: URL }) => url.pathname.startsWith('/api/'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  const plugins: PluginOption[] = [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA(pwaOptions),
  ].filter(Boolean) as PluginOption[];

  return {
    server: {
      host: '::',
      port: 8080,
      open: true, // Open browser on server start
    },
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Build optimizations
    build: {
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-slot',
              '@radix-ui/react-avatar',
              '@radix-ui/react-label',
              '@radix-ui/react-separator',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-popover',
              '@radix-ui/react-toast',
              '@radix-ui/react-alert-dialog'
            ],
            vendor: ['@tanstack/react-query', 'date-fns', 'lodash'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // in kBs
    },
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __SITE_URL__: JSON.stringify(env.VITE_SITE_URL || 'https://utbk2025.hanifu.id'),
    },
  };
});
