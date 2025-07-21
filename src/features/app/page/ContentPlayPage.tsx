import { useSelector } from "react-redux";
import { selectMediaItem } from "../store/playContentSlice";
import ReactPlayer from 'react-player'
import { selectServerState, selectToken, type ServerState } from "../store/serverSlice";
import type { Subtitle } from "../../../types/content";
import { Box } from "@mui/material";
import { getLanguageNameFromISO3, getSecureUrl, useVideoDecoderSupport } from "../utils";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ShakaPlayerComponent from "../components/ShakaPlayerComponent";

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

export default function ContentPlayPage() {
    const navigate = useNavigate();
    const mediaItem = useSelector(selectMediaItem);
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const codecs = useVideoDecoderSupport()

    const [duration, setDuration] = useState(-1)

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
                onBackClicked={() => navigate(-1)} backgroundColor="#FFF0"/>
            <Box sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black"

            }}>
                <ShakaPlayerComponent 
                    videoUrl={videoUrl} 
                    subtitles={subtitles}                    
                />

            </Box>
        </Box>
    );

}

/*
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
*/