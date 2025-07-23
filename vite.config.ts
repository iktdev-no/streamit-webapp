import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export default defineConfig({
  plugins: [
    react(),

    // PWA manifest generator
    VitePWA({
      filename: 'manifest.webmanifest', // 🔄 genererer hovedfilen
      registerType: 'prompt',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
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

    // 🔥 Firebase config til public-folderen
    {
      name: 'generate-firebase-config-js',
      buildStart() {
        const jsContent = `self.firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;
        const filePath = path.resolve(__dirname, 'public/firebase-config.js');
        fs.writeFileSync(filePath, jsContent);
        console.log('✅ public/firebase-config.js generert!');
      }
    },

    // 🧭 Kopier manifest.webmanifest til manifest.json
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
    }
  ]
});
