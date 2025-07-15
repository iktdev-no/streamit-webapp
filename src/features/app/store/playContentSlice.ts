import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Catalog, Subtitle } from "../../../types/content";
import type { RootState } from '../store'

export interface MediaItem {
    video: string
    videoSrc: string,
    subtitles: Subtitle[]
    catalog: Catalog
}

interface PlayableContent {
    mediaItem: MediaItem | null
}

const initialState: PlayableContent = {
    mediaItem: null
}

const playableContentSlice = createSlice({
    name: 'playableContent',
    initialState,
    reducers: {
        setMediaItem: (state, action: PayloadAction<MediaItem>) => {
            state.mediaItem = action.payload
        }
    }
});

export const { setMediaItem } = playableContentSlice.actions;
export const selectMediaItem = (state: RootState) => state.playableContent.mediaItem;
export default playableContentSlice.reducer;