import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';
import shaka from "shaka-player/dist/shaka-player.ui"


import type { TrackConfig } from '../page/ContentPlayPage';
import { CircularProgress } from '@mui/material';

export interface ShakaPlayerComponentProps {
    videoUrl?: string,
    subtitles: TrackConfig[],
    progress?: number,
    onSaveProgress?: ( progress: number, duration: number ) => void
}

const ShakaPlayerComponent = ({ videoUrl, subtitles, progress, onSaveProgress }: ShakaPlayerComponentProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [video, setVideo] = useState<HTMLVideoElement | null>(null);
    const [isBuffering, setIsBuffering] = useState(true);
    const viewProgressRef = useRef(-1);
    const mediaDurationRef = useRef(-1);


const allEvents = [
  'loading',
  'loaded',
  //'trackschanged',
  'adaptation',
  'manifestparsed',
  'streaming',
  'variantchanged',
  'drmstatus',
  'texttrackvisibility',
  'timelineregionadded',
  'mediaqualitychanged',
  'play',
  'pause',
  'ended'
];

    useEffect(() => {
        if (!videoUrl) {
            return
        }

        const player = new shaka.Player();
        setVideo(videoRef.current)
        if (!video) return

        const ui = new shaka.ui.Overlay(player, videoRef.current!, video);
        ui.configure({ addBufferingSpinner: false }); // hvis tilgjengelig


        const onError = (error: any) => {
            console.error('Error code', error.code, 'object', error);
        };

        player.addEventListener('error', onError)
        player.addEventListener('buffering', () => {
            setIsBuffering(player.isBuffering())
        });
        for (const eventType of allEvents) {
        player.addEventListener(eventType, (event: any) => {
            console.log(`Event: ${eventType}`, event);
        });
        }
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

                if (progress && progress > 0) {
                    console.warn("Changing start time to: ", progress)
                    video.fastSeek(progress)
                }
            }).catch(onError)
        }).catch(onError);
        return () => {
            console.log("Saving", viewProgressRef.current, mediaDurationRef.current)
            onSaveProgress?.(viewProgressRef.current, mediaDurationRef.current);
            player.destroy();
        };

    }, [videoUrl, video])

    const onTimeUpdate = () => {
        if (!video) return
        if (video.duration != mediaDurationRef.current) { 
            mediaDurationRef.current = video.duration; 
        }
        viewProgressRef.current = video.currentTime;
    }

    return (
        <>
        <video
            ref={videoRef}
            width="100%"
            height="100%"
            controls
            autoPlay
            style={{ backgroundColor: 'black' }}
            crossOrigin="anonymous"
            onTimeUpdate={onTimeUpdate}
        />
        {isBuffering && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(50% - 30px)',
            left: 'calc(50% - 30px)',
            width: 60,
            height: 60,
            zIndex: 10,
          }}
        >
          <CircularProgress  />
        </div>
      )}
        </>
    );
};

export default ShakaPlayerComponent;
