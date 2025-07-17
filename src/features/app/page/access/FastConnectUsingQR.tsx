import { useMemo } from "react";
import { usePfns } from "../../hooks/usePfns";
import { generateRandomPin } from "../../utils";
import { QRCodeCanvas } from 'qrcode.react'
import { configureServerKey, useFcmListener } from "../../hooks/useFcmListener";


export default function GateAuthenticateUsingQR() {
  useFcmListener(configureServerKey, (payload) => {
    console.log('Configure-melding mottatt:', payload);
  });
  const { pfnsInfo, loading, error } = usePfns();
  const pfnsObject = useMemo(() => {
    if (!pfnsInfo?.pfnsId) return null;
    const pfnsId = pfnsInfo.pfnsId;
    const pin = generateRandomPin(6);
    return {
      pfnsReceiverId: pfnsId,
      pin
    };
  }, [pfnsInfo]);

  if (loading) return <p>⏳ Genererer pfnsId…</p>;
  if (error) return <p>⚠️ Feil: {error.message}</p>;
  if (!pfnsObject) return null;


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '360px',
      margin: 'auto'
    }}>
      <QRCodeCanvas value={JSON.stringify(pfnsObject)} size={200} bgColor="#000" fgColor="#FFF" />

      <div style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 500 }}>
        📲 Scan denne med <strong>StreamIt</strong>-appen<br />
        på telefonen din for å koble til
      </div>
    </div>
  )
}