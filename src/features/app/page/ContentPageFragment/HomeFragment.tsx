import type { SxProps } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { Catalog } from "../../../../types/content";
import { GetByIds, GetNew, GetUpdated, GetUserFavorites } from "../../api/Get";
import HorizontalCatalog from "../../components/HorizontalCatalog";
import ResumeView from "../../components/ResumeView";
import { selectedUserId } from "../../store/appSlice";
import { selectServerId } from "../../store/serverSlice";
import { favoriteStorage } from "../../useStorage";

interface HomeFragmentProps {
    onContentSelected: (content: Catalog) => void;
}

export default function HomeFragment({ onContentSelected }: HomeFragmentProps) {
    const [newlyAdded, setNewlyAdded] = useState<Catalog[] | undefined>(undefined)
    const [newlyUpdated, setNewlyUpdated] = useState<Catalog[] | undefined>(undefined)
    const [favorited, setFavorited] = useState<Catalog[]>([]);
    const serverId = useSelector(selectServerId)
    const userId = useSelector(selectedUserId)
    const favStorage = useMemo(() => {
        return userId && serverId ? favoriteStorage(`${serverId}_${userId}`) : undefined;
    }, [userId, serverId]);


    useEffect(() => {
        // Hent nye kataloger
        GetNew().then((res) => {
            setNewlyAdded(res);
            console.log("Updating with 'GetNew'")
        }).catch(err => {
            console.error("Kunne ikke hente nye kataloger", err);
        });

        // Hent oppdaterte kataloger
        GetUpdated().then((res) => {
            setNewlyUpdated(res)
            console.log("Updating with 'GetUpdated'")
        }).catch(err => {
            console.error("Kunne ikke hente oppdaterte kataloger", err);
        });

    }, []);

    useEffect(() => {
        if (!userId) return
        GetUserFavorites(userId).then((ids) => {
            const localFavorites = favStorage?.get() ?? []


            const merged = Array.from(new Set([...ids, ...localFavorites]))
            const isEqual = merged.length === localFavorites.length && merged.every(id => localFavorites.includes(id));

            if (!isEqual) {
                favStorage?.set(merged);
            }
            GetByIds(merged).then(setFavorited).catch(err => {
                console.error("Kunne ikke hente favoritter", err);
            });
        })
    }, [userId, serverId, favStorage])


    const hzSpaceing: SxProps = {
        marginTop: 3
    }


    return (<>
        <ResumeView />
        <HorizontalCatalog sx={hzSpaceing} items={newlyAdded} title="Nytt innhold" onItemClick={onContentSelected} />
        <HorizontalCatalog sx={hzSpaceing} items={newlyUpdated} title="Nye episoder" onItemClick={onContentSelected} />
        {favorited?.length > 0 && (
            <HorizontalCatalog sx={hzSpaceing} items={favorited} title="Favoritter" onItemClick={onContentSelected} />
        )}
    </>)
}