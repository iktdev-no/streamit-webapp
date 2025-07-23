import { Box } from '@mui/material';
import { useEffect, useState, type JSX } from 'react';
import { useDispatch } from 'react-redux';
import useServer from '../hooks/useServerEndpoint';
import { default as FastConnectUsingQR, default as GateAuthenticateUsingQR } from '../page/access/FastConnectUsingQR';
import { selectServer, setActiveUrl, setToken } from '../store/serverSlice';
import { serverAccessTokenStorage, serverStorage } from '../useStorage';

interface ConnectGateProps {
  onReady: () => void;
  onRequiresSetup: () => void;
}

export function ConnectGate({ onReady }: ConnectGateProps) {
  const [requiresAuth, setRequiresAuth] = useState(false);
  const dispatch = useDispatch();
  const server = serverStorage.get();
  const token = serverAccessTokenStorage(server?.id).get();

  if (!server) {
    return showSetupScreen();
  }
  const endpoint = useServer(server, () => {
    setRequiresAuth(true);
    console.warn("Auth required, but not implemented yet.");
  }); // NB! vi antar at server finnes i første versjon

  useEffect(() => {
    if (endpoint) {
      dispatch(selectServer(server!));
      dispatch(setToken(token));
      dispatch(setActiveUrl(endpoint));
      onReady(); // nå kan appen starte
    }
  }, [endpoint]);

  if (requiresAuth) {
    return (
      <GateAuthenticateUsingQR />
    );
  }

  return (
    <div>
      <p>Kobler til server...</p>
      {/* valgfritt bilde, loader, etc */}
    </div>
  );
}

function showSetupScreen(): JSX.Element {
  return (
    <Box sx={{
      display: 'flex', flexDirection: {
        xs: 'column',
        sm: 'column',
        md: 'row',
      }, alignItems: 'center', justifyContent: 'center', height: '100vh'
    }}>
      <FastConnectUsingQR />
    </Box>
  );
}
