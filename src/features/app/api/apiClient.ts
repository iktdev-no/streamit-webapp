
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

export async function PfnsPost<T>(path: string[], body: string): Promise<WebResponse<T>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    }

    const baseUrl = "https://pfns.iktdev.no"
    const absoluteUrl = getAbsoluteUrl(baseUrl, ["api", ...path])
    console.log("PfnsPost", absoluteUrl, body)
    const res = await fetch(absoluteUrl, {
        method: 'POST',
        headers,
        body: body
    })

    if (!res.ok) {
        throw new Error(`PfnsPost: ${res.status} ${res.statusText}`)
    }

    const raw = await res.text()

    let parsed: T
    try {
        parsed = JSON.parse(raw)
    } catch {
        // not JSON? return as primitive type
        parsed = raw as unknown as T
    }

    return {
        url: baseUrl,
        data: parsed
    } as WebResponse<T>
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

export async function WebPost<T>(path: string[], body: any): Promise<WebResponse<T>> {
    const serverState = store.getState().server
    const headers = Headers(isRemote(serverState), serverState.token)
    const baseUrl = serverState.activeUrl
    if (!baseUrl) {
        throw new Error("There is no activeUrl defined")
    }

    const absoluteUrl = getAbsoluteUrl(baseUrl, ["api", ...path])

    const res = await fetch(absoluteUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw new Error(`WebPost: ${res.status} ${res.statusText}`);
    }

    try {
        const response = await res.json() as T
        return {
            url: baseUrl,
            data: response
        } as WebResponse<T>;
    } catch (error) {
        console.warn(absoluteUrl, res.body)
        throw new Error(`WebPost: Failed to parse JSON response from ${absoluteUrl}: ${res} ${error}`);
    }
}