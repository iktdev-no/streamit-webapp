import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ServerInfo } from '../../../types/serverInfo'

interface DiscoveredState {
  servers: ServerInfo[]
}

const initialState: DiscoveredState = {
  servers: [],
}

const discoveredServerSlice = createSlice({
  name: 'discoveredServer',
  initialState,
  reducers: {
    setDiscoveredServers(state, action: PayloadAction<ServerInfo[]>) {
      state.servers = action.payload
    },
    clearDiscoveredServers(state) {
      state.servers = []
    }
  },
})

export const { setDiscoveredServers, clearDiscoveredServers } = discoveredServerSlice.actions
export default discoveredServerSlice.reducer
