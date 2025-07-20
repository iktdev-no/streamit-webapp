import { useRef } from 'react';
import React, { useEffect, useState } from 'react';
import type { ServerState } from './store/serverSlice';
import { iso6393 } from 'iso-639-3';


/** Intern funksjon for å hente funksjonsnavn fra stack */
function resolveCallerName(): string {
  const stack = new Error().stack;
  if (!stack) return 'unknown';

  const lines = stack.split('\n');

  for (const line of lines) {
    // Ignorer hjelpekall
    if (
      !line.includes('resolveCallerName') &&
      !line.includes('Logger') &&
      !line.includes('useLogger') &&
      !line.includes('createLogger')
    ) {
      const match = line.match(/at (.+?) \(/);
      if (match) {
        return match[1].split('.').pop() || 'anonymous';
      }
    }
  }

  return 'anonymous';
}

/** Baselogger med tag */
function scopedLogger(tag: string) {
  return {
    info: (msg: string, ...args: any[]) =>
      console.info(`[${tag}] ℹ️ ${msg}`, ...args),
    warn: (msg: string, ...args: any[]) =>
      console.warn(`[${tag}] ⚠️ ${msg}`, ...args),
    error: (msg: string, ...args: any[]) =>
      console.error(`[${tag}] ❌ ${msg}`, ...args),
  };
}

/** Hook for React-komponenter eller hooks */
export function useLogger() {
  const tagRef = useRef(resolveCallerName());
  return scopedLogger(tagRef.current);
}

/** Funksjon for bruk i vanlige tjenester eller funksjoner */
export function Logger(): ReturnType<typeof scopedLogger> {
  const tag = resolveCallerName();
  return scopedLogger(tag);
}

export function isRemote(state: ServerState): boolean {
    return (state.activeUrl == state.selectedServer?.remote)
}

export function getSecureUrl(mediaSrc: string, serverState: ServerState | null, token: string | null): string {
    if (serverState && isRemote(serverState)) {
        return `${mediaSrc}?token=${token}`
    } else {
        return mediaSrc;
    }
}


export function getLanguageNameFromISO3(iso: string): string {
          const language = iso6393.find((lang) => lang.iso6393 === iso);
          return language ? language.name : 'Unknown Language';
}

interface CodecSupport {
  [codecName: string]: string;
}

export const useVideoDecoderSupport = (): CodecSupport => {
  const [support, setSupport] = useState<CodecSupport>({});

  useEffect(() => {
    const checkSupport = async () => {
      const results: CodecSupport = {};

      const tests: { type: string; label: string }[] = [
        { type: 'video/mp4; codecs="hev1"', label: 'HEVC (hev1)' },
        { type: 'video/mp4; codecs="hvc1"', label: 'HEVC (hvc1)' },
        { type: 'video/mp4; codecs="avc1.42E01E"', label: 'H.264' },
        { type: 'video/webm; codecs="vp9"', label: 'VP9' },
        { type: 'video/webm; codecs="av1"', label: 'AV1' }
      ];

      for (const { type, label } of tests) {
        const videoEl = document.createElement('video');
        const canPlay: string = videoEl.canPlayType(type);
        results[label] = canPlay || 'probably not';
      }

      if ('mediaCapabilities' in navigator) {
        const config: MediaDecodingConfiguration = {
          type: 'file',
          video: {
            contentType: 'video/mp4; codecs="hev1"',
            width: 1920,
            height: 1080,
            bitrate: 5000000,
            framerate: 30
          }
        };

        try {
          const mediaSupport = await (navigator as any).mediaCapabilities.decodingInfo(config);
          results['HEVC (MediaCapabilities)'] = mediaSupport.supported ? 'Yes 🎉' : 'No ❌';
        } catch (error) {
          results['HEVC (MediaCapabilities)'] = 'Feil ved sjekk';
        }
      }

      setSupport(results);
    };

    checkSupport();
  }, []);

  return support;
};

export function generateRandomPin(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return pin;
}