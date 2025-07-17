// lib/FcmService.ts

import { type MessagePayload, onMessage } from "firebase/messaging";
import { messaging } from "../../lib/firebase";

type Listener = (payload: MessagePayload) => void;

class FirebaseMessageService {
  private listeners: Map<string, Listener[]> = new Map();

  constructor() {
    onMessage(messaging, (payload) => {
      const key = payload.data?.action || 'default';
      const handlers = this.listeners.get(key);

      if (handlers && handlers.length > 0) {
        handlers.forEach((cb) => cb(payload));
      } else {
        console.log(`[FCM] Ingen lyttere for '${key}'`);
        console.log('[FCM] Melding logget:', payload);
      }
    });
  }

  addListener(topic: string, callback: Listener) {
    const existing = this.listeners.get(topic) || [];
    this.listeners.set(topic, [...existing, callback]);
  }

  removeListener(topic: string, callback: Listener) {
    const existing = this.listeners.get(topic) || [];
    this.listeners.set(topic, existing.filter(cb => cb !== callback));
  }
}

export const fcmService = new FirebaseMessageService(); // Singleton
