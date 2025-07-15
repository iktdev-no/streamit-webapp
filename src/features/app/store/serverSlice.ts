import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ServerInfo } from '../../../types/serverInfo'
import type { RootState } from '../store'

export interface ServerState {
  selectedServer: ServerInfo | null
  token: string | null
  activeUrl: string | null
}

const initialState: ServerState = {
  selectedServer: null,
  token: null,
  activeUrl: null,
}

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    selectServer(state, action: PayloadAction<ServerInfo>) {
      state.selectedServer = action.payload
    },
    setToken(state, action: PayloadAction<string | null>) {
      console.log("Setting token", action.payload)
      state.token = action.payload
    },
    setActiveUrl(state, action: PayloadAction<string | null>) {
      state.activeUrl = action.payload;
    }
  },
})

export const { selectServer, setToken, setActiveUrl } = serverSlice.actions
export default serverSlice.reducer
export const selectToken = (state: RootState) => state.server.token;
export const selectActiveUrl = (state: RootState) => state.server.activeUrl;
export const selectServerInfo = (state: RootState) => state.server.selectedServer;
export const selectServerState = (state: RootState) => state.server;