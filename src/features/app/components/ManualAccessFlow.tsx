import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { ServerInfo } from "../../../types/serverInfo";
import { GetServerInfo } from "../api/Get";
import { useServerAuthenticationFlow, type SetupFlowStep } from "../hooks/useServerAuthorizationAndDelegation";
import useServerVerification from "../hooks/useServerVerify";
import { serverAccessTokenStorage } from "../useStorage";

export interface ManualAccessFlowProps {
    pin: string | null,
    setServer: (server: ServerInfo, token: string | null) => void;
}


export default function ManualAccessFlow({ pin, setServer }: ManualAccessFlowProps) {
    const [incomingServer, setIncomingServer] = useState<ServerInfo | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(serverAccessTokenStorage(incomingServer?.id).get());
    const [address, setAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [flowStep, setFlowStep] = useState<SetupFlowStep>('idle');

    const onTryConnect = async () => {
        setLoading(true);
        const useUrl = address.startsWith("http") ? address : `http://${address}`;
        try {
            const result = await GetServerInfo(useUrl);
            console.log(result);
            setIncomingServer(result); // Hvis du ønsker å sette server etterpå
        } catch (error) {
            console.error("Feil ved tilkobling:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onTryConnect();
        }
    };
    useEffect(() => {
        if (!incomingServer) return;

        const { verifyLan, verifyRemote } = useServerVerification(incomingServer, accessToken);

        const runFlow = async () => {
            setFlowStep('identifying');

            const lanResult = await verifyLan();
            console.log(lanResult)
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

            if (remoteResult.reachable && remoteResult.requiresAuth) {
                // Start autentisering via PIN/QR
                setFlowStep('waitingForScan');
            } else {
                console.warn("Ingen tilgjengelig server eller token – avbryter");
                setFlowStep('failed');
            }
        };

        runFlow();
    }, [incomingServer]);

    const endpoint = incomingServer?.remote ?? null;
    const shouldStartAuth = flowStep === 'waitingForScan';
    const { token: receivedToken, retryPoll } = useServerAuthenticationFlow(endpoint, 'pin', pin, shouldStartAuth, setFlowStep);

    // Token ble mottatt – koble til!
    useEffect(() => {
        if (!receivedToken || !incomingServer) return;
        setAccessToken(receivedToken);
        setServer(incomingServer, receivedToken);
    }, [receivedToken, incomingServer]);

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
            >
                <TextField
                    label="Stream server"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    variant="contained"
                    onClick={onTryConnect}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Koble til'}
                </Button>
            </Stack>
            {(flowStep === 'polling' || flowStep === 'failed') && (
                <Box sx={{ mt: 10 }}>
                    <Typography gutterBottom>Pin code</Typography>
                    <Typography variant="h1"
                        gutterBottom
                        sx={{
                            borderColor: 'secondary.main',
                            borderWidth: 5,
                            borderStyle: 'solid',
                            borderRadius: 5
                        }}
                    >{pin}</Typography>
                    <Typography variant="body1" gutterBottom>Type this pin code within <strong>Streamit-app</strong> to complete the authentication on this device</Typography>
                    {flowStep === 'failed' && (
                        <Button onClick={retryPoll}>
                            Retry
                        </Button>
                    )}
                    {flowStep === 'polling' && (
                        <Box sx={{
                            display: "flex",
                            alignContent: "center"
                        }}>
                            <CircularProgress />
                            <Typography>Waiting for completion within the <strong>Streamit app</strong></Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}