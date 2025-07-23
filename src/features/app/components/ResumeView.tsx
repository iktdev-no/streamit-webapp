import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestoreIcon from '@mui/icons-material/Restore';
import { Box, Button, LinearProgress, linearProgressClasses, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { ResumeMedia } from "../../../types/content";
import { setMediaItem } from "../store/playContentSlice";
import { selectServerId, selectServerState, selectToken } from "../store/serverSlice";
import { resumeStorage } from "../useStorage";
import { getSecureUrl } from "../utils";
import CoverImage, { defaultSize } from "./ContentCover";
import DropShadow from "./DropShadow";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.primary.dark,
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.primary.dark,
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.secondary.main,
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.secondary.main,
        }),
    },
}));

function getProgressPercentage(progress: number, duration: number): number {
    if (progress <= 0 || duration <= 0) {
        return 0;
    }
    return (progress / duration) * 100;
}

function formatSimpleDuration(seconds: number): string {
    const nf = new Intl.NumberFormat(navigator.language);
    if (seconds < 60) return `${nf.format(seconds)}s`;
    if (seconds < 3600) return `${nf.format(Math.floor(seconds / 60))}m`;
    if (seconds < 86400) return `${nf.format(Math.floor(seconds / 3600))}h`;
    return `${nf.format(Math.floor(seconds / 86400))}d`;
}



export default function ResumeView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const serverState = useSelector(selectServerState);
    const token = useSelector(selectToken);
    const serverId = useSelector(selectServerId);
    const [resumeMedia, setResumeMedia] = useState<ResumeMedia | undefined | null>(undefined)

    useEffect(() => {
        const resumeMedia = resumeStorage(serverId)?.get();
        setResumeMedia(resumeMedia);
    }, [serverId])

    if (!resumeMedia) {
        return (undefined)
    }

    const content = resumeMedia.catalog
    const progressPercentage = getProgressPercentage((resumeMedia?.progress ?? 0), (resumeMedia.duration ?? 0));
    const remainingTime = formatSimpleDuration(Math.floor((resumeMedia.duration ?? 0) - (resumeMedia.progress ?? 0)))

    if (progressPercentage > 98 || progressPercentage < 1) {
        return (<></>)
    }

    const height = 700

    return (
        <Box sx={{
            height: 500,
            display: "flex",
            alignItems: "center",
            maxWidth: "100vw",
            overflow: "hidden"
        }}>
            <Box sx={{
                maxWidth: "100vw",
                overflow: "hidden"
            }}>
                {content.coverSrc && (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        display: "block",
                        height: height - 100,
                        width: "100%",
                        backgroundColor: "magenta",
                        backgroundImage: `url("${getSecureUrl(content.coverSrc, serverState, token)}")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        filter: "blur(5px)",
                        zIndex: -3
                    }}></div>
                )}
                <Box display="none"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: height,
                        backgroundColor: "rgba(0, 0, 0, 0.7)", // mørk overlay
                        zIndex: -2,
                    }}
                />
                <DropShadow height={height} />

            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
            }}>
                <CoverImage
                    src={content.coverSrc}
                    alt={content.title}
                    sx={{
                        marginLeft: {
                            xs: 4,
                            sm: 6,
                            md: '50px',
                        },
                        minWidth: defaultSize.width,
                        minHeight: defaultSize.height
                    }}
                />
                <Box sx={{
                    minHeight: "100px",
                    textAlign: "left",
                    marginLeft: 5,
                    marginRight: 5
                }}>
                    <Typography variant="h2">{content.title}</Typography>
                    <Typography variant="h5" gutterBottom>{resumeMedia.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <BorderLinearProgress variant="determinate" value={progressPercentage} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                            <RestoreIcon />
                            <Typography variant="body2">{remainingTime}</Typography>
                        </Box>
                    </Box>

                    <Button color="secondary"
                        onClick={() => {
                            dispatch(setMediaItem(resumeMedia))
                            navigate("/play")
                        }}
                        sx={{ marginTop: 3 }} variant="contained" startIcon={<PlayArrowIcon />}>
                        Gjennopta
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}