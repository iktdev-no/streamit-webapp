import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TvIcon from '@mui/icons-material/Tv';
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { Catalog } from "../../../types/content";
import Header from "../components/Header";
import HeaderSearchField from "../components/HeaderSearchField";
import { useSessionState } from "../sessionUtil";
import { setSelectedContent } from "../store/appSlice";
import ContentGridFragment from "./ContentPageFragment/ContentGridFragment";
import ContentGridSearchFragment from "./ContentPageFragment/ContentGridSearchFragment";
import HomeFragment from "./ContentPageFragment/HomeFragment";
import MoreFragment from "./ContentPageFragment/MoreFragment";

export default function ContentPage() {
    const [query, setQuery] = useSessionState<string>("searchQuery", "");
    const [menuItem, setMenuItem] = useSessionState<number>("selectedMenuItem", 0); // 0: Home, 1: Movies, 2: Series, 3: More
    const displatch = useDispatch();
    const navigate = useNavigate();


    function onContentSelected(content: Catalog) {
        displatch(setSelectedContent(content))
        navigate("/content");
    }

    return (
        <Box sx={{ height: "100%" }}>
            <Header backgroundColor="#000000ba" rightElement={
                (menuItem !== 3) && (<HeaderSearchField value={query} onChange={setQuery} />)
            } />
            <Box sx={{ paddingBottom: 10, paddingTop: "64px" }}>
                {(query.length > 0 && menuItem !== 3) ? (
                    <ContentGridSearchFragment query={query} onContentSelected={onContentSelected} />
                ) : (
                    <>
                        {menuItem === 0 && <HomeFragment onContentSelected={onContentSelected} />}
                        {menuItem === 1 && <ContentGridFragment onContentSelected={onContentSelected} type="Movie" />}
                        {menuItem === 2 && <ContentGridFragment onContentSelected={onContentSelected} type="Serie" />}
                        {menuItem === 3 && <MoreFragment />}
                    </>
                )}
            </Box>


            <Box sx={{
                position: "fixed",
                marginLeft: "auto",
                marginRight: "auto",
                width: "100vw",
                bottom: 10
            }}>
                <BottomNavigation showLabels
                    value={menuItem}
                    onChange={(_event, newValue) => {
                        setMenuItem(newValue)
                        console.log(newValue);
                    }}
                    sx={{
                        width: "90vw",
                        margin: "auto",
                        borderRadius: 2.5

                    }}>
                    <BottomNavigationAction label="Hjem" icon={<HomeFilledIcon />} />
                    <BottomNavigationAction label="Filmer" icon={<LocalMoviesIcon />} />
                    <BottomNavigationAction label="Serier" icon={<TvIcon />} />
                    <BottomNavigationAction label="Mer" icon={<MoreHorizIcon />} />
                </BottomNavigation>
            </Box>

        </Box>
    )
}