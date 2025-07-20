import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Profile } from '../../../types/profile'
import type { RootState } from '../store'
import type { Catalog } from '../../../types/content'

interface AppState {
  profile: Profile | null,
  selectedContent: Catalog | null,
  showServerBanner: boolean
}

const initialState: AppState = {
  profile: null,
  selectedContent: null,
  showServerBanner: false
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    setSelectedContent: (state, action: PayloadAction<Catalog>) => {
      state.selectedContent = action.payload;
    },
    setServerBannerVisible: (state, action: PayloadAction<boolean>) => {
      state.showServerBanner = action.payload
    }
  },
})

export const { setProfile, setSelectedContent } = appSlice.actions
export const selectProfile = (state: RootState) => state.app.profile;
export const selectedContent = (state: RootState) => state.app.selectedContent;
export const showServerBanner = (state: RootState) => state.app.showServerBanner;
export default appSlice.reducer
