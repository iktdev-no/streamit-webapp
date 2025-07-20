import { Box, Typography } from "@mui/material";
import type { ServerInfo } from "../../../types/serverInfo";

export interface ServerItemProps {
    serverInfo: ServerInfo;
}

export default function ServerItem({ serverInfo }: ServerItemProps) {
    return (
        <Box sx={{ backgroundColor: 'primary.dark', padding: 2, borderRadius: 2, textAlign: 'left', color: 'white', width: {
            xs: '100%', // Full width on small screens
            sm: '50%',  // Half width on medium screens
            md: '33.33%' // One third width on large screens
        } }}>
            <Typography variant="h5">{serverInfo.name}</Typography>
            <Typography variant="body1">{serverInfo.lan}</Typography>
            <Typography variant="body1">{serverInfo.remote}</Typography>
        </Box>)
}