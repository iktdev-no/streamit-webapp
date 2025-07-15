import { useEffect, useState } from "react";
import type { Catalog } from "../../../../types/content";
import { GetByIds, GetNew, GetUpdated } from "../../api/Get";
import { Box } from "@mui/material";
import HorizontalCatalog from "../../components/HorizontalCatalog";
import { FavoritesStorage } from "../../useStorage";

interface HomeFragmentProps {
    onContentSelected: (content: Catalog) => void;
}

export default function HomeFragment({ onContentSelected }: HomeFragmentProps) {
    const [resume, setResume] = useState<Catalog|null>(null)
    const [newlyAdded, setNewlyAdded] = useState<Catalog[]|undefined>(undefined)
    const [newlyUpdated, setNewlyUpdated] = useState<Catalog[]|undefined>(undefined)
    const [favorited, setFavorited] = useState<Catalog[]|undefined>(undefined);
    const favorites = FavoritesStorage.get();

    useEffect(() => {
        // Hent nye kataloger
        GetNew().then(setNewlyAdded).catch(err => {
            console.error("Kunne ikke hente nye kataloger", err);
        });

        // Hent oppdaterte kataloger
        GetUpdated().then(setNewlyUpdated).catch(err => {
            console.error("Kunne ikke hente oppdaterte kataloger", err);
        });

        GetByIds(favorites).then(setFavorited).catch(err => {
            console.error("Kunne ikke hente favoritter", err);
        });

    }, []);
        

    return (<>
    <HorizontalCatalog items={newlyAdded} title="Nytt innhold" onItemClick={onContentSelected} />
    <HorizontalCatalog items={newlyUpdated} title="Nye episoder" onItemClick={onContentSelected} />
    <HorizontalCatalog items={favorited} title="Favoritter" onItemClick={onContentSelected} />
    
    </>)
}