import { useEffect, useState } from 'react';
import type { ServerInfo } from '../../../types/serverInfo';
import { serverAccessTokenStorage } from '../useStorage';
import { Logger, useLogger } from '../utils';


export async function probeHeartbeat(url: string): Promise<boolean> {
  const log = Logger()
  log.info(`Prober ${url}/api/heartbeat`);
  try {
    const res = await fetch(`${url}/api/heartbeat`, {
      method: 'GET',
      mode: 'cors',
    });
    log.info(`${url}/api/heartbeat → ${res.ok ? 'OK' : 'FEIL'}`);
    return res.ok;
  } catch (err) {
    log.warn(`Request til ${url}/api/heartbeat feilet`, err);
    return false;
  }
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

export default function useServer(serverInfo: ServerInfo, onRequiresAuth: () => void): string | null {
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const log = useLogger()

  useEffect(() => {
    async function detect() {
      if (!serverInfo) {
        log.warn(`ServerInfo mangler — avbryter`);
        return;
      }

      const { lan, remote } = serverInfo;
      const token = serverAccessTokenStorage(serverInfo.id).get();

      log.info(`Starter oppdagelse…`);

      // 🥇 Test LAN først
      if (lan && (await probeHeartbeat(lan))) {
        log.info(`LAN er tilgjengelig → bruker LAN`);
        setEndpoint(lan);
        return;
      }

      if (remote) {
        // 🧪 Test remote deretter
        if (await probeHeartbeat(remote)) {
          const valid = await validateToken(remote, token);
          if (valid) {
            log.info(`Remote er tilgjengelig og token er gyldig → bruker Remote`);
            setEndpoint(remote);
            return;
          } else {
            log.warn(`Remote svarte, men token er ugyldig`);
            onRequiresAuth(); // Kall funksjonen for å håndtere auth
            return
          }
        } else {
          log.warn(`Remote svarte ikke`);
        }
      }

      // ❌ Ingen tilgjengelige endepunkter
      log.error(`Ingen tilgjengelige servere — endpoint = null`);
      setEndpoint(null);
    }

    detect();
  }, [serverInfo]);

  return endpoint;
}
