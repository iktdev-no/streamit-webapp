import { useEffect, useState, type JSX } from 'react'
import logo from './assets/logo.svg';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConnectGate } from './features/app/gate/ConnectGate'
import { useSelector } from 'react-redux';
import { selectProfile, setProfile, showServerBanner } from './features/app/store/appSlice';
import ProfilePage from './features/app/page/ProfilePage';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ContentPage from './features/app/page/ContentPage';
import ContentDetailPage from './features/app/page/ContentDetailPage';
import ContentPlayPage from './features/app/page/ContentPlayPage';
import { ToastContainer, toast } from "react-toastify";
import { NotificationGate } from './features/app/gate/NotificationGate';
import { shouldShowNotificationGate } from './utils/shouldShowNotificationGate';
import type { ServerInfo } from './types/serverInfo';
import SetupGate from './features/app/gate/SetupGate';
import { serverAccessTokenStorage, serverStorage } from './features/app/useStorage';
import ServerPage from './features/app/page/ServerPage';
import ProfileGate from './features/app/gate/ProfileGate';
import ProfileEditPage from './features/app/page/ProfileEditPage';
import ServerBanner from './features/app/components/ServerBanner';
import { Box } from '@mui/material';
import { RequestNewAccessToken } from './features/app/api/Post';
import { selectActiveUrl } from './features/app/store/serverSlice';

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

  console.log("Skal vi spørre om notifikasjons tillatelse?", shouldShowNotificationGate());
  console.log("Har vi allerede spurt om notifikasjonstillatelse?", notificationPermissionPerformed);
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

const defaultRouter = () => { }

export default App
