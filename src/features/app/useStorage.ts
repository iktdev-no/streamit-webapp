import type { ResumeMedia } from "../../types/content";
import type { PfnsInfo } from "../../types/firebase";
import { NotificationStatus } from "../../types/notification";
import type { ServerInfo } from "../../types/serverInfo";

export interface StorageHandler<T> {
    get(): T | undefined;
    set(data: T): void;
    clear(): void;
}


function createStorageHandler<T>(key: string | undefined, fallback: T) {
    return {
        get(): T {
            if (!key) {
                console.warn("Attempted to get storage with undefined key");
                return fallback;
            }

            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            try {
                return JSON.parse(raw) as T;
            } catch {
                return fallback;
            }
        },
        set(data: T, manualKey: string | null = null): void {
            const useKey = manualKey ?? key;
            if (!useKey) {
                console.warn("Attempted to set storage with undefined key");
                return;
            }
            localStorage.setItem(useKey, JSON.stringify(data));
        },
        clear(): void {
            if (!key) {
                console.warn("Attempted to clear storage with undefined key");
                return;
            }
            localStorage.removeItem(key);
        }
    };
}

function createInstanceStorage<T>(scopeKey: string, options?: { prefix?: string; fallback?: T }) {
    const key = scopeKey ? `${options?.prefix ?? ''}_${scopeKey}` : undefined;
    return {
        get(): T | null {
            
            if (!key) {
                console.warn("Attempted to get storage with undefined key");
                return options?.fallback ?? null;
            }

            const raw = localStorage.getItem(key);
            if (!raw) return options?.fallback ?? null;

            try {
                return JSON.parse(raw) as T;
            } catch {
                console.warn("Failed to parse localStorage value");
                return options?.fallback ?? null;
            }
        },
        set(data: T | null): void {
            if (!key) {
                console.warn("Attempted to set storage with undefined key");
                return;
            }

            if (data === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(data));
            }
        },
        clear(): void {
            if (!key) {
                console.warn("Attempted to clear storage with undefined key");
                return;
            }

            localStorage.removeItem(key);
        }
    };
}



// Usage
export const notificationStorage = createStorageHandler<NotificationStatus>(
    'notificationStatus',
    NotificationStatus.Default
);


export const serverStorage = createStorageHandler<ServerInfo | null>(
    'selectedServer',
    null //debugServer()
);

export const savedServerStorage = createStorageHandler<ServerInfo[]>(
    'savedServer',
    [] //debugServer()
);


export function serverAccessTokenStorage(key: string | undefined) {
    const serverKey = key ? `selectedServerAccessToken_${key}` : undefined;

    return {
        get(): string | null {
            if (!serverKey) {
                console.warn("Attempted to get storage with undefined key");
                return null;
            }

            const raw = localStorage.getItem(serverKey);
            return raw ?? null;
        },
        set(data: string | null): void {
            if (!serverKey) {
                console.warn("Attempted to set storage with undefined key");
                return;
            }
            if (data === null) {
                localStorage.removeItem(serverKey);
                return;
            }
            localStorage.setItem(serverKey, data);
        },
        clear(): void {
            if (!serverKey) {
                console.warn("Attempted to clear storage with undefined key");
                return;
            }
            localStorage.removeItem(serverKey);
        }
    };
}

export function favoriteStorage(subKey: string | undefined) {
    const prefix = "favorites"
    if (!subKey) {
        console.log("subkey is missing for" + prefix)
        return null;
    }
    return createInstanceStorage<number[]>(subKey, {
        prefix: prefix,
        fallback: []
    });
}

export function resumeStorage(subKey: string | undefined) {
    const prefix = "resume";
    if (!subKey) {
        console.log("subkey is missing for" + prefix)
        return undefined;
    }
    return createInstanceStorage<ResumeMedia | undefined>(subKey, {
        prefix: prefix,
        fallback: undefined
    });
}


export const FavoritesStorage = {
    get(): number[] {
        const raw = localStorage.getItem('favorites');
        if (!raw) return [];
        try {
            return JSON.parse(raw) as number[];
        } catch {
            return [];
        }
    },

    add(id: number): void {
        const favorites = this.get();
        if (!favorites.includes(id)) {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    },

    remove(id: number): void {
        const updated = this.get().filter(fav => fav !== id);
        localStorage.setItem('favorites', JSON.stringify(updated));
    },

    is(id: number): boolean {
        return this.get().includes(id);
    }
};



export const pfnsInfoStorage = createStorageHandler<PfnsInfo | null>(
    'pfnsInfo',
    null
);



