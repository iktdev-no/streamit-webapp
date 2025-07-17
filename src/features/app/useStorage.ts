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
        set(data: T): void {
            if (!key) {
                console.warn("Attempted to set storage with undefined key");
                return;
            }
            localStorage.setItem(key, JSON.stringify(data));
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


function debugServer(): ServerInfo | null {
    if (window.location.hostname === 'localhost') {
        return {
            id: "031766F8DA8F",
            name: "Aura",
            lan: "http://streamit.lan",
            remote: "https://streamit1.skjonborg.no",
        } as ServerInfo;
    } return null
}

export const serverStorage = createStorageHandler<ServerInfo | null>(
    'selectedServer',
    null //debugServer()
);

export const serverAccessTokenStorage = createStorageHandler<string | null>(
    serverStorage.get()?.id,
    null
);

export const pfnsInfoStorage = createStorageHandler<PfnsInfo | null>(
    'pfnsInfo',
    null
);


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
