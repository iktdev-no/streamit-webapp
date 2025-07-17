import { useEffect, useState } from "react";
import { type Summary, type Catalog, type Serie, type Episode, type Movie } from "../../../types/content"
import { GetMovie, MovieCatalog, GetSerie, SerieCatalog, GetSummary } from "../api/Get";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { selectedContent } from "../store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, type data } from "react-router-dom";
import Header from "../components/Header";
import EpisodeList from "../components/EpisodeList";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { setMediaItem, type MediaItem } from "../store/playContentSlice";
import { ToastContainer, toast } from "react-toastify";
import { FavoritesStorage } from "../useStorage";
import CoverImage from "../components/ContentCover";
import { selectServerState, selectToken } from "../store/serverSlice";
import { getSecureUrl } from "../utils";

export default function ContentDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const _selectedContent = useSelector(selectedContent);
    const [isFavorited, setFavorited] = useState<boolean>(false);
    const [content, setContent] = useState<Catalog | null>(null);
    const [summary, setSummary] = useState<Summary[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector(selectToken);
    const serverState = useSelector(selectServerState);
    


    useEffect(() => {
        console.log(_selectedContent)
        if (_selectedContent) {
            const fetch = async () => {
                const item = _selectedContent.type === 'Movie' ? await GetMovie(_selectedContent) : await GetSerie(_selectedContent);
                console.log("Fetched content:", item);
                setContent(item);
                setLoading(false);
                console.log(item);
                const summaries = await GetSummary(_selectedContent.id);
                setSummary(summaries)
                console.log(summaries)
            };
            fetch();
            if (FavoritesStorage.is(_selectedContent.id)) {
                setFavorited(true);
            }
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
        if (isFavorited) {
            FavoritesStorage.remove(content.id);
        } else {
            FavoritesStorage.add(content.id);
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
        navigate(-1);
        return (<>Go back</>)
    }

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header onBackClicked={() => { navigate(-1) }} />
            <Box sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: -1,
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
                        zIndex: -3
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
                        zIndex: -2,
                    }}
                />
            </Box>
            <Box sx={{
                marginTop: 30,
                display: "flex",
                flexDirection: "column"
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
                            <Button
                                onClick={() => setMovieMediaItem(content as Movie)}
                                sx={{ marginRight: 1 }} variant="contained" startIcon={<PlayArrowIcon />}>
                                Spill av
                            </Button>
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
                        {summary.map((item, index) => (
                            <Box key={index}>
                                <Typography>{item.language}</Typography>
                                <Typography variant="body1">{item.description}</Typography>
                            </Box>
                        ))}
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
