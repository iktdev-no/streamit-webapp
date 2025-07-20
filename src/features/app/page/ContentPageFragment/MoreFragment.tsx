import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { InfoList, type InfoItem } from "../../components/InfoItem";
import InfoIcon from '@mui/icons-material/Info';
import ExtensionIcon from '@mui/icons-material/Extension';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useSelector } from "react-redux";
import { selectProfile } from "../../store/appSlice";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import StreamIcon from '@mui/icons-material/Stream';
import { useNavigate } from "react-router-dom";

export default function MoreFragment() {
    const navigate = useNavigate();
    const profile = useSelector(selectProfile);
    const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    const version = import.meta.env.VITE_APP_VERSION;
    const environment = import.meta.env.VITE_ENVIRONMENT;


    useEffect(() => {
        // Sjekk om appen er installert som PWA
        setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);

        // Hent versjon fra server (f.eks. public/version.json)
        fetch("/version.json", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => setRemoteVersion(data.version))
            .catch(() => setRemoteVersion("Ukjent"));
    }, []);

    const isOutdated = true // remoteVersion && remoteVersion !== version;

    const userProfile: InfoItem[] = [
        {
            id: "profile",
            icon: <PeopleAltIcon />,
            text: "Bytt profil",
            variant: "default",
            onClick: () => {
                navigate("/changeProfile");
            }
        },
        {
            id: "settings",
            icon: <ManageAccountsIcon />,
            text: "Rediger profil",
            variant: "default",
            onClick: () => { 
                navigate("/editProfile");
            }
        }
    ];

    const settingsGroup: InfoItem[] = [
        {
            id: "subtitle",
            icon: <SubtitlesIcon />,
            text: "Undertekster",
            variant: "default",
            onClick: () => { }
        },
        {
            id: "server",
            icon: <StreamIcon />,
            text: "Strømmetjener",
            variant: "default",
            onClick: () => { navigate("/server"); }
        }
    ];

    const infoGroup: InfoItem[] = [
        {
            id: "version",
            icon: <InfoIcon />,
            text: `Versjon: ${version}`,
            variant: "info"
        },
        {
            id: "environment",
            icon: <ExtensionIcon />,
            text: `Miljø: ${environment}`,
            variant: "default"
        },
        ...(isOutdated ? [{
            id: "update",
            icon: <CloudDownloadIcon />,
            text: `Ny versjon tilgjengelig: ${remoteVersion}`,
            variant: "update",
            onClick: () => { }
        } as InfoItem] : []),
        {
            id: "installed",
            icon: isInstalled ? <FileDownloadDoneIcon /> : <CloudIcon />,
            text: `Installert som app: ${isInstalled ? "Ja" : "Nei"}`,
            variant: isInstalled ? "info" : "warning"
        },
    ];


    return (
        <Box sx={{ mr: 20, ml: 20 }}>
            <Box>
                <img src={profile?.imageSrc!} style={{
                    height: 150,
                    width: 150,
                }} />
                <Typography variant="h4" gutterBottom>
                    {profile?.name ?? "Profil"}
                </Typography>
            </Box>
            <InfoList sx={{
                mt: 2,
                mb: 2,
            }} items={userProfile} orientation="horizontal" />
            <InfoList sx={{
                mt: 2,
                mb: 2,
            }} items={settingsGroup} />

            <InfoList items={infoGroup} />


        </Box>
    );
}
