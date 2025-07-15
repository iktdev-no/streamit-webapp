import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider, useSelector } from 'react-redux'
import { store, type RootState } from './features/app/store.ts'
import React from 'react'
import { Block } from '@mui/icons-material'
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme.ts'


const ServerBanner: React.FC = () => {
  const activeUrl = useSelector((state: RootState) => state.server.activeUrl);

  if (!activeUrl) return null;

  return (
    <div style={{
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      fontSize: '14px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999
    }}>
      Tilkoblet til: <strong>{activeUrl}</strong>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <ServerBanner />
          <div style={{ paddingTop: 36, height: `calc(100vh - 36px)` }}>
            <App />
          </div>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
