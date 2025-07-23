import { CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import type { Catalog } from "../../../../types/content";
import { SearchCatalog } from "../../api/Get";
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
            <Grid container spacing={2} sx={{
                justifyContent: 'center'
            }}>
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