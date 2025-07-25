import { CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import type { Catalog, ContentType } from "../../../../types/content";
import { MovieCatalog, SerieCatalog } from "../../api/Get";
import ContentCover from "../../components/ContentCover";

interface ContentGridFragmentProps {
    type: ContentType;
    onContentSelected: (content: Catalog) => void;
}

export default function ContentGridFragment({ type, onContentSelected }: ContentGridFragmentProps) {
    const [content, setContent] = useState<Catalog[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const items = type === 'Movie' ? await MovieCatalog() : await SerieCatalog();
            setContent(items);
            setLoading(false);
            console.log(items);
        };
        fetch();
    }, [type]);

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