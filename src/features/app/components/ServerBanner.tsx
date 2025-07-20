import { useSelector } from "react-redux";
import type { RootState } from "../store";



export default function ServerBanner() {
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