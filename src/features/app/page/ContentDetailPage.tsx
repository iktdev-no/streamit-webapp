import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { type Catalog, type Episode, type Movie, type Serie, type Summary } from "../../../types/content";
import { GetMovie, GetSerie, GetSummary } from "../api/Get";
import CoverImage from "../components/ContentCover";
import EpisodeList from "../components/EpisodeList";
import Header from "../components/Header";
import SummaryView from "../components/SummaryView";
import { selectedContent } from "../store/appSlice";
import { setMediaItem, type MediaItem } from "../store/playContentSlice";
import { selectServerId, selectServerState, selectToken } from "../store/serverSlice";
import { favoriteStorage } from "../useStorage";
import { getSecureUrl } from "../utils";

export default function ContentDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const _selectedContent = useSelector(selectedContent);
    const [isFavorited, setFavorited] = useState<boolean>(false);
    const [content, setContent] = useState<Catalog | null>(null);
    const [summary, setSummary] = useState<Summary[] | null>(null);
    const [loading, setLoading] = useState(true);
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    const favorites = favoriteStorage(useSelector(selectServerId))



    useEffect(() => {
        console.log(_selectedContent)
        if (_selectedContent) {
            const fetch = async () => {
                const item = _selectedContent.type === 'Movie' ? await GetMovie(_selectedContent) : await GetSerie(_selectedContent);
                setContent(item);
                setLoading(false);
                console.log(item);
                const summaries = await GetSummary(_selectedContent.id);
                setSummary(summaries)
            };
            fetch();
            if (favorites?.get()?.includes(_selectedContent.id)) {
                setFavorited(true);
            }
        } else {
            navigate(-1);
        }

    }, [_selectedContent]);

    function setSerieMediaItem(episode: Episode) {
        if (!content) return;
        const mediaItem: MediaItem = {
            catalog: content,
            video: episode.video,
            videoSrc: episode.videoSrc!,
            subtitles: episode.subtitles
        }
        setMediaItemAndNavigate(mediaItem)
    }

    function setMovieMediaItem(movie: Movie) {
        const mediaItem: MediaItem = {
            catalog: movie,
            video: movie.video,
            videoSrc: movie.videoSrc!,
            subtitles: movie.subtitles
        }
        setMediaItemAndNavigate(mediaItem)
    }

    function setMediaItemAndNavigate(mediaItem: MediaItem) {
        console.log(mediaItem)
        dispatch(setMediaItem(mediaItem))
        navigate("/play")
    }

    function toggleFavorite() {
        if (!content) return;
        const stored: number[] = favorites?.get() ?? []
        if (isFavorited) {
            favorites?.set(stored.filter((id) => id != content.id) ?? [])
        } else {
            stored.push(content.id)
            favorites?.set(stored)
        }
        setFavorited(!isFavorited);

        toast.info("🚧 Denne funksjonen er ikke implementert ennå.", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
        });
    }

    if (loading) return <CircularProgress />;

    if (!content) {
        return (
            <>Go back</>
        )
    }


    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header onBackClicked={() => { navigate(-1) }} backgroundColor="#FFF0" />
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 0,
            }}>
                {content.coverSrc && (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        display: "block",
                        height: "50vh",
                        width: "100%",
                        backgroundColor: "magenta",
                        backgroundImage: `url("${getSecureUrl(content.coverSrc, serverState, token)}")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        filter: "blur(5px)",
                        zIndex: 0
                    }}></div>
                )}
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // mørk overlay
                        zIndex: 1,
                    }}
                />
            </Box>
            <Box sx={{
                marginTop: 30,
                display: "flex",
                flexDirection: "column",
                zIndex: 2
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
                    }}
                />
                <Box sx={{
                    backgroundColor: "#171717",
                    borderRadius: 2.5,
                    paddingBottom: 10,
                    marginTop: {
                        xs: "-80px",
                        sm: "-100px",
                        md: "-120px",
                    }
                }}>
                    <Box sx={{
                        minHeight: "100px",
                        marginTop: 2.5,
                        textAlign: "left",
                        marginLeft: {
                            xs: 20,
                            sm: 10,
                            md: "calc(160px + 100px)",
                        },
                    }}>
                        <Typography variant="h4">{content.title}</Typography>
                        <Box sx={{
                            marginTop: 2,
                            display: "flex"
                        }}>
                            {content.type === 'Movie' && (
                                <Button
                                    onClick={() => setMovieMediaItem(content as Movie)}
                                    sx={{ marginRight: 1 }} variant="contained" startIcon={<PlayArrowIcon />}>
                                    Spill av
                                </Button>
                            )}
                            <IconButton sx={{
                                color: "white",
                                marginLeft: 1,
                                marginRight: 1
                            }}
                                onClick={() => toggleFavorite()}>
                                {(isFavorited) ? (
                                    <StarIcon />
                                ) : (
                                    <StarBorderIcon />
                                )}
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ textAlign: "left", padding: "50px" }}>
                        {summary && summary.length > 0 && (
                            <SummaryView summary={summary} />)}
                    </Box>
                    {content.type === "Serie" && (
                        <EpisodeList onEpisodeSelected={setSerieMediaItem} episodes={(content as Serie).episodes} />
                    )}

                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}
