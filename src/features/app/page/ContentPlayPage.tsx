import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Episode, ResumeMedia, Serie, Subtitle } from "../../../types/content";
import Header from "../components/Header";
import ShakaPlayerComponent from "../components/ShakaPlayerComponent";
import { selectMediaItem, type MediaItem } from "../store/playContentSlice";
import { selectServerId, selectServerState, selectToken } from "../store/serverSlice";
import { resumeStorage } from "../useStorage";
import { getLanguageNameFromISO3, getSecureUrl, useVideoDecoderSupport } from "../utils";

export interface TrackConfig {
    kind: "subtitles";
    src: string;
    srcLang: string;
    label: string;
    default?: boolean;
}

export function buildTracks(subtitles: Subtitle[]): TrackConfig[] {
    return subtitles
        .filter(sub => !!sub.subtitleSrc) // Fjern de uten filsti
        .filter(sub => sub.format.toUpperCase() === "VTT")
        .map((sub, idx) => {
            const iso3 = getLanguageNameFromISO3(sub.language) ?? sub.language; // fallback til original
            return {
                kind: "subtitles",
                src: sub.subtitleSrc!,
                srcLang: sub.language,
                label: iso3,
                default: idx === 0 // Sett første som default (valgfritt)
            };
        });
}

function getEpisodeOnSerie(mediaItem: MediaItem): Episode | null {
    const catalog = mediaItem.catalog;
    if (catalog.type === 'Serie') {
        const episode = (catalog as Serie).episodes.find((value, i) => value.video === mediaItem.video);
        if (episode) {
            return episode;
        }
    }
    return null;
}

function generateTitle(mediaItem: MediaItem): string {
    const catalog = mediaItem.catalog;
    if (catalog.type === 'Serie') {
        const episode = getEpisodeOnSerie(mediaItem)
        if (episode) {
            return `S${episode.season} · E${episode.episode} - ${episode.title ?? "Episode"}`;
        }
    }

    return catalog.title ?? "Film uten tittel";
}

function getResumeProgress(mediaItem: MediaItem | ResumeMedia): number | undefined {
    if (typeof mediaItem === "object" && "progress" in mediaItem && "duration" in mediaItem) {
        const progress = mediaItem.progress;
        if (progress) {
            return progress;
        }
    }
    return undefined;
}

export default function ContentPlayPage() {
    const navigate = useNavigate();
    const mediaItem = useSelector(selectMediaItem);
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const serverId = useSelector(selectServerId);
    const codecs = useVideoDecoderSupport()

    if (!mediaItem) {
        navigate(-2);
        return (<p>No media item found</p>)
    }

    const title = generateTitle(mediaItem);


    //console.log(codecs);

    const onSaveProgress = (incomingProgress: number, incomingDuration: number) => {
        const media: ResumeMedia = {
            title: generateTitle(mediaItem),
            ...mediaItem,
            progress: incomingProgress,
            duration: incomingDuration,
        }
        console.log("Saving progress", media)

        resumeStorage(serverId)?.set(media)
    }

    const videoUrl = getSecureUrl(mediaItem!.videoSrc!, serverState, token)
    const subtitles = buildTracks(mediaItem?.subtitles ?? []).map((item, index) => {
        return {
            ...item,
            src: getSecureUrl(item.src, serverState, token)
        }
    })

    const resumeProgress = getResumeProgress(mediaItem);


    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Header title={`${mediaItem.catalog.title}: ${title}`}
                onBackClicked={() => navigate(-1)} backgroundColor="#FFF0" />
            <Box sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black"

            }}>
                <ShakaPlayerComponent
                    progress={resumeProgress}
                    videoUrl={videoUrl}
                    subtitles={subtitles}
                    onSaveProgress={onSaveProgress}
                />

            </Box>
        </Box>
    );

}
