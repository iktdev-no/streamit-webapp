import logo from '../../../assets/logo.svg';
import { useMemo, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { usePfns } from "../hooks/usePfns";
import { generateRandomPin } from "../utils";
import type { ServerInfo } from "../../../types/serverInfo";
import type { PfnsObject } from "../../../types/streamitTypes";
import Header from '../components/Header';
import HttpIcon from '@mui/icons-material/Http';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QRCodeAccessFlow from '../components/QRCodeAccessFlow';
import ManualAccessFlow from '../components/ManualAccessFlow';

interface SetupGateProps {
  setServer: (server: ServerInfo, token: string | null) => void;
}

type ActiveMode = 'manual' | 'qr' | null

export default function SetupGate({ setServer }: SetupGateProps) {
  const theme = useTheme();
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const { pfnsInfo, loading: pfnsLoading } = usePfns();
  const pinCode =  generateRandomPin(6)

  const pfnsObject: PfnsObject | null = useMemo(() => {
    if (!pfnsInfo?.pfnsId) return null;
    return { pfnsReceiverId: pfnsInfo.pfnsId, pin: pinCode };
  }, [pfnsInfo]);


  return (
    <Box height="100%" display="flex" flexDirection="column">
      {activeMode && (<Header onBackClicked={() => setActiveMode(null)} backgroundColor='#FFF0' />)}
      <Box p={2} display="flex" justifyContent="center" sx={{ marginTop: "72px" }}>
        <img src={logo} style={{ width: 100, height: 'auto' }} />
      </Box>

      {!activeMode && (
        <Box>
          <Typography>Velg tilkoblingsmetode</Typography>

          <Box sx={{
            display: "flex",
            marginTop: 5,
            flexDirection: "row",
            justifyContent: 'center',
          }}>
            {pfnsObject && (
              <Button variant='outlined' onClick={() => setActiveMode('qr')}>
                <QrCodeScannerIcon />
              </Button>
            )}
            <Button variant='outlined' onClick={() => setActiveMode('manual')}>
              <HttpIcon />
            </Button>
          </Box>
        </Box>

      )}
      {activeMode === 'qr' && pfnsObject && (
        <QRCodeAccessFlow pfnsObject={pfnsObject} setServer={setServer} />
      )}
      {activeMode === 'manual' && (
        <ManualAccessFlow pin={pinCode} setServer={setServer} />
      )}

    </Box>
  );
}

