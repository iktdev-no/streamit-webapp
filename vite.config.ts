import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Hent miljøvariabler eksplisitt
  const env = loadEnv(mode, process.cwd());

  // Firebase config
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Versjon og miljø
  const appVersion = env.VITE_APP_VERSION || 'unknown';
  const appEnvironment = env.VITE_ENVIRONMENT || 'unknown';

  return {
    plugins: [
      react(),

      // 🧩 PWA-plugin + manifest
      VitePWA({
        filename: 'manifest.webmanifest',
        registerType: 'prompt',
        includeAssets: [
          'favicon.svg',
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png'
        ],
        manifest: {
          name: 'Streamit web app',
          short_name: 'Streamit',
          start_url: '/',
          display: 'standalone',
          background_color: '#000000',
          theme_color: '#FF0000',
          icons: [
            { src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-icon-512.png', sizes: '512x512', type: 'image/png' },
          ]
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
        }
      }),

      // 🔥 Generer Firebase-config
      {
        name: 'generate-firebase-config-js',
        buildStart() {
          const jsContent = `self.firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;
          const filePath = path.resolve(__dirname, 'public/firebase-config.js');
          fs.writeFileSync(filePath, jsContent);
          console.log('✅ public/firebase-config.js generert med:\n', firebaseConfig);
        }
      },

      // 📄 Kopier manifest til .json
      {
        name: 'duplicate-manifest-as-json',
        closeBundle() {
          const dist = path.resolve(__dirname, 'dist');
          const source = path.join(dist, 'manifest.webmanifest');
          const target = path.join(dist, 'manifest.json');

          if (fs.existsSync(source)) {
            fs.copyFileSync(source, target);
            console.log('📄 manifest.json kopiert fra manifest.webmanifest');
          } else {
            console.warn('⚠️ Fant ikke manifest.webmanifest – kunne ikke kopiere');
          }
        }
      },

      // 🔢 Lag versjonsfil
      {
        name: 'generate-version-json',
        apply: 'build',
        buildStart() {
          const filePath = path.resolve(__dirname, 'public/version.json');
          const versionData = {
            version: appVersion,
            environment: appEnvironment,
            builtAt: new Date().toISOString()
          };

          fs.writeFileSync(filePath, JSON.stringify(versionData, null, 2));
          console.log('📦 version.json generert med:\n', versionData);
        }
      }
    ]
  };
});
