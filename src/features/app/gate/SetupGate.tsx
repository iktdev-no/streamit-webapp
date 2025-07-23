import HttpIcon from '@mui/icons-material/Http';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import logo from '../../../assets/logo.svg';
import type { ServerInfo } from "../../../types/serverInfo";
import type { PfnsObject } from "../../../types/streamitTypes";
import Header from '../components/Header';
import ManualAccessFlow from '../components/ManualAccessFlow';
import QRCodeAccessFlow from '../components/QRCodeAccessFlow';
import { usePfns } from "../hooks/usePfns";
import { generateRandomPin } from "../utils";

interface SetupGateProps {
  setServer: (server: ServerInfo, token: string | null) => void;
}

type ActiveMode = 'manual' | 'qr' | null

export default function SetupGate({ setServer }: SetupGateProps) {
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const { pfnsInfo } = usePfns();
  const pinCode = generateRandomPin(6)

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
              <Button sx={{
                height: 200,
                width: 200,
                margin: 2
              }} variant='outlined' onClick={() => setActiveMode('qr')}>
                <QrCodeScannerIcon sx={{
                  height: 100,
                  width: 100,
                  color: "secondary.dark"
                }} />
              </Button>
            )}
            <Button sx={{
              height: 200,
              width: 200,
              margin: 2
            }} variant='outlined' onClick={() => setActiveMode('manual')}>
              <HttpIcon sx={{
                height: 100,
                width: 100,
                color: "secondary.dark"
              }} />
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

