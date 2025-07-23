import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Catalog } from "../../../../types/content";
import { GetByIds, GetNew, GetUpdated } from "../../api/Get";
import HorizontalCatalog from "../../components/HorizontalCatalog";
import ResumeView from "../../components/ResumeView";
import { selectServerId } from "../../store/serverSlice";
import { favoriteStorage } from "../../useStorage";

interface HomeFragmentProps {
    onContentSelected: (content: Catalog) => void;
}

export default function HomeFragment({ onContentSelected }: HomeFragmentProps) {
    const [newlyAdded, setNewlyAdded] = useState<Catalog[] | undefined>(undefined)
    const [newlyUpdated, setNewlyUpdated] = useState<Catalog[] | undefined>(undefined)
    const [favorited, setFavorited] = useState<Catalog[] | undefined>(undefined);
    const favorites = favoriteStorage(useSelector(selectServerId))?.get() ?? []


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
        <ResumeView />
        <HorizontalCatalog items={newlyAdded} title="Nytt innhold" onItemClick={onContentSelected} />
        <HorizontalCatalog items={newlyUpdated} title="Nye episoder" onItemClick={onContentSelected} />
        {favorites.length > 0 && (
            <HorizontalCatalog items={favorited} title="Favoritter" onItemClick={onContentSelected} />
        )}
    </>)
}