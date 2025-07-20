
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
    status?: number,
    data: T
}

export async function PfnsPost<T>(path: string[], body: any): Promise<WebResponse<T>> {
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


// Overload signatures
export function WebGet<T>(path: string[]): Promise<WebResponse<T>>;
export function WebGet<T>(baseUrl: string, path: string[]): Promise<WebResponse<T>>;

// Implementasjon
export async function WebGet<T>(baseUrlOrPath: string | string[], pathMaybe?: string[]): Promise<WebResponse<T>> {
    const serverState = store.getState().server;
    const headers = Headers(isRemote(serverState), serverState.token);

    let baseUrl: string | null;
    let path: string[];

    if (typeof baseUrlOrPath === "string") {
        // baseUrl ble eksplisitt gitt
        baseUrl = baseUrlOrPath;
        path = pathMaybe!;
    } else {
        // bruk baseUrl fra store
        path = baseUrlOrPath;
        baseUrl = serverState.activeUrl;
        if (!baseUrl) throw new Error("There is no activeUrl defined");
    }

    const absoluteUrl = getAbsoluteUrl(baseUrl, ["api", ...path]);

    let res: Response;
    try {
        res = await fetch(absoluteUrl, {
            method: 'GET',
            headers
        });
    } catch (err) {
        const message = `WebGet: Failed to get response from ${absoluteUrl} : ${err}`
        console.error(message)
        throw new Error(message)
    }

    if (!res.ok) {
        throw new Error(`WebGet: ${res.status} ${res.statusText}`);
    }

    try {
        const response = await res.json() as T;
        return {
            url: baseUrl,
            status: res.status,
            data: response
        };
    } catch (error) {
        console.warn(absoluteUrl, res.body);
        throw new Error(`WebGet: Failed to parse JSON response from ${absoluteUrl}: ${res} ${error}`);
    }
}


// Overloads
export function WebPost<T>(path: string[], body: any): Promise<WebResponse<T>>;
export function WebPost<T>(baseUrl: string, path: string[], body: any): Promise<WebResponse<T>>;

// Implementasjon
export async function WebPost<T>(baseUrlOrPath: string | string[], pathOrBody: string[] | any, maybeBody?: any): Promise<WebResponse<T>> {
    const serverState = store.getState().server;
    const headers = Headers(isRemote(serverState), serverState.token);

    let baseUrl: string | null;
    let path: string[];
    let body: any;

    if (typeof baseUrlOrPath === 'string') {
        // baseUrl ble gitt eksplisitt
        baseUrl = baseUrlOrPath;
        path = pathOrBody as string[];
        body = maybeBody;
    } else {
        // bruk baseUrl fra state
        path = baseUrlOrPath;
        body = pathOrBody;
        baseUrl = serverState.activeUrl;
        if (!baseUrl) {
            throw new Error("There is no activeUrl defined");
        }
    }

    const absoluteUrl = getAbsoluteUrl(baseUrl, ["api", ...path]);

    const res = await fetch(absoluteUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`WebPost: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("Content-Type");

    try {
        if (contentType && contentType.includes("application/json")) {
            const response = await res.json() as T;
            return {
                status: res.status,
                url: baseUrl,
                data: response,
            };
        } else {
            const responseText = await res.text(); // alternativt res.blob() for binære data
            return {
                status: res.status,
                url: baseUrl,
                data: responseText as unknown as T,
            };
        }
    } catch (error) {
        console.warn(`WebPost: Failed to parse response from ${absoluteUrl}`, error);
        throw new Error(`WebPost: Error while reading response from ${absoluteUrl}: ${error}`);
    }
}
