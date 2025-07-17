import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
  };

  return {
    plugins: [
      react(),
      {
        name: 'generate-firebase-config-js',
        buildStart() {
          const jsContent = `self.firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};`;
          const filePath = path.resolve(__dirname, 'public/firebase-config.js');
          fs.writeFileSync(filePath, jsContent);
          console.log('✅ public/firebase-config.js generert!');
        }
      }
    ]
  };
});
