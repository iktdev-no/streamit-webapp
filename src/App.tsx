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

function App() {
  const [appReady, setAppReady] = useState(false);
  const profile = useSelector(selectProfile)


  if (!appReady) {
    return <ConnectGate onReady={() => setAppReady(true)} onRequiresSetup={() => {
      return (<><p>Requires setup not implemented</p></>);
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
    </>
  )
}

export default App
