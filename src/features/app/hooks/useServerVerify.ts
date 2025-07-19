import type { ServerInfo } from "../../../types/serverInfo";

import { GetHeartbeat, GetIsDelegateRequired } from "../api/Get";
import { Logger } from "../utils";

const log = Logger();

export type ServerEndpoint = 'lan' | 'remote' | null;

export interface ServerVerificationResult {
    endpoint: ServerEndpoint;
    reachable: boolean;
    requiresAuth: boolean;
    tokenValid: boolean | null; // null brukes når validering ikke er relevant (f.eks. LAN)
}


export default function useServerVerification(server: ServerInfo, token: string | null) {
    const verifyLan = async (): Promise<ServerVerificationResult> => {
        let isReachable = false;
        let requiresAuth = false;

        try {
            isReachable = await verify(server.lan);
            requiresAuth = isReachable
                ? await doesServerRequireAuthentication(server.lan)
                : false;

            if (requiresAuth) {
                log.warn("LAN-server krever autentisering, dette stemmer ikke med forventet oppsett");
            }
        } catch (err) {
            log.warn("Feil under verifisering av LAN-server", err);
        }

        return {
            endpoint: 'lan',
            reachable: isReachable,
            requiresAuth,
            tokenValid: null, // Ikke relevant for LAN
        };
    };

    const verifyRemote = async (): Promise<ServerVerificationResult> => {
        let isReachable = false;
        let requiresAuth = false;
        let tokenValid: boolean | null = null;

        if (!server.remote) {
            log.warn("Ingen remote server definert");
        } else {
            isReachable = await verify(server.remote);
            requiresAuth = isReachable
                ? await doesServerRequireAuthentication(server.remote)
                : false;

            tokenValid =
                isReachable && requiresAuth && token
                    ? await validateToken(server.remote, token)
                    : null;

            if (!requiresAuth) {
                log.warn("Remote server krever ikke autentisering — stemmer ikke med forventet oppsett");
            }
        }

        return {
            endpoint: 'remote',
            reachable: isReachable,
            requiresAuth: requiresAuth,
            tokenValid: tokenValid,
        };
    };

    return { verifyLan, verifyRemote };
}


export async function verify(url: string | null): Promise<boolean> {
    if (!url) {
        return false;
    }
    const heartbeat = await GetHeartbeat(url);
    if (!heartbeat || !heartbeat.status) {
        return false;
    }
    return heartbeat.status
}

export async function doesServerRequireAuthentication(url: string): Promise<boolean> {
    const response = await GetIsDelegateRequired(url);
    if (response === null) {
        log.warn(`Kunne ikke avgjøre om server krever autentisering: ${url}`);
        return false;
    }
    return response;
}

export async function validateToken(url: string, token: string | null): Promise<boolean> {
    const log = Logger()
    if (!token) {
        log.info(`Ingen token — hopper over validering`);
        return false;
    }

    log.info(`Validerer token mot ${url}/api/auth/validate`);
    try {
        const res = await fetch(`${url}/api/auth/validate`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            mode: 'cors',
        });
        log.info(`Token validering → ${res.ok ? 'GYLDIG' : 'UGYLDIG'}`);
        return res.ok;
    } catch (err) {
        log.warn(`Validering feilet`, err);
        return false;
    }
}