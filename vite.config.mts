import { default as react } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { manifestForPlugIn } from './manifest';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react(), VitePWA(manifestForPlugIn as Partial<VitePWAOptions>)],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
        },
        '/auth': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
        },
      },
    },
    assetsInclude: ['**/*.png'],
  });
};
