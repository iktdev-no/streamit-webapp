import { useState, useEffect } from "react";
import { InitMethodBasedDelegateRequest } from "../api/Post";
import type { RequestCreatedResponse } from "../../../types/notification";

interface UseAuthFlowResult {
    token: string | null;
    loading: boolean;
}

export type SetupFlowStep =
    | 'idle'
    | 'waitingForScan'
    | 'identifying'
    | 'polling'
    | 'connected'
    | 'failed';


export function useServerAuthenticationFlow(
    endpoint: string | null,
    pfnsObject: { pin: string } | null,
    start: boolean,
    updateStep: (step: SetupFlowStep) => void
): UseAuthFlowResult {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!endpoint || !pfnsObject || !start) return;

        const runAuthFlow = async () => {
            setLoading(true);
            updateStep('identifying');


            const session: RequestCreatedResponse | null = await InitMethodBasedDelegateRequest(endpoint, "qr", pfnsObject.pin);
            if (!session?.sessionId) {
                updateStep('failed');
                setLoading(false);
                return;
            }

            const receivedToken = await pollForPermission(endpoint, pfnsObject.pin, session.sessionId, updateStep);
            if (receivedToken) {
                setToken(receivedToken);
                updateStep('connected');
            } else {
                updateStep('failed');
            }

            setLoading(false);
        };

        runAuthFlow();
    }, [endpoint, pfnsObject, start]);

    return { token, loading };
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




