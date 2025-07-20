import { Box, CircularProgress, useTheme } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { useServerAuthenticationFlow, type SetupFlowStep } from "../hooks/useServerAuthorizationAndDelegation";
import type { FcmPayload, PfnsObject } from "../../../types/streamitTypes";
import { useEffect, useState } from "react";
import type { ServerInfo } from "../../../types/serverInfo";
import { useFcmListener, configureServerKey } from "../hooks/useFcmListener";
import useServerVerification from "../hooks/useServerVerify";
import { serverAccessTokenStorage } from "../useStorage";

export interface QRCodeAccessFlowProps {
    pfnsObject: PfnsObject,
    setServer: (server: ServerInfo, token: string | null) => void;
}

export default function QRCodeAccessFlow({ pfnsObject, setServer }: QRCodeAccessFlowProps) {
    const theme = useTheme();

    const [flowStep, setFlowStep] = useState<SetupFlowStep>('idle');
    const [incomingServer, setIncomingServer] = useState<ServerInfo | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(serverAccessTokenStorage(incomingServer?.id).get());

    useFcmListener(configureServerKey, (payload: FcmPayload) => {
        const server = payload.data?.server;
        try {
            if (!server) return;
            const parsedServer = JSON.parse(server);
            setIncomingServer(parsedServer);
        } catch (err) {
            console.warn("Ugyldig FCM-serverdata:", err);
        }
    });

    // Kjør verifisering og identifikasjon
    useEffect(() => {
        if (!incomingServer) return;

        const { verifyLan, verifyRemote } = useServerVerification(incomingServer, accessToken);

        const runFlow = async () => {
            setFlowStep('identifying');

            const lanResult = await verifyLan();
            if (lanResult.reachable && !lanResult.requiresAuth) {
                setFlowStep('connected');
                setServer(incomingServer, accessToken); // Vi har tilgang uten auth
                return;
            }

            const remoteResult = await verifyRemote();
            if (
                remoteResult.reachable &&
                remoteResult.requiresAuth &&
                remoteResult.tokenValid
            ) {
                // Token funker allerede – bare koble til
                setFlowStep('connected');
                setServer(incomingServer, accessToken);
                return;
            }

            if (remoteResult.reachable && remoteResult.requiresAuth && pfnsObject) {
                // Start autentisering via PIN/QR
                setFlowStep('waitingForScan');
            } else {
                console.warn("Ingen tilgjengelig server eller token – avbryter");
                setFlowStep('failed');
            }
        };

        runFlow();
    }, [incomingServer, pfnsObject]);

    // Trigger autentiseringsflyt hvis remote krever det
    const endpoint = incomingServer?.remote ?? null;
    const shouldStartAuth = flowStep === 'waitingForScan';
    const { token: receivedToken } = useServerAuthenticationFlow(endpoint, 'qr', pfnsObject.pin, shouldStartAuth, setFlowStep);

    // Token ble mottatt – koble til!
    useEffect(() => {
        if (!receivedToken || !incomingServer) return;
        setAccessToken(receivedToken);
        setServer(incomingServer, receivedToken);
    }, [receivedToken, incomingServer]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    padding: "2rem",
                    borderRadius: "8px",
                    backgroundColor: "primary.dark",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                }}
            >

                {pfnsObject && (
                    <>
                        <Box sx={{ display: "flex", padding: 1, backgroundColor: "white" }}>
                            <QRCodeCanvas
                                value={JSON.stringify(pfnsObject)}
                                size={200}
                            />
                        </Box>
                        <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 500 }}>
                            📲 Scan denne med <strong>StreamIt</strong>-appen<br />for å koble til
                        </div>
                    </>
                )}

                <FlowStatusDisplay step={flowStep} pin={pfnsObject?.pin ?? ''} />
            </Box>
        </Box>
    )
}


function FlowStatusDisplay({ step, pin }: { step: SetupFlowStep; pin: string }) {
    switch (step) {
        case 'waitingForScan': return <div>📷 Venter på at QR-koden blir scannet…</div>;
        case 'identifying': return <div>🔍 Identifiserer mot server…</div>;
        case 'polling': return <div>📲 Venter på godkjenning på telefonen…</div>;
        case 'failed': return (
            <div>
                ❌ QR-koden ble ikke brukt.<br />
                👉 PIN-kode for manuell innlogging: <strong>{pin}</strong>
            </div>
        );
        case 'connected': return <div>✅ Tilkobling verifisert – fortsett på telefonen</div>;
        default: return null;
    }
}