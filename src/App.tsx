import { useState } from 'react'
import logo from './assets/logo.svg';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {ConnectGate} from './features/app/ConnectGate'
import { useSelector } from 'react-redux';
import { selectProfile, setProfile } from './features/app/store/appSlice';
import ProfilePage from './features/app/page/ProfilePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ContentPage from './features/app/page/ContentPage';
import ContentDetailPage from './features/app/page/ContentDetailPage';
import ContentPlayPage from './features/app/page/ContentPlayPage';
import { ToastContainer, toast } from "react-toastify";
import { NotificationGate } from './features/app/NotificationGate';
import { shouldShowNotificationGate } from './utils/shouldShowNotificationGate';
import type { ServerInfo } from './types/serverInfo';
import SetupGate from './features/app/SetupGate';
import { serverStorage } from './features/app/useStorage';

function App() {
  const [server, setServer] = useState<ServerInfo | null>(serverStorage.get());
  const [notificationPermissionPerformed, setNotificationPermissionPerformed] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const profile = useSelector(selectProfile)

  console.log("Skal vi spørre om notifikasjons tillatelse?", shouldShowNotificationGate());
  console.log("Har vi allerede spurt om notifikasjonstillatelse?", notificationPermissionPerformed);
  if (!notificationPermissionPerformed && shouldShowNotificationGate()) {
    return (<NotificationGate onResult={(result) => {
      setNotificationPermissionPerformed(true);
      console.log("🎉 Ferdig med tillatelse:", result);
    }} />)
  }

  if (!server) {
    return <SetupGate setServer={(server) => {
      serverStorage.set(server);
      console.log("🚀 Server satt:", server);
      setServer(server);
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
    return <ProfilePage canGoBack={false} />
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ContentPage />} />
          <Route path='/content' element={<ContentDetailPage />} />
          <Route path='/play' element={<ContentPlayPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
