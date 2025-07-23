import { Box } from '@mui/material';
import { useEffect, useState, type JSX } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import './App.css';
import { RequestNewAccessToken } from './features/app/api/Post';
import ServerBanner from './features/app/components/ServerBanner';
import { ConnectGate } from './features/app/gate/ConnectGate';
import { NotificationGate } from './features/app/gate/NotificationGate';
import ProfileGate from './features/app/gate/ProfileGate';
import SetupGate from './features/app/gate/SetupGate';
import ContentDetailPage from './features/app/page/ContentDetailPage';
import ContentPage from './features/app/page/ContentPage';
import ContentPlayPage from './features/app/page/ContentPlayPage';
import ProfileEditPage from './features/app/page/ProfileEditPage';
import ProfilePage from './features/app/page/ProfilePage';
import ServerPage from './features/app/page/ServerPage';
import { selectProfile, showServerBanner } from './features/app/store/appSlice';
import { selectActiveUrl } from './features/app/store/serverSlice';
import { savedServerStorage, serverAccessTokenStorage, serverStorage } from './features/app/useStorage';
import type { ServerInfo } from './types/serverInfo';
import { shouldShowNotificationGate } from './utils/shouldShowNotificationGate';

function App() {
  const [server, setServer] = useState<ServerInfo | null>(serverStorage.get());
  const usingActiveUrl = useSelector(selectActiveUrl)
  const [notificationPermissionPerformed, setNotificationPermissionPerformed] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const profile = useSelector(selectProfile)

  useEffect(() => {
    const checkAccessToken = async () => {
      if (!server) {
        return;
      } else if (!usingActiveUrl) {
        return;
      }

      const existingToken = serverAccessTokenStorage(server.id).get();
      if (!existingToken) {
        await RequestNewAccessToken().then((token) => {
          serverAccessTokenStorage(server.id).set(token); // lagre token
        }).catch((error) => { console.error(error) });

      }
    };

    checkAccessToken();
  }, [usingActiveUrl, server])

  // console.log("Skal vi spørre om notifikasjons tillatelse?", shouldShowNotificationGate());
  // console.log("Har vi allerede spurt om notifikasjonstillatelse?", notificationPermissionPerformed);
  if (!notificationPermissionPerformed && shouldShowNotificationGate()) {
    return (<NotificationGate onResult={(result) => {
      setNotificationPermissionPerformed(true);
      console.log("🎉 Ferdig med tillatelse:", result);
    }} />)
  }

  if (!server) {
    return <SetupGate setServer={(server, token) => {
      console.log("🚀 Setter server og token:", server, token);
      serverStorage.set(server);
      console.log("🚀 Server satt:", serverStorage.get());
      serverAccessTokenStorage(server.id).set(token);
      console.log("🚀 Token satt:", serverAccessTokenStorage(server.id).get());
      const servers = savedServerStorage.get()
      const saved = servers.filter((i) => i.id != server.id)
      saved.push(server);
      savedServerStorage.set(saved);
      setServer(server)
    }} />
  }


  if (!appReady) {
    return <ConnectGate onReady={() => setAppReady(true)} onRequiresSetup={() => {
      toast.info("🚧 Denne funksjonen er ikke implementert ennå.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }} />
  }

  if (!profile) {
    return (
      <AppRenderer>
        <ProfileGate />
      </AppRenderer>
    )
  }

  return (
    <AppRenderer>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ContentPage />} />
          <Route path='/content' element={<ContentDetailPage />} />
          <Route path='/play' element={<ContentPlayPage />} />
          <Route path='/changeProfile' element={<ProfilePage />} />
          <Route path="/editProfile" element={<ProfileEditPage />} />
          <Route path='/server' element={<ServerPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AppRenderer>
  )
}

interface AppRenderProps {
  children: React.ReactNode;
}

function AppRenderer({ children }: AppRenderProps): JSX.Element {
  const isServerBannerVisible = useSelector(showServerBanner);
  return (
    <Box sx={{
      height: "100vh"
    }}>
      {isServerBannerVisible ? (
        <>
          <ServerBanner />
          <div style={{ paddingTop: 36, height: `calc(100vh - 36px)` }}>
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </Box>
  )
}


export default App
