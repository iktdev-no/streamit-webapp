import { useSelector } from "react-redux";
import { selectMediaItem } from "../store/playContentSlice";
import ReactPlayer from 'react-player'
import { selectServerState, selectToken, type ServerState } from "../store/serverSlice";
import type { Subtitle } from "../../../types/content";
import { iso6393 } from 'iso-639-3';
import { Box } from "@mui/material";
import { getSecureUrl, useVideoDecoderSupport } from "../utils";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

interface TrackConfig {
    kind: "subtitles";
    src: string;
    srcLang: string;
    label: string;
    default?: boolean;
}

export function buildTracks(subtitles: Subtitle[]): TrackConfig[] {
    const getNativeLanguageName = (isoCode: string) => {
        const language = iso6393.find((lang) => lang.iso6393 === isoCode);
        return language ? language.name : 'Unknown Language';
    };

    return subtitles
        .filter(sub => !!sub.subtitleSrc) // Fjern de uten filsti
        .filter(sub => sub.format.toUpperCase() === "VTT")
        .map((sub, idx) => {
            const iso3 = getNativeLanguageName(sub.language) ?? sub.language; // fallback til original
            return {
                kind: "subtitles",
                src: sub.subtitleSrc!,
                srcLang: sub.language,
                label: iso3,
                default: idx === 0 // Sett første som default (valgfritt)
            };
        });
}

export default function ContentPlayPage() {
    const navigate = useNavigate();
    const mediaItem = useSelector(selectMediaItem);
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const codecs = useVideoDecoderSupport()

    console.log(codecs);



    const videoUrl = getSecureUrl(mediaItem!.videoSrc!, serverState, token)
    const subtitles = buildTracks(mediaItem?.subtitles ?? []).map((item, index) => {
        return {
            ...item,
            src: getSecureUrl(item.src, serverState, token)
        }
    })


    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <Header title={mediaItem?.catalog.title ?? "No content.."} 
                onBackClicked={() => navigate(-1)}/>
            <Box sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black"

            }}>
                <ReactPlayer controls crossOrigin="anonymous"
                    style={{
                        width: "100%",
                        minHeight: "50%",
                    }}
                >
                    <source src={videoUrl} />
                    {subtitles.map((subtitle, index) => (
                        <track key={index} src={subtitle.src} kind="subtitles" srcLang={subtitle.srcLang} label={subtitle.label} />
                    ))}
                </ReactPlayer>
            </Box>
        </Box>
    );

}
