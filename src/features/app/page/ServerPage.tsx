import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ServerItem from "../components/ServerItem";
import { serverStorage } from "../useStorage";

export default function ServerPage() {
    const navigate = useNavigate();
    const activeServer = serverStorage.get();

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Header
                title="Server"
                onBackClicked={() => { navigate(-1); }}
            />
            <Box sx={{ paddingTop: "64px", display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h4" sx={{ textAlign: "center", marginTop: 2 }}>Aktiv server</Typography>
                {activeServer ? (
                    <ServerItem serverInfo={activeServer} />
                ) : (<p>Ingen aktiv server</p>)}
            </Box>


        </Box>
    );
}