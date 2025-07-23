// hooks/useVerifyServerConnection.ts
import { useEffect, useState } from 'react';
import type { ServerInfo } from '../../../types/serverInfo';
import { useLogger } from '../utils';
import { probeHeartbeat, validateToken } from './useServerEndpoint';

export interface ServerConnectionSummary {
    lanAvailable: boolean;
    remoteAvailable: boolean;
    remoteTokenValid: boolean | null; // null = token ikke sendt
    requiresAuth: boolean;
}

export default function useVerifyServerConnection(
    serverInfo: ServerInfo | null,
    serverAccessToken: string | null
): ServerConnectionSummary {
    const [summary, setSummary] = useState<ServerConnectionSummary>({
        lanAvailable: false,
        remoteAvailable: false,
        remoteTokenValid: null,
        requiresAuth: false,
    });

    const log = useLogger();

    useEffect(() => {
        async function verify() {
            if (!serverInfo) {
                log.warn(`ServerInfo mangler — avbryter verifisering`);
                return;
            }

            const { lan, remote } = serverInfo;

            log.info(`Starter verifisering av server-tilkobling…`);

            let lanOk = false;
            let remoteOk = false;
            let tokenValid: boolean | null = null;
            let requiresAuth = false;

            if (lan) {
                lanOk = await probeHeartbeat(lan);
            }

            if (remote) {
                remoteOk = await probeHeartbeat(remote);

                if (remoteOk) {
                    if (serverAccessToken) {
                        tokenValid = await validateToken(remote, serverAccessToken);
                        requiresAuth = !tokenValid;
                    } else {
                        tokenValid = null;
                        requiresAuth = true;
                    }
                }
            }

            setSummary({
                lanAvailable: lanOk,
                remoteAvailable: remoteOk,
                remoteTokenValid: tokenValid,
                requiresAuth,
            });
        }

        verify();
    }, [serverInfo]);

    return summary;
}
