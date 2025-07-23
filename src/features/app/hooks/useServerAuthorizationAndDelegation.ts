import { useEffect, useState } from "react";
import type { RequestCreatedResponse } from "../../../types/notification";
import { InitMethodBasedDelegateRequest } from "../api/Post";

interface UseAuthFlowResult {
  token: string | null;
  loading: boolean;
}

export type AuthMode = 'pin' | 'qr'

export type SetupFlowStep =
  | 'idle'
  | 'waitingForScan'
  | 'identifying'
  | 'polling'
  | 'connected'
  | 'failed';


export function useServerAuthenticationFlow(
  endpoint: string | null,
  method: AuthMode,
  pin: string | null,
  start: boolean,
  updateStep: (step: SetupFlowStep) => void
): UseAuthFlowResult & { retryPoll: () => void } {
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doPolling = async (currentSessionId: string) => {
    updateStep('polling');
    const receivedToken = await pollForPermission(endpoint!, pin!, currentSessionId, updateStep);

    if (receivedToken) {
      setToken(receivedToken);
      updateStep('connected');
    } else {
      updateStep('failed');
    }
  };

  useEffect(() => {
    if (!endpoint || !pin || !start) return;

    const runAuthFlow = async () => {
      setLoading(true);
      updateStep('identifying');

      const session: RequestCreatedResponse = await InitMethodBasedDelegateRequest(endpoint, method, pin);
      if (!session?.sessionId) {
        updateStep('failed');
        setLoading(false);
        return;
      }

      setSessionId(session.sessionId);
      await doPolling(session.sessionId);
      setLoading(false);
    };

    runAuthFlow();
  }, [endpoint, pin, start]);

  const retryPoll = () => {
    if (endpoint && pin && sessionId) {
      doPolling(sessionId);
    } else {
      console.warn("Kan ikke retry – mangler data.");
    }
  };

  return { token, loading, retryPoll };
}


async function pollForPermission(
  serverAddress: string,
  pin: string,
  sessionId: string,
  setFlow: (f: SetupFlowStep) => void
): Promise<string | null> {
  const start = Date.now();
  setFlow('polling');

  while (Date.now() - start < 30000) {
    try {
      const response = await fetch(`${serverAddress}/api/auth/delegate/request/pending/${pin}/permitted/${sessionId}`);

      // Stopp umiddelbart hvis 401 eller 410
      if (response.status === 409 || response.status === 410) {
        console.warn(`Polling avbrutt – mottok ${response.status}`);
        setFlow('failed');
        return null;
      }

      if (response.status === 200 || response.ok) {
        const token = response.text();

        return token;
      }
    } catch (e) {
      console.warn("Polling-feil:", e);
    }

    await new Promise(res => setTimeout(res, 3000));
  }

  setFlow('failed');
  return null;
}




