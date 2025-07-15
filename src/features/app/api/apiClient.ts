
import { store } from '../store';
import type { ServerState } from '../store/serverSlice';
import { isRemote } from '../utils';

function Headers(isRemote: boolean, token: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (isRemote && token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}


export function getAbsoluteUrl(baseUrl: string, paths: string[]): string {
    const cleanBase = baseUrl.replace(/\/+$/, '');

    // Fjern leading/trailing slashes fra path-segmenter og join dem
    const path = paths
        .map(segment => segment.replace(/^\/+|\/+$/g, '')) // fjerner slashes
        .join('/');

    return `${cleanBase}/${path}`;
}

export interface WebResponse<T> {
    url: string,
    data: T
}

export async function WebGet<T>(path: string[]): Promise<WebResponse<T>> {
    const serverState = store.getState().server
    const headers = Headers(isRemote(serverState), serverState.token)
    const baseUrl = serverState.activeUrl
    if (!baseUrl) {
        throw new Error("There is no activeUrl defined")
    }

    const absoluteUrl = getAbsoluteUrl(baseUrl, ["api", ...path])

    const res = await fetch(absoluteUrl, {
        method: 'GET',
        headers
    });

    if (!res.ok) {
        throw new Error(`WebGet: ${res.status} ${res.statusText}`);
    }

    try {
        const response = await res.json() as T
        return {
            url: baseUrl,
            data: response
        } as WebResponse<T>;
    } catch (error) {
        console.warn(absoluteUrl, res.body)
        throw new Error(`WebGet: Failed to parse JSON response from ${absoluteUrl}: ${res} ${error}`);
    }
}