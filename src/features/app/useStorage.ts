import type { ServerInfo } from "../../types/serverInfo";


export function getServer(): ServerInfo | null {


    const raw = localStorage.getItem('selectedServer');
    if (!raw) return null;

    try {
        return JSON.parse(raw) as ServerInfo;
    } catch {
        return null;
    }
}

export function getServerId(): string | null {

    return localStorage.getItem("selected_server_id")
}

function getServerTokenKey(): string | null {
    const serverId = getServerId()
    if (!serverId) {
        return null;
    }
    return `selected_server_${serverId}_token`
}

export function getAccessToken(): string | null {

    const key = getServerTokenKey()
    if (!key) {
        return null;
    }
    return localStorage.getItem(key);
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