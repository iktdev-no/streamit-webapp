import { useEffect, useState } from 'react';

export function useSessionState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const getStoredValue = (): T => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState<T>(getStoredValue);

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.warn(`Kunne ikke lagre ${key} til sessionStorage`);
    }
  }, [key, state]);

  return [state, setState];
}




export const sessionUtil = {
  get<T = unknown>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T = unknown>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch {
      console.warn(`Kunne ikke lagre ${key} til sessionStorage`);
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  },

  has(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
};

