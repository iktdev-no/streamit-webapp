import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import type { Episode } from "../../../types/content";


interface Props {
    episodes: Episode[];
    defaultExpandedSeason?: number; // f.eks. 1 for "Sesong 1"
    onEpisodeSelected: (episode: Episode) => void;
}

export default function EpisodeList({ episodes, defaultExpandedSeason = 1, onEpisodeSelected }: Props) {
    // Grupperer episodene basert på sesong
    const episodesBySeason = episodes.reduce((acc, episode) => {
        const key = episode.season;
        if (!acc[key]) acc[key] = [];
        acc[key].push(episode);
        return acc;
    }, {} as Record<number, Episode[]>);

    return (
        <Box>
            {Object.entries(episodesBySeason).map(([seasonKey, seasonEpisodes]) => {
                const seasonNumber = Number(seasonKey);
                return (
                    <Accordion
                        key={seasonKey} defaultExpanded={seasonNumber === defaultExpandedSeason}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Sesong {seasonNumber}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                            padding: 0, // fjerner padding for å bruke full bredde
                        }}>
                            {seasonEpisodes.map((episode) => (
                                <Box
                                    onClick={() => onEpisodeSelected(episode)}
                                    key={`${episode.season}-${episode.episode}`}
                                    sx={{
                                        py: 1,
                                        pl: 2,
                                        textAlign: "left",
                                        cursor: "pointer",
                                        backgroundColor: 'primary.dark', // 👈 bruker farge fra tema
                                        '&:hover': {
                                            backgroundColor: 'primary.light', // valgfritt: hover-effekt
                                        },
                                    }}>
                                    <Typography variant="body1">
                                        Episode {episode.episode} {(episode.title) && " - " + episode.title}
                                    </Typography>
                                </Box>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}