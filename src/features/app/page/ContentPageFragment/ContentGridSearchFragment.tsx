import { useEffect, useState } from "react";
import type { ContentType } from "../../../../types/content";
import type { Catalog } from "../../../../types/content";
import { MovieCatalog, SearchCatalog, SerieCatalog } from "../../api/Get";
import { CircularProgress, Typography, Grid } from "@mui/material";
import ContentCover from "../../components/ContentCover";

interface ContentGridSearchFragmentProps {
    query: string;
    onContentSelected: (content: Catalog) => void;
}

export default function ContentGridSearchFragment({ query, onContentSelected }: ContentGridSearchFragmentProps) {
    const [content, setContent] = useState<Catalog[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const items = await SearchCatalog(query)
            setContent(items);
            setLoading(false);
            console.log(items);
        };
        fetch();
    }, [query]);

    if (loading) return <CircularProgress />;

    return (
        <div style={{ padding: '1rem' }}>
            <Grid container spacing={2}>
                {content.map(item => (
                    <Grid key={item.id}>
                        <ContentCover 
                            onClick={() => onContentSelected(item)}
                            src={item.coverSrc}
                            alt={item.title}
                        />
                        
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}