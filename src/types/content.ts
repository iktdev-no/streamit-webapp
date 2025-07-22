import type { MediaItem } from "../features/app/store/playContentSlice";


export const ContentType = {
  Movie: 'Movie',
  Serie: 'Serie',
} as const;

export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export interface ResumeMedia extends MediaItem {
    title: string,
}

export interface Catalog {
    id: number,
    title: string,
    cover?: string,
    coverSrc?: string,
    type: ContentType,
    collection: string,
    genres: string,
    recent: boolean
}

export interface Movie extends Catalog {
    video: string,
    videoSrc?: string,
    subtitles: Subtitle[],

    progress: number,
    duration: number,
    played: number
}

export interface Serie extends Catalog {
    episodes: Episode[]
}

export interface Episode {
    season: number,
    episode: number,
    title?: string,
    video: string
    videoSrc?: string,
    subtitles: Subtitle[],

    progress: number,
    duration: number,
    played: number
}

export interface Subtitle {
    id: number,
    associatedWithVideo: string,
    language: string,
    subtitle: string,
    subtitleSrc?: string,
    collection: string,
    format: string
}

export interface Summary {
    id: number,
    description: string,
    language: string,
    cid: number
}