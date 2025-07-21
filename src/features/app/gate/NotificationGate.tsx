// components/NotificationGate.tsx
import logo from '../../../assets/logo.svg';
import { useEffect } from "react";
import type { NotificationStatus } from "../../../types/notification";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { notificationStorage } from "../useStorage";
import { Box, Button, Typography } from "@mui/material";

interface NotificationGateProps {
    onResult: (status: NotificationStatus) => void;
}


export function NotificationGate({ onResult }: NotificationGateProps) {
    const { requestPermission } = useNotificationPermission();
    const currentStatus = Notification.permission;
    const storedStatus = notificationStorage.get();

    useEffect(() => {
        if (currentStatus !== "default") {
            if (storedStatus && storedStatus === currentStatus) {
                onResult(storedStatus);
            } else if (storedStatus && storedStatus !== currentStatus) {
                console.warn("⛔️ Lokal og faktisk tillatelse er ikke i sync.");
                onResult(currentStatus as NotificationStatus);
            }
        }

    }, [storedStatus, currentStatus]);

    const handleAllow = async () => {
        const updatedStatus = await requestPermission();
        notificationStorage.set(updatedStatus);
        onResult(updatedStatus);
    };

    const handleDeny = () => {
        notificationStorage.set("denied");
        onResult("denied");
    };

    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box p={2} display="flex" justifyContent="center">
                <img src={logo} style={{ width: 100, height: 'auto' }} />
            </Box>

            <Box
                flexGrow={0.7}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    sx={{
                        backgroundColor: 'primary.dark'
                    }}
                    p={4}
                    borderRadius={4}
                    boxShadow={3}
                >
                    <Typography variant="h2" gutterBottom>
                        Varslingstillatelse
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        For å kunne koble til strømme tjenester kjapt og enkelt, samt motta varsler, må du gi tillatelse til varslinger.
                    </Typography>
                    <Box mt={8} display="flex" justifyContent="center" gap={6}>
                        <Button size='large' color="secondary" variant='contained' onClick={handleDeny}>
                            Nei takk
                        </Button>
                        <Button size='large'  variant='contained' onClick={handleAllow}>
                            Tillat
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
