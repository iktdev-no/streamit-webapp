import React, { useEffect, useRef } from 'react';
import shaka from "shaka-player";

import type { TrackConfig } from '../page/ContentPlayPage';

export interface ShakaPlayerComponentProps {
    videoUrl?: string,
    subtitles: TrackConfig[]
}

const ShakaPlayerComponent = ({ videoUrl, subtitles }: ShakaPlayerComponentProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoUrl) {
            return
        }

        const player = new shaka.Player();
        const video = videoRef.current;
        if (!video) return

        const onError = (error: any) => {
            console.error('Error code', error.code, 'object', error);
        };

        player.addEventListener('error', onError)
        player.attach(video).then(() => {
            player.load(videoUrl).then( async () => {
                
                await Promise.all(
                    subtitles.map((track) => 
                        player.addTextTrackAsync(
                        track.src,
                        track.srcLang,
                        track.kind,
                        undefined,
                        undefined,
                        track.label
                        )
                    )
                );

                // Vent til sporene er registrert
                const allTracks = player.getTextTracks();
                console.log("All tracks", allTracks)
                // Velg det sporet som har "default: true"
                const selectedTrack = allTracks.find(
                    t => subtitles.some(
                        s => s.label === t.label && s.srcLang === t.language && s.default
                    )
                );
                console.log("selectedTrack", selectedTrack)
                if (selectedTrack) {
                    player.selectTextTrack(selectedTrack);
                    player.setTextTrackVisibility(true);
                }

            }).catch(onError)
        }).catch(onError);
        return () => {
            player.destroy();
        }

    }, [videoUrl])

    /*useEffect(() => {
        const video = videoRef.current;
        const player = new shaka.Player(video!);
        shaka.text.TextEngine.registerParser('text/vtt', () => new shaka.text.VttTextParser());

        const onError = (error: any) => {
            console.error('Error code', error.code, 'object', error);
        };

        player.addEventListener('error', onError);

        player.load(videoUrl).then(() => {
            subtitles.forEach((track) => {
                player.addTextTrackAsync(
                    track.src,
                    track.srcLang,
                    track.kind,
                    undefined,
                    undefined,
                    track.label
                );

            });

            // Vent til sporene er registrert
            const allTracks = player.getTextTracks();

            // Velg det sporet som har "default: true"
            const selectedTrack = allTracks.find(
                t => subtitles.some(
                    s => s.label === t.label && s.srcLang === t.language || s.default
                )
            );

            if (selectedTrack) {
                player.selectTextTrack(selectedTrack);
                player.setTextTrackVisibility(true);
            }

        }).catch(onError);


        return () => {
            player.destroy();
        };
    }, [videoUrl]); */

    return (
        <video
            ref={videoRef}
            width="100%"
            height="100%"
            controls
            autoPlay
            style={{ backgroundColor: 'black' }}
            crossOrigin="anonymous"
        />
    );
};

export default ShakaPlayerComponent;
