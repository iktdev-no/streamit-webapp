import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectServer, setToken, setActiveUrl } from './store/serverSlice';
import useServer from './hooks/useServerEndpoint';
import { getServer, getAccessToken } from './useStorage';

interface ConnectGateProps {
    onReady: () => void;
    onRequiresSetup: () => void;
}

export function ConnectGate({ onReady, onRequiresSetup }: ConnectGateProps) {
  const dispatch = useDispatch();
  const server = getServer();
  const token = getAccessToken();

    if (!server) {
        onRequiresSetup();
        return (<><p>Requires setup</p></>)
    }
  const endpoint = useServer(server); // NB! vi antar at server finnes i første versjon

  useEffect(() => {
    if (endpoint) {
      dispatch(selectServer(server!));
      dispatch(setToken(token));
      dispatch(setActiveUrl(endpoint));
      onReady(); // nå kan appen starte
    }
  }, [endpoint]);

  return (
    <div>
      <p>Kobler til server...</p>
      {/* valgfritt bilde, loader, etc */}
    </div>
  );
}
