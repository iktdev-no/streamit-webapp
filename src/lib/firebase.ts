// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const vapidKey = "BPpoLWhbP7tR8WseEo0zbzIsWA2yP6p-EtEeF6xkUHzffQ7BoTsmHxjNYsVcSlLUUVdDglMspzcc8XFqqeYOZ4I";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let messaging: ReturnType<typeof getMessaging> | undefined = undefined;

try {
  // Prøv å initialisere Firebase
  const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  });

  // Sjekk om service workers støttes før Messaging
  if ('serviceWorker' in navigator) {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging aktivert');
  } else {
    console.warn('⚠️ Service Workers ikke støttet – push deaktivert');
  }
} catch (err) {
  console.error('🔥 Firebase feilet under init:', err);
}


export { messaging, vapidKey };
