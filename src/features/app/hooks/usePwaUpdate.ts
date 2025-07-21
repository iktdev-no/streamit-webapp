// hooks/usePwaUpdate.ts
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaUpdate() {
  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW();

  return {
    needRefresh,         // ny versjon klar
    updateServiceWorker, // kall for å installere den
    offlineReady,        // appen er offline-klar
  };
}
